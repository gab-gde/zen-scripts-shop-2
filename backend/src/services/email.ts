import { Resend } from 'resend';
import { config } from '../lib/config';

const resend = new Resend(config.resend.apiKey);

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
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
    <h1 style="color: #fff; margin: 0;">🎮 Merci pour votre achat !</h1>
  </div>
  
  <div style="background: #fff; padding: 30px; border-radius: 0 0 12px 12px; border: 1px solid #e9ecef;">
    
    <h2 style="color: #1a1a2e; border-bottom: 2px solid #00ff88; padding-bottom: 10px;">Commande confirmée ✅</h2>
    
    <table style="width: 100%; margin: 20px 0;">
      <tr>
        <td style="padding: 12px; background: #f8f9fa; border-bottom: 1px solid #e9ecef;">Numéro de commande</td>
        <td style="padding: 12px; border-bottom: 1px solid #e9ecef; font-weight: bold;">${orderNumber}</td>
      </tr>
      <tr>
        <td style="padding: 12px; background: #f8f9fa; border-bottom: 1px solid #e9ecef;">Script</td>
        <td style="padding: 12px; border-bottom: 1px solid #e9ecef; font-weight: bold;">${scriptName}</td>
      </tr>
      <tr>
        <td style="padding: 12px; background: #f8f9fa;">Montant</td>
        <td style="padding: 12px; font-weight: bold; color: #00bf63; font-size: 18px;">${amount}</td>
      </tr>
    </table>
    
    <div style="background: #e8f4f8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0f3460;">
      <h3 style="color: #0f3460; margin-top: 0;">📋 PROCHAINES ÉTAPES</h3>
      <ol style="margin: 0; padding-left: 20px;">
        <li style="margin-bottom: 10px;"><strong>Rejoignez notre Discord</strong></li>
        <li style="margin-bottom: 10px;">Dans <code>#registration</code>, postez: "Commande ${orderNumber} - Serial: [VOTRE SERIAL]"</li>
        <li style="margin-bottom: 10px;">Allez sur <a href="https://marketplace.cmindapi.com">marketplace.cmindapi.com</a></li>
        <li>Flashez le script depuis "My Scripts"</li>
      </ol>
    </div>
    
    <div style="background: #fff8e1; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
      <strong>💡 Serial Cronus Zen:</strong> Zen Studio → Device → Serial (16 caractères)
    </div>
    
  </div>
</body>
</html>`;

  try {
    await resend.emails.send({
      from: 'Zen Scripts <onboarding@resend.dev>',
      to: [to],
      subject: `✅ Commande confirmée - ${orderNumber}`,
      html: htmlContent,
    });
    console.log(`[EMAIL] Confirmation sent to ${to}`);
  } catch (error) {
    console.error('[EMAIL] Failed:', error);
  }
}

export async function sendAdminNotificationEmail(data: OrderEmailData): Promise<void> {
  const { orderNumber, scriptName, amount, to: customerEmail } = data;

  try {
    await resend.emails.send({
      from: 'Zen Scripts <onboarding@resend.dev>',
      to: [config.admin.email],
      subject: `🎉 Nouvelle commande - ${orderNumber}`,
      html: `<h2>Nouvelle commande!</h2><p>Commande: ${orderNumber}</p><p>Client: ${customerEmail}</p><p>Script: ${scriptName}</p><p>Montant: ${amount}</p>`,
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
      from: 'Zen Scripts Support <onboarding@resend.dev>',
      to: [config.admin.email],
      reply_to: data.email,
      subject: `[Support] ${data.subject}`,
      html: `<h2>Message de support</h2><p>De: ${data.email}</p><p>Sujet: ${data.subject}</p><hr><p>${data.message}</p>`,
    });
    console.log(`[EMAIL] Support notification sent`);
  } catch (error) {
    console.error('[EMAIL] Support notification failed:', error);
  }
}

export default resend;
