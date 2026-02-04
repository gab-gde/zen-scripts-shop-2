import Link from 'next/link';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "Comment fonctionne l'achat et la livraison ?",
    answer: `Après votre achat, vous recevez immédiatement un email de confirmation contenant votre numéro de commande et les instructions détaillées.

**Étapes de livraison :**
1. Rejoignez notre Discord (lien dans l'email)
2. Allez dans le canal #registration
3. Postez votre numéro de commande + votre serial Cronus Zen
4. Nous validons votre accès (généralement sous 24h)
5. Allez sur marketplace.cmindapi.com
6. Votre script apparaît dans "My Scripts"
7. Flashez-le directement sur votre Cronus Zen !`
  },
  {
    question: "Comment fonctionne la licence Marketplace Cronus Zen ?",
    answer: `Le Marketplace Cronus Zen est la plateforme officielle de distribution de scripts. Voici comment ça marche :

**Protection par serial :** Votre script est lié à votre numéro de série Cronus Zen unique (16 caractères). Impossible de le partager ou de le pirater.

**Avantages :**
- Distribution sécurisée et cryptée
- Flash direct sans fichier .gpc à manipuler
- Mises à jour automatiques disponibles
- Compatible avec Zen Studio

**Comment trouver votre serial :**
Ouvrez Zen Studio → Onglet Device → Le serial est affiché (format: XXXXXXXXXXXXXXXX)`
  },
  {
    question: "Les scripts sont-ils sécurisés et non détectables ?",
    answer: `**Sécurité technique :**
Les scripts Cronus Zen fonctionnent directement sur le matériel du Zen, pas sur votre console. Ils émulent des inputs de manette standard.

**Points importants :**
- Le Cronus Zen se comporte comme une manette normale aux yeux de la console
- Aucune modification du jeu ou de la console
- Pas de logiciel à installer sur PC/console
- Utilisé par des milliers de joueurs depuis des années

**Notre engagement :**
- Scripts testés avant chaque mise à jour
- Timings ajustés à chaque patch du jeu
- Support réactif en cas de problème

*Note : Nous ne pouvons pas garantir une non-détection à 100%. Utilisez de manière responsable.*`
  },
  {
    question: "Quel support est inclus avec l'achat ?",
    answer: `**Support inclus à vie :**

🎮 **Discord communautaire**
- Canal support dédié
- Réponses généralement sous 24h
- Communauté active pour entraide

📧 **Email support**
- Pour les questions techniques
- Formulaire disponible sur la page Support

🔄 **Mises à jour**
- Gratuites à chaque patch du jeu
- Notification sur Discord
- Re-flash simple via le Marketplace

📖 **Documentation**
- Guide d'installation complet
- Description de toutes les fonctionnalités
- FAQ mise à jour régulièrement`
  },
  {
    question: "Quelle est la politique de remboursement ?",
    answer: `**Politique de remboursement :**

En raison de la nature numérique de nos produits et du système de licence par serial, **les ventes sont généralement finales**.

**Exceptions possibles :**
- Problème technique non résolu malgré notre support
- Erreur de notre part dans la livraison
- Cas exceptionnel évalué individuellement

**Avant d'acheter :**
- Vérifiez que vous avez bien un Cronus Zen
- Lisez la description complète du script
- Consultez notre FAQ
- Contactez-nous si vous avez des doutes

**En cas de problème :**
Contactez-nous via le support AVANT de demander un remboursement. La plupart des problèmes sont résolus rapidement.`
  },
  {
    question: "Comment installer le script sur mon Cronus Zen ?",
    answer: `**Guide d'installation rapide :**

**Prérequis :**
- Cronus Zen (matériel)
- Navigateur Chrome ou Edge (Chromium)
- Câble USB de programmation

**Étapes :**

1. **Connectez le Zen**
   - Utilisez le port PROG (côté droit)
   - Attendez la détection

2. **Allez sur le Marketplace**
   - Visitez marketplace.cmindapi.com
   - Cliquez sur "Connect"
   - Sélectionnez "Cronus Bridge"

3. **Trouvez votre script**
   - Section "My Scripts"
   - Votre script acheté y apparaît

4. **Flashez**
   - Glissez le script sur un slot libre
   - Cliquez "Program"
   - Attendez la confirmation

5. **Utilisez**
   - Déconnectez le câble PROG
   - Connectez votre manette
   - Le script est actif !

*Note : Firefox n'est pas compatible avec le Marketplace.*`
  },
  {
    question: "Quelles plateformes sont compatibles ?",
    answer: `**Compatibilité confirmée :**

✅ **PlayStation 5** - Support complet DualSense
✅ **PlayStation 4** - Support complet DualShock 4
✅ **Xbox Series X|S** - Support complet
✅ **Xbox One** - Support complet

**Configuration requise :**
- Cronus Zen (matériel obligatoire)
- Manette compatible
- Câble USB de programmation (fourni avec le Zen)
- PC avec Chrome/Edge pour le flash initial

**Non compatible :**
- PC gaming (pas de support natif)
- Nintendo Switch
- Mobile

*Tous nos scripts sont testés sur toutes les plateformes supportées.*`
  },
  {
    question: "Les scripts sont-ils mis à jour après les patchs ?",
    answer: `**Oui, mises à jour gratuites à vie !**

**Notre processus :**

1. **Surveillance des patchs**
   - Nous testons dès qu'un patch sort
   - Analyse des changements de gameplay

2. **Adaptation**
   - Ajustement des timings si nécessaire
   - Nouvelles fonctionnalités si pertinent
   - Tests approfondis

3. **Déploiement**
   - Mise à jour disponible sur le Marketplace
   - Notification sur Discord
   - Changelog publié

4. **Votre action**
   - Allez sur le Marketplace
   - Re-flashez le script
   - C'est tout !

**Délai habituel :** 24-72h après un patch majeur

*Les mises à jour sont incluses à vie, pas d'abonnement caché.*`
  }
];

