import { Router, Request, Response } from 'express';
import { stripe } from '../lib/stripe';
import { supabase } from '../lib/supabase';
import { config } from '../lib/config';
import { generateLicense } from '../services/license-generator';
import { getBaseScript, storeBuild, getDownloadUrl, getSecurityPdfBase64 } from '../services/storage';
import { sendOrderConfirmationWithBuild, sendAdminNotification } from '../services/email';
import { awardPoints } from '../services/points';
import { markRewardCodeUsed } from '../services/points';

const router = Router();

// POST /api/webhooks/stripe
router.post('/stripe', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('[Webhook] Signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`[Webhook] Event: ${event.type}`);

  // ────────────────────────────────────────────────────────────────
  // CHECKOUT COMPLETED (one-time payment for scripts)
  // ────────────────────────────────────────────────────────────────
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;

    // Check if this is a subscription checkout
    if (session.mode === 'subscription') {
      await handleSubscriptionCreated(session);
    } else {
      await handleScriptPurchase(session);
    }
  }

  // ────────────────────────────────────────────────────────────────
  // SUBSCRIPTION RENEWED
  // ────────────────────────────────────────────────────────────────
  if (event.type === 'invoice.paid') {
    const invoice = event.data.object as any;
    if (invoice.subscription && invoice.billing_reason === 'subscription_cycle') {
      await handleSubscriptionRenewal(invoice);
    }
  }

  // ────────────────────────────────────────────────────────────────
  // SUBSCRIPTION CANCELLED / EXPIRED
  // ────────────────────────────────────────────────────────────────
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as any;
    await handleSubscriptionEnded(subscription);
  }

  res.json({ received: true });
});

// ══════════════════════════════════════════════════════════════════════
// HANDLE SCRIPT PURCHASE
// ══════════════════════════════════════════════════════════════════════
async function handleScriptPurchase(session: any) {
  try {
    const scriptId = session.metadata?.script_id;
    const scriptName = session.metadata?.script_name || 'Unknown';
    const scriptSlug = session.metadata?.script_slug || 'unknown';
    const userId = session.metadata?.user_id || null;
    const rewardCodeId = session.metadata?.reward_code_id || null;
    const customerEmail = session.customer_details?.email || session.customer_email;
    const amountTotal = session.amount_total;
    const currency = session.currency?.toUpperCase() || 'EUR';

    const pseudo = session.custom_fields?.find((f: any) => f.key === 'pseudo')?.text?.value
      || customerEmail?.split('@')[0]
      || 'Client';

    const orderNumber = `ZS-${Date.now().toString(36).toUpperCase()}`;

    console.log(`[Webhook] New order: ${orderNumber} | ${scriptName} | ${pseudo} | ${customerEmail} | User: ${userId || 'guest'}`);

    // 1. Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        email: customerEmail,
        script_id: scriptId,
        amount_cents: amountTotal,
        currency,
        stripe_session_id: session.id,
        payment_status: 'paid',
        buyer_pseudo: pseudo,
        user_id: userId,
      })
      .select()
      .single();

    if (orderError) {
      console.error('[Webhook] Order creation error:', orderError);
    }

    // 2. Mark reward code as used
    if (rewardCodeId) {
      await markRewardCodeUsed(rewardCodeId);
    }

    // 3. Award points to user
    if (userId && order) {
      const pointsEarned = Math.floor((amountTotal / 100) * config.points.perEurSpent);
      await awardPoints(userId, pointsEarned, 'purchase_reward', `Achat: ${scriptName} (+${pointsEarned} pts)`, order.id);

      // Add to user's script library
      const { data: buildData } = await supabase
        .from('builds')
        .select('license_key')
        .eq('order_id', order.id)
        .single();

      await supabase.from('user_scripts').upsert({
        user_id: userId,
        script_id: scriptId,
        order_id: order.id,
        license_key: buildData?.license_key || null,
      }, { onConflict: 'user_id,script_id' });
    }

    // 4. Generate build
    let buildInfo: any = null;
    let downloadUrl: string | null = null;

    try {
      console.log(`[Build] Generating for ${pseudo}...`);
      const baseCode = await getBaseScript(scriptSlug);

      if (baseCode) {
        const result = generateLicense(baseCode, pseudo, customerEmail, scriptSlug);
        const storagePath = await storeBuild(result.filename, result.protectedCode, order?.id || orderNumber);

        if (storagePath) {
          downloadUrl = await getDownloadUrl(storagePath);

          const { error: buildError } = await supabase.from('builds').insert({
            order_id: order?.id,
            script_id: scriptId,
            buyer_pseudo: pseudo,
            buyer_email: customerEmail,
            license_key: result.licenseKey,
            watermark: result.watermark,
            filename: result.filename,
            storage_path: storagePath,
            script_name: result.scriptName,
          });

          if (buildError) console.error('[Build] DB error:', buildError);

          // Update user_scripts with license key
          if (userId) {
            await supabase
              .from('user_scripts')
              .update({ license_key: result.licenseKey })
              .eq('user_id', userId)
              .eq('script_id', scriptId);
          }

          buildInfo = result;
          console.log(`[Build] ✅ ${result.filename} | Key: ${result.licenseKey}`);
        }
      } else {
        console.warn(`[Build] ⚠️ No base script for "${scriptSlug}"`);
      }
    } catch (buildErr) {
      console.error('[Build] Generation error:', buildErr);
    }

    // 5. Security PDF
    let securityPdf: string | null = null;
    try {
      securityPdf = await getSecurityPdfBase64();
    } catch (pdfErr) {
      console.warn('[Email] Security PDF unavailable:', pdfErr);
    }

    // 6. Send client email
    const amount = `${(amountTotal / 100).toFixed(2)} ${currency === 'EUR' ? '€' : currency}`;
    await sendOrderConfirmationWithBuild(
      customerEmail, orderNumber, scriptName, amount, pseudo,
      buildInfo?.licenseKey || null, downloadUrl, buildInfo?.filename || null, securityPdf
    );

    // 7. Admin notification
    await sendAdminNotification(
      orderNumber, scriptName, customerEmail, amount, pseudo,
      buildInfo?.licenseKey || 'NON GÉNÉRÉ', !!downloadUrl
    );

    console.log(`[Webhook] ✅ Order ${orderNumber} completed`);
  } catch (err) {
    console.error('[Webhook] Script purchase error:', err);
  }
}

