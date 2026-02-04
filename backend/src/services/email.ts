import { Resend } from 'resend';
import { config } from '../lib/config';

const resend = new Resend(config.resend.apiKey);

// Utilise ton domaine vérifié
const FROM_EMAIL = 'Scripts Zeus <contact@scriptszeus.eu>';

interface OrderEmailData {
  to: string;
  orderNumber: string;
  scriptName: string;
  amount: string;
}

export async function sendOrderConfirmationEmail(data: OrderEmailData): Promise<void> {
  const { to, orderNumber, scriptName, amount } = data;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0a0a12;">
  
  <div style="background: linear-gradient(135deg, #1a1a2e 0%, #0a0a12 100%); padding: 40px; border-radius: 16px; border: 1px solid #2a2a3a;">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 30px;">
      <div style="display: inline-block; background: linear-gradient(135deg, #facc15, #f59e0b); padding: 15px 25px; border-radius: 12px; margin-bottom: 20px;">
        <span style="font-size: 24px; font-weight: bold; color: #0a0a12;">⚡ Scripts Zeus</span>
      </div>
      <h1 style="color: #fff; margin: 0; font-size: 28px;">Commande Confirmée !</h1>
    </div>
    
    <!-- Order Details -->
    <div style="background: #16161f; border-radius: 12px; padding: 25px; margin-bottom: 25px; border: 1px solid #2a2a3a;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px 0; color: #9ca3af; border-bottom: 1px solid #2a2a3a;">Numéro de commande</td>
          <td style="padding: 12px 0; color: #facc15; font-weight: bold; text-align: right; font-family: monospace; border-bottom: 1px solid #2a2a3a;">${orderNumber}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; color: #9ca3af; border-bottom: 1px solid #2a2a3a;">Script</td>
          <td style="padding: 12px 0; color: #fff; font-weight: bold; text-align: right; border-bottom: 1px solid #2a2a3a;">${scriptName}</td>
        </tr>
        <tr>
          <td style="padding: 12px 0; color: #9ca3af;">Montant payé</td>
          <td style="padding: 12px 0; color: #facc15; font-weight: bold; text-align: right; font-size: 20px;">${amount}</td>
        </tr>
      </table>
    </div>
    
    <!-- Steps -->
    <div style="background: #16161f; border-radius: 12px; padding: 25px; margin-bottom: 25px; border: 1px solid #2a2a3a;">
      <h2 style="color: #fff; margin: 0 0 20px 0; font-size: 18px;">📋 Prochaines étapes</h2>
      
      <div style="margin-bottom: 15px; display: flex; align-items: flex-start;">
        <div style="background: #facc15; color: #0a0a12; width: 24px; height: 24px; border-radius: 50%; text-align: center; line-height: 24px; font-weight: bold; margin-right: 12px; flex-shrink: 0;">1</div>
        <div>
          <div style="color: #fff; font-weight: 600;">Rejoignez notre Discord</div>
          <div style="color: #9ca3af; font-size: 14px;">Lien : discord.gg/scriptszeus</div>
        </div>
      </div>
      
      <div style="margin-bottom: 15px; display: flex; align-items: flex-start;">
        <div style="background: #facc15; color: #0a0a12; width: 24px; height: 24px; border-radius: 50%; text-align: center; line-height: 24px; font-weight: bold; margin-right: 12px; flex-shrink: 0;">2</div>
        <div>
          <div style="color: #fff; font-weight: 600;">Postez dans #registration</div>
          <div style="color: #9ca3af; font-size: 14px;">Commande ${orderNumber} + votre serial Zen</div>
        </div>
      </div>
      
      <div style="display: flex; align-items: flex-start;">
        <div style="background: #facc15; color: #0a0a12; width: 24px; height: 24px; border-radius: 50%; text-align: center; line-height: 24px; font-weight: bold; margin-right: 12px; flex-shrink: 0;">3</div>
        <div>
          <div style="color: #fff; font-weight: 600;">Flashez le script</div>
          <div style="color: #9ca3af; font-size: 14px;">Depuis marketplace.cmindapi.com → My Scripts</div>
        </div>
      </div>
    </div>
    
    <!-- Serial Info -->
    <div style="background: linear-gradient(135deg, rgba(250,204,21,0.1), rgba(245,158,11,0.1)); border: 1px solid rgba(250,204,21,0.3); border-radius: 12px; padding: 20px; margin-bottom: 25px;">
      <div style="color: #facc15; font-weight: 600; margin-bottom: 8px;">💡 Où trouver votre Serial ?</div>
      <div style="color: #d1d5db; font-size: 14px;">Zen Studio → Onglet "Device" → Serial (16 caractères)</div>
    </div>
    
    <!-- Footer -->
    <div style="text-align: center; color: #6b7280; font-size: 12px;">
      <p>Merci pour votre confiance !</p>
      <p>© 2026 Scripts Zeus - scriptszeus.eu</p>
    </div>
    
  </div>
</body>
</html>`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject: `✅ Commande confirmée - ${orderNumber}`,
      html: htmlContent,
    });
    console.log(`[EMAIL] Confirmation sent to ${to}`);
  } catch (error) {
    console.error('[EMAIL] Failed to send confirmation:', error);
  }
}

export async function sendAdminNotificationEmail(data: OrderEmailData): Promise<void> {
  const { orderNumber, scriptName, amount, to: customerEmail } = data;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; background: #0a0a12;">
  <div style="max-width: 500px; margin: 0 auto; background: #16161f; border-radius: 12px; padding: 30px; border: 1px solid #2a2a3a;">
    <h1 style="color: #facc15; margin: 0 0 20px 0;">🎉 Nouvelle commande !</h1>
    <table style="width: 100%; color: #fff;">
      <tr><td style="padding: 8px 0; color: #9ca3af;">Commande</td><td style="padding: 8px 0; font-weight: bold; color: #facc15;">${orderNumber}</td></tr>
      <tr><td style="padding: 8px 0; color: #9ca3af;">Client</td><td style="padding: 8px 0;">${customerEmail}</td></tr>
      <tr><td style="padding: 8px 0; color: #9ca3af;">Script</td><td style="padding: 8px 0;">${scriptName}</td></tr>
      <tr><td style="padding: 8px 0; color: #9ca3af;">Montant</td><td style="padding: 8px 0; font-weight: bold; color: #22c55e;">${amount}</td></tr>
    </table>
  </div>
</body>
</html>`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [config.admin.email],
      subject: `🎉 Nouvelle commande - ${orderNumber}`,
      html: htmlContent,
    });
    console.log(`[EMAIL] Admin notification sent`);
  } catch (error) {
    console.error('[EMAIL] Admin notification failed:', error);
  }
}

export async function sendSupportNotificationEmail(data: {
  email: string;
  subject: string;
  message: string;
}): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: [config.admin.email],
      reply_to: data.email,
      subject: `[Support] ${data.subject}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; background: #0a0a12; color: #fff;">
          <h2 style="color: #facc15;">📩 Message de support</h2>
          <p><strong>De :</strong> ${data.email}</p>
          <p><strong>Sujet :</strong> ${data.subject}</p>
          <hr style="border-color: #2a2a3a;">
          <p style="white-space: pre-wrap;">${data.message}</p>
        </div>
      `,
    });
    console.log(`[EMAIL] Support notification sent`);
  } catch (error) {
    console.error('[EMAIL] Support notification failed:', error);
  }
}

export default resend;
