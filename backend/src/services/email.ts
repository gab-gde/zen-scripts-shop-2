import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || 'contact@scriptszeus.eu';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@scriptszeus.eu';
const SITE_URL = process.env.FRONTEND_URL || 'https://scriptszeus.eu';

// ══════════════════════════════════════════════════════════════════════
// EMAIL CLIENT - Build + PDF sécurité en pièce jointe
// ══════════════════════════════════════════════════════════════════════
export async function sendOrderConfirmationWithBuild(
  customerEmail: string,
  orderNumber: string,
  scriptName: string,
  amount: string,
  pseudo: string,
  licenseKey: string | null,
  downloadUrl: string | null,
  filename: string | null,
  securityPdfBase64?: string | null
) {
  // Section téléchargement
  const downloadSection = downloadUrl ? `
    <div style="background: linear-gradient(135deg, #0a2a0a 0%, #0a1a0a 100%); border: 2px solid #22c55e; border-radius: 12px; padding: 25px; margin-bottom: 25px; text-align: center;">
      <h2 style="color: #22c55e; margin: 0 0 10px 0; font-size: 22px;">🎮 Votre script est prêt !</h2>
      <p style="color: #9ca3af; font-size: 14px; margin: 0 0 20px 0;">
        Build unique généré pour <strong style="color: #fff;">${pseudo}</strong>
      </p>
      <a href="${downloadUrl}" style="display: inline-block; background: #22c55e; color: #000; padding: 14px 40px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
        ⬇️ Télécharger ${filename || 'votre script'}
      </a>
      <p style="color: #6b7280; font-size: 12px; margin: 15px 0 0 0;">
        ⏰ Ce lien expire dans 24 heures. Téléchargez votre script dès maintenant.
      </p>
      ${licenseKey ? `<p style="color: #6b7280; font-size: 12px; margin: 10px 0 0 0;">🔑 Clé de licence : <code style="color: #facc15; background: #1a1a2e; padding: 2px 8px; border-radius: 4px;">${licenseKey}</code></p>` : ''}
    </div>

    <div style="background: #16161f; border-radius: 12px; padding: 20px; margin-bottom: 25px; border: 1px solid #2a2a3a;">
      <h3 style="color: #fff; margin: 0 0 15px 0; font-size: 16px;">📋 Installation en 3 étapes</h3>
      <div style="margin-bottom: 10px;">
        <span style="background: #facc15; color: #000; padding: 2px 8px; border-radius: 50%; font-weight: bold; font-size: 12px;">1</span>
        <span style="color: #d1d5db; margin-left: 10px;">Ouvrez <strong>Zen Studio</strong> sur votre PC</span>
      </div>
      <div style="margin-bottom: 10px;">
        <span style="background: #facc15; color: #000; padding: 2px 8px; border-radius: 50%; font-weight: bold; font-size: 12px;">2</span>
        <span style="color: #d1d5db; margin-left: 10px;">Importez le fichier .gpc téléchargé → <strong>Compilez</strong></span>
      </div>
      <div>
        <span style="background: #facc15; color: #000; padding: 2px 8px; border-radius: 50%; font-weight: bold; font-size: 12px;">3</span>
        <span style="color: #d1d5db; margin-left: 10px;"><strong>Flashez</strong> sur votre Cronus Zen et jouez !</span>
      </div>
    </div>
  ` : `
    <div style="background: #16161f; border-radius: 12px; padding: 25px; margin-bottom: 25px; border: 1px solid #2a2a3a;">
      <h2 style="color: #fff; margin: 0 0 20px 0; font-size: 18px;">📋 Prochaines étapes</h2>
      <p style="color: #d1d5db;">Votre build est en cours de préparation. Vous recevrez un email avec le lien de téléchargement très prochainement.</p>
    </div>
  `;

  // Section sécurité (si PDF joint)
  const securitySection = securityPdfBase64 ? `
    <div style="background: linear-gradient(135deg, #1a0a0a 0%, #0a0a12 100%); border: 1px solid #dc2626; border-radius: 12px; padding: 20px; margin-bottom: 25px;">
      <h3 style="color: #f87171; margin: 0 0 10px 0; font-size: 15px;">🔐 Document de Sécurité (en pièce jointe)</h3>
      <p style="color: #9ca3af; margin: 0; font-size: 13px;">
        Votre script est protégé par le <strong style="color: #fff;">Zeus_Prenium Security Framework v3.0</strong> 
        (7 couches de protection). Consultez le PDF joint pour les détails complets.
        Votre copie contient des watermarks forensiques, des hash chains et des fingerprints 
        de timing uniques liés à <strong style="color: #facc15;">${pseudo}</strong>. 
        Le partage est <strong style="color: #f87171;">strictement interdit</strong> et détectable.
      </p>
    </div>
  ` : `
    <div style="background: #1a0a0a; border: 1px solid #dc2626; border-radius: 12px; padding: 15px; margin-bottom: 25px;">
      <p style="color: #f87171; margin: 0; font-size: 13px;">
        🔐 <strong>Script chiffré et unique.</strong> Watermarks et fingerprints liés à "${pseudo}". Le partage est interdit et détectable.
      </p>
    </div>
  `;

  // Pièces jointes
  const attachments: any[] = [];
  if (securityPdfBase64) {
    attachments.push({
      filename: 'Zeus_Prenium_Security_Document.pdf',
      content: securityPdfBase64,
    });
  }

  try {
    await resend.emails.send({
      from: `Scripts Zeus <${FROM_EMAIL}>`,
      to: customerEmail,
      subject: downloadUrl
        ? `🎮 Votre script ${scriptName} est prêt ! Téléchargez-le maintenant`
        : `🎮 Commande confirmée - ${scriptName}`,
      attachments: attachments.length > 0 ? attachments : undefined,
      html: `
        <div style="max-width: 600px; margin: 0 auto; background: #0a0a12; color: #fff; font-family: -apple-system, sans-serif;">
          <div style="background: linear-gradient(135deg, #1a1a2e 0%, #0a0a12 100%); padding: 30px; text-align: center; border-bottom: 2px solid #facc15;">
            <h1 style="color: #facc15; margin: 0; font-size: 28px;">⚡ Scripts Zeus</h1>
            <p style="color: #9ca3af; margin: 5px 0 0 0;">Zen Premium</p>
          </div>
          
          <div style="padding: 30px;">
            <h2 style="color: #fff; margin: 0 0 20px 0;">
              ${downloadUrl ? '🎉 Votre script est prêt !' : 'Merci pour votre achat !'}
            </h2>
            
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
                  <td style="padding: 10px 0; color: #9ca3af; border-bottom: 1px solid #2a2a3a;">Pseudo</td>
                  <td style="padding: 10px 0; color: #facc15; font-weight: bold; text-align: right; border-bottom: 1px solid #2a2a3a;">${pseudo}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #9ca3af;">Montant</td>
                  <td style="padding: 10px 0; color: #facc15; font-weight: bold; text-align: right; font-size: 20px;">${amount}</td>
                </tr>
              </table>
            </div>

            ${downloadSection}

            ${securitySection}

            <p style="color: #9ca3af; font-size: 14px; text-align: center;">
              Questions ? Contactez-nous via <a href="${SITE_URL}/support" style="color: #facc15;">notre page support</a>.
            </p>
          </div>
          
          <div style="background: #16161f; padding: 20px; text-align: center; border-top: 1px solid #2a2a3a;">
            <p style="color: #4b5563; font-size: 12px; margin: 0;">
              &copy; ${new Date().getFullYear()} Scripts Zeus - Zen Premium | Tous droits réservés
            </p>
          </div>
        </div>
      `,
    });
    console.log(`[Email] Confirmation envoyée à ${customerEmail} (build auto: ${!!downloadUrl}, PDF: ${!!securityPdfBase64})`);
  } catch (error) {
    console.error('[Email] Erreur envoi confirmation:', error);
  }
}

