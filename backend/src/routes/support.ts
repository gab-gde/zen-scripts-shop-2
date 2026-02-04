import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { supabase } from '../lib/supabase';
import { sendSupportNotificationEmail } from '../services/email';

const router = Router();

// Validation schema
const supportMessageSchema = z.object({
  email: z.string().email('Invalid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(200, 'Subject too long'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000, 'Message too long'),
});

// POST /api/support
router.post('/', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validation = supportMessageSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: validation.error.errors,
      });
    }

    const { email, subject, message } = validation.data;

    // Save to database
    const { error: insertError } = await supabase
      .from('support_messages')
      .insert({
        email,
        subject,
        message,
      });

    if (insertError) {
      console.error('[SUPPORT] Failed to save message:', insertError);
      return res.status(500).json({
        success: false,
        error: 'Failed to save message',
      });
    }

    // Send notification to admin
    await sendSupportNotificationEmail({ email, subject, message });

    console.log(`[SUPPORT] Message saved from ${email}`);

    res.json({
      success: true,
      message: 'Your message has been sent. We will get back to you soon.',
    });
  } catch (error) {
    console.error('[SUPPORT] Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message',
    });
  }
});

export default router;