// ══════════════════════════════════════════════════════════════════════
// HANDLE SUBSCRIPTION CREATED
// ══════════════════════════════════════════════════════════════════════
async function handleSubscriptionCreated(session: any) {
  try {
    const userId = session.metadata?.user_id;
    const tier = session.metadata?.tier || 'pro';
    const subscriptionId = session.subscription;

    if (!userId) {
      console.error('[Subscription] No user_id in metadata');
      return;
    }

    // Get subscription details
    const sub = await stripe.subscriptions.retrieve(subscriptionId);
    const periodEnd = new Date((sub as any).current_period_end * 1000);

    // Update user
    await supabase.from('users').update({
      is_subscribed: true,
      subscription_tier: tier,
      stripe_subscription_id: subscriptionId,
      subscription_expires_at: periodEnd.toISOString(),
    }).eq('id', userId);

    // Log event
    await supabase.from('subscription_events').insert({
      user_id: userId,
      event_type: 'created',
      tier,
      stripe_event_id: session.id,
    });

    // Award subscription bonus points
    await awardPoints(userId, config.points.subscriptionBonusMonthly, 'subscription_bonus', `Bonus abonnement ${tier}`);

    console.log(`[Subscription] ✅ User ${userId} subscribed to ${tier}`);
  } catch (err) {
    console.error('[Subscription] Creation error:', err);
  }
}

// ══════════════════════════════════════════════════════════════════════
// HANDLE SUBSCRIPTION RENEWAL
// ══════════════════════════════════════════════════════════════════════
async function handleSubscriptionRenewal(invoice: any) {
  try {
    const subscriptionId = invoice.subscription;

    const { data: user } = await supabase
      .from('users')
      .select('id, subscription_tier')
      .eq('stripe_subscription_id', subscriptionId)
      .single();

    if (!user) return;

    const sub = await stripe.subscriptions.retrieve(subscriptionId);
    const periodEnd = new Date((sub as any).current_period_end * 1000);

    // Update expiry
    await supabase.from('users').update({
      subscription_expires_at: periodEnd.toISOString(),
    }).eq('id', user.id);

    // Award monthly bonus
    await awardPoints(user.id, config.points.subscriptionBonusMonthly, 'subscription_bonus', `Bonus mensuel ${user.subscription_tier}`);

    // Log event
    await supabase.from('subscription_events').insert({
      user_id: user.id,
      event_type: 'renewed',
      tier: user.subscription_tier || 'pro',
    });

    console.log(`[Subscription] ✅ Renewed for user ${user.id}`);
  } catch (err) {
    console.error('[Subscription] Renewal error:', err);
  }
}

// ══════════════════════════════════════════════════════════════════════
// HANDLE SUBSCRIPTION ENDED
// ══════════════════════════════════════════════════════════════════════
async function handleSubscriptionEnded(subscription: any) {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('id, subscription_tier')
      .eq('stripe_subscription_id', subscription.id)
      .single();

    if (!user) return;

    await supabase.from('users').update({
      is_subscribed: false,
      subscription_tier: null,
      stripe_subscription_id: null,
    }).eq('id', user.id);

    await supabase.from('subscription_events').insert({
      user_id: user.id,
      event_type: 'expired',
      tier: user.subscription_tier || 'unknown',
    });

    console.log(`[Subscription] ❌ Ended for user ${user.id}`);
  } catch (err) {
    console.error('[Subscription] End error:', err);
  }
}

export default router;
