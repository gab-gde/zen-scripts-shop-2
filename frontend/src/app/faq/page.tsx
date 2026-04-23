'use client';
import { useState } from 'react';
import Link from 'next/link';
import AutoplayMusic from '@/components/AutoplayMusic';

const faqs = [
  { question: "Comment fonctionne l'achat ?", answer: "C'est 100% automatique :\n\n1. Choisissez votre script et cliquez sur \"Acheter\"\n2. Entrez votre pseudo/gamertag pendant le paiement\n3. Payez par carte bancaire (via Stripe, 100% sécurisé)\n4. Recevez immédiatement par email votre script .gpc unique\n\nAucune action manuelle, tout est instantané." },
  { question: 'Comment installer le script sur mon Cronus Zen ?', answer: "1. Téléchargez le fichier .gpc depuis le lien reçu par email\n2. Ouvrez Zen Studio sur votre PC\n3. Cliquez sur \"Import\" et sélectionnez le fichier .gpc\n4. Cliquez sur \"Compile\"\n5. Connectez votre Cronus Zen en USB et cliquez sur \"Flash\"\n\nVotre script est prêt !" },
  { question: 'Comment fonctionne la protection par chiffrement ?', answer: "Chaque script est un build unique :\n\n• Hash SHA-256 lié à votre pseudo\n• Sel aléatoire différent pour chaque build\n• Watermarks invisibles\n• Fingerprints de timing uniques\n\nSi un script est partagé, nous identifions l'acheteur." },
  { question: 'Puis-je partager mon script ?', answer: "Non, strictement interdit. Chaque script contient des marqueurs uniques. Le partage est détectable et entraîne la révocation de votre licence." },
  { question: 'Le lien de téléchargement a expiré ?', answer: "Les liens expirent après 24h. Contactez le Support avec votre numéro de commande pour un nouveau lien." },
  { question: 'Les mises à jour sont gratuites ?', answer: "Oui ! Quand un jeu reçoit un patch, vous recevez automatiquement un nouveau build chiffré par email, sans frais." },
  { question: 'Quelles consoles sont compatibles ?', answer: "PlayStation 5 & 4, Xbox Series X|S & One, Nintendo Switch (selon les scripts). Le Cronus Zen fait le bridge entre votre manette et la console." },
  { question: 'Le paiement est-il sécurisé ?', answer: "Oui, via Stripe (certifié PCI DSS Level 1). Nous ne stockons jamais vos données bancaires." },
  { question: "Je n'ai pas reçu l'email ?", answer: "Vérifiez votre dossier spam. Si après 10 min rien, contactez le Support avec votre numéro de commande." },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[#0a0810]" />
        <div className="absolute inset-0 theme-apex" />
        <div className="absolute top-0 left-0 right-0 h-[50vh]">
          <img src="/images/apex.jpg" alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0810]" />
        </div>
      </div>
      <AutoplayMusic youtubeId="eHFQiGE_Q_A" label="Apex Theme" />

      <div className="py-12 relative z-10">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-2 mb-6">
              <span className="text-red-400">❓</span>
              <span className="text-sm text-red-400 font-medium">Centre d&apos;aide</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Questions <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-400">fréquentes</span>
            </h1>
            <p className="text-gray-400">Tout ce que vous devez savoir sur nos scripts.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="glass rounded-xl overflow-hidden hover:border-red-500/15 transition-all">
                <button onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                  <span className="font-medium pr-4">{faq.question}</span>
                  <span className={`text-red-400 transition-transform text-xl ${openIndex === index ? 'rotate-45' : ''}`}>+</span>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-5"><p className="text-gray-400 whitespace-pre-line text-sm leading-relaxed">{faq.answer}</p></div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">Vous ne trouvez pas la réponse ?</p>
            <Link href="/support" className="btn-zeus px-8 py-3 rounded-xl inline-block">Contacter le support</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
