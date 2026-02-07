import { Router, Request, Response } from 'express';
import { stripe } from '../lib/stripe';
import { supabase } from '../lib/supabase';
import { generateLicense } from '../services/license-generator';
import { getBaseScript, storeBuild, getDownloadUrl } from '../services/storage';
import { sendOrderConfirmationWithBuild, sendAdminNotification } from '../services/email';

const router = Router();

// POST /api/webhooks/stripe
router.post('/stripe', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, // raw body
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('[Webhook] Signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any;

    try {
      const scriptId = session.metadata?.script_id;
      const scriptName = session.metadata?.script_name || 'Unknown';
      const scriptSlug = session.metadata?.script_slug || 'unknown';
      const customerEmail = session.customer_details?.email || session.customer_email;
      const amountTotal = session.amount_total;
      const currency = session.currency?.toUpperCase() || 'EUR';

      // ← NOUVEAU: Récupérer le pseudo du champ custom Stripe
      const pseudo = session.custom_fields?.find((f: any) => f.key === 'pseudo')?.text?.value 
                     || customerEmail?.split('@')[0] 
                     || 'Client';

      // Générer le numéro de commande
      const orderNumber = `ZS-${Date.now().toString(36).toUpperCase()}`;

      console.log(`[Webhook] Nouvelle commande: ${orderNumber} | ${scriptName} | ${pseudo} | ${customerEmail}`);

      // 1. Créer la commande en DB
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
          buyer_pseudo: pseudo, // ← NOUVEAU champ
        })
        .select()
        .single();

      if (orderError) {
        console.error('[Webhook] Erreur création commande:', orderError);
      }

      // 2. ← NOUVEAU: Générer automatiquement le build chiffré
      let buildInfo: any = null;
      let downloadUrl: string | null = null;

      try {
        console.log(`[Build] Génération du build pour ${pseudo}...`);

        // Récupérer le script .gpc de base depuis Supabase Storage
        const baseCode = await getBaseScript(scriptSlug);
        
        if (baseCode) {
          // Générer le build chiffré unique
          const result = generateLicense(baseCode, pseudo, customerEmail, scriptSlug);

          // Stocker dans Supabase Storage
          const storagePath = await storeBuild(
            result.filename, 
            result.protectedCode, 
            order?.id || orderNumber
          );

          if (storagePath) {
            // Générer le lien de téléchargement (valide 24h)
            downloadUrl = await getDownloadUrl(storagePath);

            // Enregistrer le build dans la table builds
            const { error: buildError } = await supabase
              .from('builds')
              .insert({
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

            if (buildError) {
              console.error('[Build] Erreur enregistrement build:', buildError);
            }

            buildInfo = result;
            console.log(`[Build] ✅ Build généré: ${result.filename} | Clé: ${result.licenseKey}`);
          }
        } else {
          console.warn(`[Build] ⚠️ Pas de script de base trouvé pour "${scriptSlug}". Build manuel requis.`);
        }
      } catch (buildErr) {
        console.error('[Build] Erreur génération:', buildErr);
      }

      // 3. Envoyer l'email au client
      const amount = `${(amountTotal / 100).toFixed(2)} ${currency === 'EUR' ? '€' : currency}`;

      if (downloadUrl && buildInfo) {
        // Email AVEC lien de téléchargement automatique
        await sendOrderConfirmationWithBuild(
          customerEmail,
          orderNumber,
          scriptName,
          amount,
          pseudo,
          buildInfo.licenseKey,
          downloadUrl,
          buildInfo.filename
        );
      } else {
        // Fallback: email sans build (génération manuelle requise)
        await sendOrderConfirmationWithBuild(
          customerEmail,
          orderNumber,
          scriptName,
          amount,
          pseudo,
          null,
          null,
          null
        );
      }

      // 4. Notifier l'admin
      await sendAdminNotification(
        orderNumber,
        scriptName,
        customerEmail,
        amount,
        pseudo,
        buildInfo?.licenseKey || 'NON GÉNÉRÉ',
        !!downloadUrl
      );

      console.log(`[Webhook] ✅ Commande ${orderNumber} traitée complètement`);

    } catch (err) {
      console.error('[Webhook] Erreur traitement:', err);
    }
  }

  res.json({ received: true });
});

export default router;
