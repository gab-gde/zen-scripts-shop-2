import Link from 'next/link';

const faqs = [
  { 
    q: "Comment fonctionne l'achat et la livraison ?", 
    a: "Après paiement, vous recevez un email avec votre numéro de commande. Rejoignez notre Discord, postez votre commande + serial Zen dans #registration, puis téléchargez depuis marketplace.cmindapi.com." 
  },
  { 
    q: "Comment fonctionne la licence Marketplace ?", 
    a: "Votre script est lié à votre serial Cronus Zen (16 caractères). Distribution sécurisée et cryptée, impossible à pirater ou partager." 
  },
  { 
    q: "Quels jeux sont supportés ?", 
    a: "Nous proposons des scripts pour de nombreux jeux populaires : Fortnite, EA FC / FIFA, Rainbow Six Siege, Rocket League, Call of Duty, Apex Legends, et bien d'autres. Consultez notre catalogue pour voir tous les scripts disponibles." 
  },
  { 
    q: "Les scripts sont-ils détectables ?", 
    a: "Le Cronus Zen émule des inputs manette standard. Aucune modification du jeu ou de la console. Utilisé par des milliers de joueurs dans le monde." 
  },
  { 
    q: "Quel support est inclus ?", 
    a: "Support Discord inclus à vie avec réponses sous 24h. Mises à jour gratuites à chaque patch des jeux. Communauté active pour entraide." 
  },
  { 
    q: "Politique de remboursement ?", 
    a: "Produits numériques avec licence par serial, les ventes sont généralement finales. En cas de problème technique, contactez-nous avant toute demande de remboursement." 
  },
  { 
    q: "Comment installer un script ?", 
    a: "1. Connectez le Zen (port PROG) 2. Allez sur marketplace.cmindapi.com 3. Cliquez Connect > Cronus Bridge 4. Glissez le script sur un slot 5. Cliquez Program. C'est tout !" 
  },
  { 
    q: "Quelles plateformes sont compatibles ?", 
    a: "PS5, PS4, Xbox Series X|S, Xbox One. Le Cronus Zen est requis pour utiliser nos scripts." 
  },
  { 
    q: "Les scripts sont-ils mis à jour ?", 
    a: "Oui ! Mises à jour gratuites à vie. Nous mettons à jour les scripts après chaque patch majeur des jeux. Disponibles sous 24-72h sur le Marketplace." 
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Questions <span className="text-yellow-400">Fréquentes</span></h1>
          <p className="text-gray-400">Tout ce que vous devez savoir sur nos scripts Cronus Zen</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="group bg-surface rounded-xl border border-surface-border">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 className="text-lg font-semibold pr-8 group-open:text-yellow-400 transition-colors">{faq.q}</h3>
                <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-6 text-gray-400">{faq.a}</div>
            </details>
          ))}
        </div>

        <div className="mt-12 bg-surface rounded-2xl border border-surface-border p-8 text-center">
          <div className="text-4xl mb-4">💬</div>
          <h2 className="text-2xl font-bold mb-4">Vous avez d'autres questions ?</h2>
          <p className="text-gray-400 mb-6">Notre équipe est disponible pour vous aider.</p>
          <Link href="/support" className="btn-zeus px-6 py-3 rounded-xl inline-block">
            Contactez-nous
          </Link>
        </div>
      </div>
    </div>
  );
}
