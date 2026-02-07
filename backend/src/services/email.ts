import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || 'contact@scriptszeus.eu';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@scriptszeus.eu';
const DISCORD_INVITE = process.env.DISCORD_INVITE || 'discord.gg/scriptszeus';

// ← CHANGÉ: Template email client - Plus de Marketplace
export async function sendOrderConfirmation(
  customerEmail: string,
  orderNumber: string,
  scriptName: string,
  amount: string
) {
  try {
    await resend.emails.send({
      from: `Scripts Zeus <${FROM_EMAIL}>`,
      to: customerEmail,
      subject: `🎮 Commande confirmée - ${scriptName}`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; background: #0a0a12; color: #fff; font-family: -apple-system, sans-serif;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1a1a2e 0%, #0a0a12 100%); padding: 30px; text-align: center; border-bottom: 2px solid #facc15;">
            <h1 style="color: #facc15; margin: 0; font-size: 28px;">⚡ Scripts Zeus</h1>
            <p style="color: #9ca3af; margin: 5px 0 0 0;">Zen Premium</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px;">
            <h2 style="color: #fff; margin: 0 0 20px 0;">Merci pour votre achat !</h2>
            
            <!-- Order details -->
            <div style="background: #16161f; border-radius: 12px; padding: 20px; margin-bottom: 25px; border: 1px solid #2a2a3a;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #9ca3af; border-bottom: 1px solid #2a2a3a;">Commande</td>
                  <td style="padding: 10px 0; color: #fff; font-weight: bold; text-align: right; font-family: monospace; border-bottom: 1px solid #2a2a3a;">${orderNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #9ca3af; border-bottom: 1px solid #2a2a3a;">Script</td>
                  <td style="padding: 10px 0; color: #fff; font-weight: bold; text-align: right; border-bottom: 1px solid #2a2a3a;">${scriptName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #9ca3af;">Montant</td>
                  <td style="padding: 10px 0; color: #facc15; font-weight: bold; text-align: right; font-size: 20px;">${amount}</td>
                </tr>
              </table>
            </div>

            <!-- Steps - CHANGÉ: Plus de Marketplace -->
            <div style="background: #16161f; border-radius: 12px; padding: 25px; margin-bottom: 25px; border: 1px solid #2a2a3a;">
              <h2 style="color: #fff; margin: 0 0 20px 0; font-size: 18px;">📋 Prochaines étapes</h2>
              
              <div style="margin-bottom: 15px; display: flex; align-items: flex-start;">
                <div style="background: #facc15; color: #0a0a12; width: 24px; height: 24px; border-radius: 50%; text-align: center; line-height: 24px; font-weight: bold; margin-right: 12px; flex-shrink: 0;">1</div>
                <div>
                  <div style="color: #fff; font-weight: 600;">Rejoignez notre Discord</div>
                  <div style="color: #9ca3af; font-size: 14px;">Lien : ${DISCORD_INVITE}</div>
                </div>
              </div>
              
              <div style="margin-bottom: 15px; display: flex; align-items: flex-start;">
                <div style="background: #facc15; color: #0a0a12; width: 24px; height: 24px; border-radius: 50%; text-align: center; line-height: 24px; font-weight: bold; margin-right: 12px; flex-shrink: 0;">2</div>
                <div>
                  <div style="color: #fff; font-weight: 600;">Postez dans #registration</div>
                  <div style="color: #9ca3af; font-size: 14px;">Commande ${orderNumber} + votre pseudo</div>
                </div>
              </div>
              
              <div style="margin-bottom: 15px; display: flex; align-items: flex-start;">
                <div style="background: #facc15; color: #0a0a12; width: 24px; height: 24px; border-radius: 50%; text-align: center; line-height: 24px; font-weight: bold; margin-right: 12px; flex-shrink: 0;">3</div>
                <div>
                  <div style="color: #fff; font-weight: 600;">Recevez votre build chiffré unique</div>
                  <div style="color: #9ca3af; font-size: 14px;">Nous générons un script .gpc unique lié à votre pseudo (sous 24h)</div>
                </div>
              </div>

              <div style="display: flex; align-items: flex-start;">
                <div style="background: #facc15; color: #0a0a12; width: 24px; height: 24px; border-radius: 50%; text-align: center; line-height: 24px; font-weight: bold; margin-right: 12px; flex-shrink: 0;">4</div>
                <div>
                  <div style="color: #fff; font-weight: 600;">Flashez avec Zen Studio</div>
                  <div style="color: #9ca3af; font-size: 14px;">Importez le .gpc → Compilez → Flashez sur votre Cronus Zen</div>
                </div>
              </div>
            </div>

            <!-- Security notice - NOUVEAU -->
            <div style="background: #1a0a0a; border: 1px solid #dc2626; border-radius: 12px; padding: 15px; margin-bottom: 25px;">
              <p style="color: #f87171; margin: 0; font-size: 13px;">
                🔐 <strong>Votre script est chiffré et unique.</strong> Il contient des watermarks et fingerprints liés à votre identité. Le partage est interdit et détectable.
              </p>
            </div>

            <p style="color: #9ca3af; font-size: 14px; text-align: center;">
              Des questions ? Répondez à cet email ou contactez-nous sur Discord.
            </p>
          </div>
          
          <!-- Footer -->
          <div style="background: #16161f; padding: 20px; text-align: center; border-top: 1px solid #2a2a3a;">
            <p style="color: #4b5563; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} Scripts Zeus - Zen Premium | Tous droits réservés
            </p>
          </div>
        </div>
      `,
    });
    console.log(`[Email] Confirmation envoyée à ${customerEmail}`);
  } catch (error) {
    console.error('[Email] Erreur envoi confirmation:', error);
  }
}

// Email admin notification
export async function sendAdminNotification(
  orderNumber: string,
  scriptName: string,
  customerEmail: string,
  amount: string
) {
  try {
    await resend.emails.send({
      from: `Scripts Zeus <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `💰 Nouvelle vente - ${scriptName} (${amount})`,
      html: `
        <div style="max-width: 500px; margin: 0 auto; background: #0a0a12; color: #fff; font-family: sans-serif; padding: 30px; border-radius: 12px;">
          <h2 style="color: #facc15; margin-top: 0;">💰 Nouvelle vente !</h2>
          <table style="width: 100%;">
            <tr><td style="color: #9ca3af; padding: 8px 0;">Commande</td><td style="color: #fff; text-align: right;">${orderNumber}</td></tr>
            <tr><td style="color: #9ca3af; padding: 8px 0;">Script</td><td style="color: #fff; text-align: right;">${scriptName}</td></tr>
            <tr><td style="color: #9ca3af; padding: 8px 0;">Client</td><td style="color: #fff; text-align: right;">${customerEmail}</td></tr>
            <tr><td style="color: #9ca3af; padding: 8px 0;">Montant</td><td style="color: #facc15; text-align: right; font-size: 20px; font-weight: bold;">${amount}</td></tr>
          </table>
          <hr style="border-color: #2a2a3a; margin: 20px 0;" />
          <p style="color: #9ca3af; font-size: 13px;">
            ⚠️ Pense à générer le build chiffré unique pour ce client une fois qu'il aura posté son pseudo sur Discord.
          </p>
        </div>
      `,
    });
    console.log(`[Email] Notification admin envoyée`);
  } catch (error) {
    console.error('[Email] Erreur envoi admin:', error);
  }
}

// Email support
export async function sendSupportNotification(
  senderEmail: string,
  subject: string,
  message: string
) {
  try {
    await resend.emails.send({
      from: `Scripts Zeus Support <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      replyTo: senderEmail,
      subject: `[Support] ${subject}`,
      html: `
        <div style="max-width: 500px; margin: 0 auto; background: #0a0a12; color: #fff; font-family: sans-serif; padding: 30px; border-radius: 12px;">
          <h2 style="color: #facc15; margin-top: 0;">📧 Nouveau message support</h2>
          <p style="color: #9ca3af;">De : ${senderEmail}</p>
          <p style="color: #9ca3af;">Sujet : ${subject}</p>
          <div style="background: #16161f; padding: 15px; border-radius: 8px; margin-top: 15px;">
            <p style="color: #fff; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error('[Email] Erreur envoi support:', error);
  }
}