function FAQAccordion({ item, index }: { item: FAQItem; index: number }) {
  return (
    <details className="group bg-surface rounded-xl border border-surface-border overflow-hidden">
      <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
        <h3 className="text-lg font-semibold pr-8 group-open:text-accent transition-colors">
          {item.question}
        </h3>
        <div className="w-6 h-6 rounded-full bg-surface-light flex items-center justify-center flex-shrink-0">
          <svg 
            className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </summary>
      <div className="px-6 pb-6">
        <div className="prose-custom text-gray-400 whitespace-pre-line">
          {item.answer}
        </div>
      </div>
    </details>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Questions <span className="text-accent">Fréquentes</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Tout ce que vous devez savoir sur nos scripts Cronus Zen, l'achat, la livraison et le support.
          </p>
        </div>

        {/* Quick Info */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <div className="bg-surface rounded-xl border border-surface-border p-6 text-center">
            <div className="text-3xl mb-2">📧</div>
            <div className="font-semibold mb-1">Livraison Email</div>
            <div className="text-sm text-gray-400">Instantanée</div>
          </div>
          <div className="bg-surface rounded-xl border border-surface-border p-6 text-center">
            <div className="text-3xl mb-2">🔐</div>
            <div className="font-semibold mb-1">Licence Marketplace</div>
            <div className="text-sm text-gray-400">Sécurisée par serial</div>
          </div>
          <div className="bg-surface rounded-xl border border-surface-border p-6 text-center">
            <div className="text-3xl mb-2">🔄</div>
            <div className="font-semibold mb-1">Mises à jour</div>
            <div className="text-sm text-gray-400">Gratuites à vie</div>
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <FAQAccordion key={index} item={item} index={index} />
          ))}
        </div>

        {/* Still have questions */}
        <div className="mt-12 bg-surface rounded-2xl border border-surface-border p-8 text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-accent/20">
            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Vous avez d'autres questions ?</h2>
          <p className="text-gray-400 mb-6">
            Notre équipe est disponible pour vous aider. N'hésitez pas à nous contacter !
          </p>
          <Link
            href="/support"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-primary font-semibold px-6 py-3 rounded-xl transition-all"
          >
            Contactez-nous
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
