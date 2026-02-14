import { supabase } from '../lib/supabase';
import crypto from 'crypto';

// ══════════════════════════════════════════════════════════════════════
// AWARD POINTS
// ══════════════════════════════════════════════════════════════════════
export async function awardPoints(
  userId: string,
  amount: number,
  type: string,
  description: string,
  orderId?: string
): Promise<boolean> {
  try {
    // Insert transaction
    const { error: txError } = await supabase.from('points_transactions').insert({
      user_id: userId,
      amount,
      type,
      description,
      order_id: orderId || null,
    });

    if (txError) {
      console.error('[Points] Transaction insert error:', txError);
      return false;
    }

    // Update balance
    const { data: user } = await supabase
      .from('users')
      .select('points_balance')
      .eq('id', userId)
      .single();

    if (user) {
      const newBalance = (user.points_balance || 0) + amount;
      await supabase
        .from('users')
        .update({ points_balance: newBalance })
        .eq('id', userId);
    }

    console.log(`[Points] +${amount} for user ${userId} (${type}): ${description}`);
    return true;
  } catch (error) {
    console.error('[Points] Error awarding points:', error);
    return false;
  }
}

// ══════════════════════════════════════════════════════════════════════
// SPEND POINTS (for rewards)
// ══════════════════════════════════════════════════════════════════════
export async function spendPoints(
  userId: string,
  amount: number,
  description: string
): Promise<boolean> {
  try {
    // Check balance
    const { data: user } = await supabase
      .from('users')
      .select('points_balance')
      .eq('id', userId)
      .single();

    if (!user || user.points_balance < amount) {
      return false;
    }

    // Insert negative transaction
    await supabase.from('points_transactions').insert({
      user_id: userId,
      amount: -amount,
      type: 'redemption',
      description,
    });

    // Update balance
    const newBalance = user.points_balance - amount;
    await supabase
      .from('users')
      .update({ points_balance: newBalance })
      .eq('id', userId);

    console.log(`[Points] -${amount} for user ${userId}: ${description}`);
    return true;
  } catch (error) {
    console.error('[Points] Error spending points:', error);
    return false;
  }
}

// ══════════════════════════════════════════════════════════════════════
// GENERATE REWARD CODE
// ══════════════════════════════════════════════════════════════════════
export async function generateRewardCode(
  userId: string,
  tierId: string
): Promise<{ code: string; discount_percent: number } | null> {
  try {
    // Get tier
    const { data: tier } = await supabase
      .from('reward_tiers')
      .select('*')
      .eq('id', tierId)
      .eq('is_active', true)
      .single();

    if (!tier) return null;

    // Check user balance
    const { data: user } = await supabase
      .from('users')
      .select('points_balance')
      .eq('id', userId)
      .single();

    if (!user || user.points_balance < tier.points_required) return null;

    // Spend points
    const spent = await spendPoints(
      userId,
      tier.points_required,
      `Échange récompense ${tier.name} (-${tier.discount_percent}%)`
    );

    if (!spent) return null;

    // Generate unique code
    const code = `ZS-${tier.name.toUpperCase().slice(0, 3)}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // Store reward code
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days expiry

    const { error } = await supabase.from('reward_codes').insert({
      user_id: userId,
      code,
      discount_percent: tier.discount_percent,
      points_cost: tier.points_required,
      expires_at: expiresAt.toISOString(),
    });

    if (error) {
      console.error('[Points] Error creating reward code:', error);
      return null;
    }

    console.log(`[Points] Reward code generated: ${code} (${tier.discount_percent}%) for user ${userId}`);
    return { code, discount_percent: tier.discount_percent };
  } catch (error) {
    console.error('[Points] Error generating reward code:', error);
    return null;
  }
}

// ══════════════════════════════════════════════════════════════════════
// VALIDATE REWARD CODE (for checkout)
// ══════════════════════════════════════════════════════════════════════
export async function validateRewardCode(code: string): Promise<{
  valid: boolean;
  discount_percent?: number;
  code_id?: string;
}> {
  const { data } = await supabase
    .from('reward_codes')
    .select('*')
    .eq('code', code)
    .eq('is_used', false)
    .single();

  if (!data) return { valid: false };

  if (new Date(data.expires_at) < new Date()) {
    return { valid: false };
  }

  return {
    valid: true,
    discount_percent: data.discount_percent,
    code_id: data.id,
  };
}

// ══════════════════════════════════════════════════════════════════════
// MARK REWARD CODE AS USED
// ══════════════════════════════════════════════════════════════════════
export async function markRewardCodeUsed(codeId: string): Promise<void> {
  await supabase
    .from('reward_codes')
    .update({ is_used: true, used_at: new Date().toISOString() })
    .eq('id', codeId);
}
