import Link from 'next/link';

const faqs = [
  { 
    q: "Comment fonctionne l'achat et la livraison ?", 
    a: "Après paiement par carte bancaire (Stripe), vous recevez un email de confirmation avec votre numéro de commande. Rejoignez ensuite notre Discord, postez votre numéro de commande + votre pseudo dans le canal #registration. Nous générons alors votre build unique chiffré et vous le livrons directement sous 24h." 
  },
  { 
    q: "Comment fonctionne la protection par chiffrement ?", 
    a: "Chaque script vendu est un build unique généré spécifiquement pour vous. Il contient un hash cryptographique, un sel unique, des watermarks et des fingerprints liés à votre pseudo. Si un script fuite, nous pouvons identifier l'acheteur d'origine. Le partage est donc impossible de manière anonyme." 
  },
  { 
    q: "Comment installer le script sur mon Cronus Zen ?", 
    a: "1. Ouvrez Zen Studio sur votre PC. 2. Connectez votre Cronus Zen en port PROG (USB). 3. Importez le fichier .gpc que nous vous avons envoyé. 4. Cliquez sur Compiler puis Flash. 5. C'est prêt !" 
  },
  { 
    q: "Quelles plateformes sont compatibles ?", 
    a: "PS5, PS4, Xbox Series X|S, Xbox One. Le Cronus Zen est requis pour utiliser nos scripts." 
  },
  { 
    q: "Les scripts sont-ils mis à jour ?", 
    a: "Oui ! Mises à jour gratuites à vie. Nous mettons à jour les scripts après chaque patch majeur des jeux. Vous recevez un nouveau build chiffré à votre nom à chaque mise à jour, disponible sous 24-72h." 
  },
  { 
    q: "Les scripts sont-ils sécurisés et non détectables ?", 
    a: "Les scripts Cronus Zen fonctionnent directement sur le matériel du Zen, pas sur votre console. Ils émulent des inputs de manette standard. Aucune modification du jeu ou de la console n'est nécessaire. Note : nous ne pouvons pas garantir une non-détection à 100%, utilisez de manière responsable." 
  },
  { 
    q: "Quel support est inclus avec l'achat ?", 
    a: "Support Discord inclus à vie : canal support dédié, réponses sous 24h, communauté active. Mises à jour gratuites à chaque patch du jeu. Guide d'installation complet fourni avec votre script." 
  },
  { 
    q: "Puis-je partager mon script avec un ami ?", 
    a: "Non. Chaque script est chiffré et lié à votre identité (pseudo, hash unique, watermarks). Le partage est détectable et constitue une violation de la licence. En cas de partage détecté, l'accès aux mises à jour sera révoqué." 
  },
  { 
    q: "Quelle est la politique de remboursement ?", 
    a: "En raison de la nature numérique de nos produits et du système de licence par chiffrement, les ventes sont généralement finales. Cependant, si vous rencontrez un problème technique que nous ne pouvons pas résoudre, contactez-nous via Discord ou le formulaire de support." 
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
          <h2 className="text-2xl font-bold mb-4">Vous avez d&apos;autres questions ?</h2>
          <p className="text-gray-400 mb-6">Notre équipe est disponible pour vous aider.</p>
          <Link href="/support" className="btn-zeus px-6 py-3 rounded-xl inline-block">
            Contactez-nous
          </Link>
        </div>
      </div>
    </div>
  );
}
