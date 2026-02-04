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
  <title>Confirmation de commande</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  
  <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
    <h1 style="color: #fff; margin: 0; font-size: 24px;">🎮 Merci pour votre achat !</h1>
  </div>
  
  <div style="background: #ffffff; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    
    <h2 style="color: #1a1a2e; margin-top: 0; border-bottom: 2px solid #e94560; padding-bottom: 10px;">Commande confirmée ✅</h2>
    
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #f8f9fa; border-radius: 8px; overflow: hidden;">
      <tr>
        <td style="padding: 15px; border-bottom: 1px solid #e9ecef; color: #666; width: 40%;">Numéro de commande</td>
        <td style="padding: 15px; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #1a1a2e;">${orderNumber}</td>
      </tr>
      <tr>
        <td style="padding: 15px; border-bottom: 1px solid #e9ecef; color: #666;">Script</td>
        <td style="padding: 15px; border-bottom: 1px solid #e9ecef; font-weight: bold; color: #1a1a2e;">${scriptName}</td>
      </tr>
      <tr>
        <td style="padding: 15px; color: #666;">Montant payé</td>
        <td style="padding: 15px; font-weight: bold; color: #00bf63; font-size: 18px;">${amount}</td>
      </tr>
    </table>
    
    <div style="background: linear-gradient(135deg, #e8f4f8 0%, #f0f9ff 100%); padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #0f3460;">
      <h3 style="color: #0f3460; margin-top: 0; font-size: 16px;">📋 PROCHAINES ÉTAPES</h3>
      <ol style="margin: 0; padding-left: 20px; color: #333;">
        <li style="margin-bottom: 12px;"><strong>Rejoignez notre Discord</strong> pour accéder au support et à la communauté</li>
        <li style="margin-bottom: 12px;">Dans le canal <code style="background: #fff; padding: 3px 8px; border-radius: 4px; font-size: 13px; color: #e94560;">#registration</code>, postez :<br>
          <em style="color: #666;">"Commande ${orderNumber} - Serial: [VOTRE SERIAL ZEN]"</em>
        </li>
        <li style="margin-bottom: 12px;">Une fois validé, allez sur <a href="https://marketplace.cmindapi.com" style="color: #e94560; text-decoration: none; font-weight: bold;">marketplace.cmindapi.com</a></li>
        <li style="margin-bottom: 0;">Connectez votre Cronus Zen et flashez le script depuis <strong>"My Scripts"</strong></li>
      </ol>
    </div>
    
    <div style="background: #fff8e1; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107;">
      <strong style="color: #856404;">💡 Où trouver votre serial Cronus Zen ?</strong><br>
      <span style="color: #666; font-size: 14px;">Ouvrez <strong>Zen Studio</strong> → Onglet <strong>Device</strong> → Votre serial est affiché (16 caractères)</span>
    </div>
    
    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; text-align: center;">
      <p style="color: #666; margin: 0; font-size: 14px;">
        Des questions ? Consultez notre <a href="${config.siteUrl}/faq" style="color: #e94560;">FAQ</a> ou contactez-nous via <a href="${config.siteUrl}/support" style="color: #e94560;">Support</a>
      </p>
    </div>
    
  </div>
  
  <p style="text-align: center; color: #999; font-size: 12px; margin-top: 20px;">
    © 2026 Zen Scripts Shop. Tous droits réservés.
  </p>
  
</body>
</html>
  `;

  const textContent = `
MERCI POUR VOTRE ACHAT !

Commande confirmée
==================
Numéro de commande: ${orderNumber}
Script: ${scriptName}
Montant: ${amount}

PROCHAINES ÉTAPES
=================
1. Rejoignez notre Discord pour le support
2. Dans #registration, postez: "Commande ${orderNumber} - Serial: [VOTRE SERIAL ZEN]"
3. Une fois validé, allez sur https://marketplace.cmindapi.com
4. Connectez votre Cronus Zen et flashez le script depuis "My Scripts"

OÙ TROUVER VOTRE SERIAL ?
Zen Studio → Device → Serial (16 caractères)

Questions ? ${config.siteUrl}/support

