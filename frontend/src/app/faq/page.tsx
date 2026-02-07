'use client';

import { useState } from 'react';
import Link from 'next/link';

const faqs = [
  {
    question: 'Comment fonctionne l\'achat ?',
    answer: `C'est 100% automatique :\n\n1. Choisissez votre script et cliquez sur "Acheter"\n2. Entrez votre pseudo/gamertag pendant le paiement\n3. Payez par carte bancaire (via Stripe, 100% sécurisé)\n4. Recevez immédiatement par email votre script .gpc unique avec un lien de téléchargement sécurisé\n\nAucune action manuelle, tout est instantané.`,
  },
  {
    question: 'Comment installer le script sur mon Cronus Zen ?',
    answer: `1. Téléchargez le fichier .gpc depuis le lien reçu par email\n2. Ouvrez Zen Studio sur votre PC\n3. Cliquez sur "Import" et sélectionnez le fichier .gpc\n4. Cliquez sur "Compile" pour compiler le script\n5. Connectez votre Cronus Zen en USB et cliquez sur "Flash"\n\nVotre script est prêt à l'utilisation !`,
  },
  {
    question: 'Comment fonctionne la protection par chiffrement ?',
    answer: `Chaque script acheté est un build unique généré spécifiquement pour vous :\n\n• Hash cryptographique SHA-256 unique lié à votre pseudo\n• Sel aléatoire différent pour chaque build\n• Watermarks invisibles intégrés dans le code\n• Fingerprints de timing uniques\n\nDeux acheteurs ne reçoivent jamais le même fichier. Si un script est partagé illégalement, nous pouvons identifier l'acheteur d'origine.`,
  },
  {
    question: 'Puis-je partager mon script ?',
    answer: `Non, c'est strictement interdit. Chaque script contient des marqueurs uniques invisibles liés à votre identité. Le partage est détectable et entraîne la révocation définitive de votre licence. Chaque build est unique et traçable.`,
  },
  {
    question: 'Le lien de téléchargement a expiré, que faire ?',
    answer: `Les liens de téléchargement expirent après 24 heures pour des raisons de sécurité. Si votre lien a expiré, contactez-nous via la page Support avec votre numéro de commande et nous vous renverrons un nouveau lien.`,
  },
  {
    question: 'Les mises à jour sont-elles gratuites ?',
    answer: `Oui ! Quand un jeu reçoit un patch qui affecte le script, nous publions une mise à jour. Vous recevrez automatiquement un nouveau build chiffré à votre nom par email, sans frais supplémentaires.`,
  },
  {
    question: 'Quelles consoles sont compatibles ?',
    answer: `Nos scripts fonctionnent avec le Cronus Zen sur :\n\n• PlayStation 5 & PlayStation 4\n• Xbox Series X|S & Xbox One\n• Nintendo Switch (selon les scripts)\n\nLe Cronus Zen agit comme un bridge entre votre manette et la console.`,
  },
  {
    question: 'Le paiement est-il sécurisé ?',
    answer: `Oui, tous les paiements sont traités par Stripe, leader mondial du paiement en ligne. Nous ne stockons jamais vos informations bancaires. Stripe est certifié PCI DSS Level 1, le plus haut niveau de sécurité.`,
  },
  {
    question: 'Je n\'ai pas reçu l\'email, que faire ?',
    answer: `Vérifiez d'abord votre dossier spam/courrier indésirable. Si après 10 minutes vous n'avez toujours rien reçu, contactez-nous via la page Support avec votre numéro de commande. Nous pouvons regénérer un lien de téléchargement pour vous.`,
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Questions <span className="text-yellow-400">fréquentes</span>
          </h1>
          <p className="text-gray-400">
            Tout ce que vous devez savoir sur nos scripts et le processus d&apos;achat.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-surface rounded-xl border border-surface-border overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left px-6 py-5 flex items-center justify-between hover:bg-surface-hover transition-colors"
              >
                <span className="font-medium pr-4">{faq.question}</span>
                <span className={`text-yellow-400 transition-transform ${openIndex === index ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5">
                  <p className="text-gray-400 whitespace-pre-line">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">Vous ne trouvez pas la réponse ?</p>
          <Link href="/support" className="btn-zeus px-8 py-3 rounded-xl inline-block">
            Contacter le support
          </Link>
        </div>
      </div>
    </div>
  );
}
