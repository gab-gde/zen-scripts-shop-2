import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { supabase } from '../lib/supabase';
import { sendSupportNotificationEmail } from '../services/email';

const router = Router();

const supportMessageSchema = z.object({
  email: z.string().email('Invalid email'),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(5000),
});

// POST /api/support
router.post('/', async (req: Request, res: Response) => {
  try {
    const validation = supportMessageSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ success: false, error: 'Validation error', details: validation.error.errors });
    }

    const { email, subject, message } = validation.data;

    const { error: insertError } = await supabase.from('support_messages').insert({ email, subject, message });

    if (insertError) {
      console.error('[SUPPORT] Insert error:', insertError);
      return res.status(500).json({ success: false, error: 'Failed to save message' });
    }

    await sendSupportNotificationEmail({ email, subject, message });

    res.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('[SUPPORT] Error:', error);
    res.status(500).json({ success: false, error: 'Failed to send message' });
  }
});

export default router;