© 2026 Zen Scripts Shop
  `;

  try {
    await resend.emails.send({
      from: 'Zen Scripts Shop <noreply@zenscripts.shop>',
      to: [to],
      subject: `✅ Commande confirmée - ${orderNumber}`,
      html: htmlContent,
      text: textContent,
    });
    console.log(`[EMAIL] Order confirmation sent to ${to}`);
  } catch (error) {
    console.error('[EMAIL] Failed to send order confirmation:', error);
    throw error;
  }
}

export async function sendAdminNotificationEmail(data: OrderEmailData): Promise<void> {
  const { orderNumber, scriptName, amount, to: customerEmail } = data;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Nouvelle commande</title>
</head>
<body style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
  <div style="max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <h2 style="color: #1a1a2e; margin-top: 0;">🎉 Nouvelle commande reçue !</h2>
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 12px; border: 1px solid #e9ecef; background: #f8f9fa;"><strong>Commande</strong></td>
        <td style="padding: 12px; border: 1px solid #e9ecef;">${orderNumber}</td>
      </tr>
      <tr>
        <td style="padding: 12px; border: 1px solid #e9ecef; background: #f8f9fa;"><strong>Client</strong></td>
        <td style="padding: 12px; border: 1px solid #e9ecef;">${customerEmail}</td>
      </tr>
      <tr>
        <td style="padding: 12px; border: 1px solid #e9ecef; background: #f8f9fa;"><strong>Script</strong></td>
        <td style="padding: 12px; border: 1px solid #e9ecef;">${scriptName}</td>
      </tr>
      <tr>
        <td style="padding: 12px; border: 1px solid #e9ecef; background: #f8f9fa;"><strong>Montant</strong></td>
        <td style="padding: 12px; border: 1px solid #e9ecef; color: #00bf63; font-weight: bold;">${amount}</td>
      </tr>
    </table>
    <p style="margin-top: 20px; color: #666;">
      Connectez-vous à l'admin pour voir les détails et gérer le serial client.
    </p>
    <a href="${config.siteUrl}/admin" style="display: inline-block; margin-top: 15px; padding: 12px 25px; background: #e94560; color: white; text-decoration: none; border-radius: 6px;">
      Accéder à l'admin
    </a>
  </div>
</body>
</html>
  `;

  try {
    await resend.emails.send({
      from: 'Zen Scripts Shop <noreply@zenscripts.shop>',
      to: [config.admin.email],
      subject: `🎉 Nouvelle commande - ${orderNumber} - ${amount}`,
      html: htmlContent,
    });
    console.log(`[EMAIL] Admin notification sent`);
  } catch (error) {
    console.error('[EMAIL] Failed to send admin notification:', error);
    // Don't throw - admin notification is not critical
  }
}

export async function sendSupportNotificationEmail(data: {
  email: string;
  subject: string;
  message: string;
}): Promise<void> {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Nouveau message support</title>
</head>
<body style="font-family: Arial, sans-serif; padding: 20px; background: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px;">
    <h2 style="color: #1a1a2e; margin-top: 0;">📧 Nouveau message de support</h2>
    <p><strong>De:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
    <p><strong>Sujet:</strong> ${data.subject}</p>
    <hr style="border: none; border-top: 1px solid #e9ecef; margin: 20px 0;">
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; white-space: pre-wrap; font-family: inherit;">${data.message}</div>
    <hr style="border: none; border-top: 1px solid #e9ecef; margin: 20px 0;">
    <a href="mailto:${data.email}" style="display: inline-block; padding: 12px 25px; background: #0f3460; color: white; text-decoration: none; border-radius: 6px;">
      Répondre à ${data.email}
    </a>
  </div>
</body>
</html>
  `;

  try {
    await resend.emails.send({
      from: 'Zen Scripts Support <noreply@zenscripts.shop>',
      to: [config.admin.email],
      replyTo: data.email,
      subject: `[Support] ${data.subject}`,
      html: htmlContent,
    });
    console.log(`[EMAIL] Support notification sent`);
  } catch (error) {
    console.error('[EMAIL] Failed to send support notification:', error);
  }
}

export default resend;