// ══════════════════════════════════════════════════════════════════════
// EMAIL ADMIN
// ══════════════════════════════════════════════════════════════════════
export async function sendAdminNotification(
  orderNumber: string,
  scriptName: string,
  customerEmail: string,
  amount: string,
  pseudo: string,
  licenseKey: string,
  autoGenerated: boolean
) {
  try {
    await resend.emails.send({
      from: `Scripts Zeus <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      subject: `💰 ${autoGenerated ? '✅ AUTO' : '⚠️ MANUEL'} - ${scriptName} (${amount}) - ${pseudo}`,
      html: `
        <div style="max-width: 500px; margin: 0 auto; background: #0a0a12; color: #fff; font-family: sans-serif; padding: 30px; border-radius: 12px;">
          <h2 style="color: #facc15; margin-top: 0;">💰 Nouvelle vente !</h2>
          
          <div style="background: ${autoGenerated ? '#0a2a0a' : '#2a1a0a'}; border: 1px solid ${autoGenerated ? '#22c55e' : '#f59e0b'}; border-radius: 8px; padding: 12px; margin-bottom: 20px; text-align: center;">
            <span style="color: ${autoGenerated ? '#22c55e' : '#f59e0b'}; font-weight: bold;">
              ${autoGenerated ? '✅ BUILD AUTO + PDF SÉCURITÉ' : '⚠️ BUILD MANUEL REQUIS'}
            </span>
          </div>

          <table style="width: 100%;">
            <tr><td style="color: #9ca3af; padding: 8px 0;">Commande</td><td style="color: #fff; text-align: right;">${orderNumber}</td></tr>
            <tr><td style="color: #9ca3af; padding: 8px 0;">Script</td><td style="color: #fff; text-align: right;">${scriptName}</td></tr>
            <tr><td style="color: #9ca3af; padding: 8px 0;">Client</td><td style="color: #fff; text-align: right;">${customerEmail}</td></tr>
            <tr><td style="color: #9ca3af; padding: 8px 0;">Pseudo</td><td style="color: #facc15; text-align: right; font-weight: bold;">${pseudo}</td></tr>
            <tr><td style="color: #9ca3af; padding: 8px 0;">Clé licence</td><td style="color: #fff; text-align: right; font-family: monospace; font-size: 12px;">${licenseKey}</td></tr>
            <tr><td style="color: #9ca3af; padding: 8px 0;">Montant</td><td style="color: #facc15; text-align: right; font-size: 20px; font-weight: bold;">${amount}</td></tr>
          </table>
        </div>
      `,
    });
    console.log(`[Email] Notification admin envoyée`);
  } catch (error) {
    console.error('[Email] Erreur envoi admin:', error);
  }
}

// ══════════════════════════════════════════════════════════════════════
// EMAIL SUPPORT
// ══════════════════════════════════════════════════════════════════════
export async function sendSupportNotification(
  senderEmail: string,
  subject: string,
  message: string
) {
  try {
    await resend.emails.send({
      from: `Scripts Zeus Support <${FROM_EMAIL}>`,
      to: ADMIN_EMAIL,
      reply_to: senderEmail,
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

// Alias pour compatibilité avec support.ts
export const sendSupportNotificationEmail = (data: { email: string; subject: string; message: string }) => {
  return sendSupportNotification(data.email, data.subject, data.message);
};
