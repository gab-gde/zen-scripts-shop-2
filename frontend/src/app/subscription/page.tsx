'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { createSubscription } from '@/lib/api';

const plans = [
  {
    tier: 'pro' as const,
    name: 'Pro',
    price: '4.99',
    description: 'Pour les joueurs réguliers',
    features: [
      'Notifications de mise à jour instantanées',
      'Nouveau build chiffré automatique à chaque update',
      '+200 points bonus par mois',
      'Support prioritaire (24h)',
      'Accès aux changelogs détaillés',
    ],
    highlight: false,
  },
  {
    tier: 'elite' as const,
    name: 'Elite',
    price: '9.99',
    description: 'Pour les joueurs compétitifs',
    features: [
      'Tout le plan Pro +',
      'Builds livrés en priorité (avant tout le monde)',
      '+500 points bonus par mois',
      'Support VIP (réponse < 6h)',
      'Accès bêta aux nouveaux scripts',
      'Configuration personnalisée sur demande',
    ],
    highlight: true,
  },
];

export default function SubscriptionPublicPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleSubscribe(tier: 'pro' | 'elite') {
    if (!user) {
      window.location.href = '/register';
      return;
    }

    if (user.is_subscribed) {
      window.location.href = '/dashboard/subscription';
      return;
    }

    setLoading(tier);
    try {
      const { url } = await createSubscription(tier);
      if (url) window.location.href = url;
    } catch (err: any) {
      alert(err.message || 'Erreur');
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-2 mb-6">
            <span className="text-yellow-400">⚡</span>
            <span className="text-sm text-yellow-400 font-medium">Abonnement Premium</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Ne ratez plus jamais une <span className="text-yellow-400">mise à jour</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Recevez automatiquement vos scripts mis à jour avec un nouveau build chiffré à chaque patch de jeu. Plus de points bonus chaque mois.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.tier}
              className={`relative rounded-2xl p-8 transition-all ${
                plan.highlight
                  ? 'bg-gradient-to-br from-yellow-500/10 to-amber-500/5 border-2 border-yellow-500/30'
                  : 'bg-surface border border-surface-border'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-yellow-500 text-primary text-xs font-bold px-4 py-1 rounded-full">
                    POPULAIRE
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-1">{plan.name}</h2>
                <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-black text-yellow-400">{plan.price}</span>
                  <span className="text-gray-400">€ / mois</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <span className="text-yellow-400 mt-0.5">✓</span>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.tier)}
                disabled={loading === plan.tier}
                className={`w-full py-3.5 rounded-xl font-bold transition-all disabled:opacity-50 ${
                  plan.highlight
                    ? 'btn-zeus'
                    : 'bg-surface-light border border-surface-border hover:border-yellow-500/30 text-white'
                }`}
              >
                {loading === plan.tier
                  ? 'Redirection...'
                  : user?.is_subscribed
                  ? 'Gérer mon abonnement'
                  : user
                  ? `S'abonner — ${plan.price}€/mois`
                  : 'Créer un compte pour s\'abonner'}
              </button>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="bg-surface rounded-2xl border border-surface-border p-8 mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">
            Comment ça <span className="text-yellow-400">fonctionne</span> ?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-xl border border-yellow-500/20">
                🔔
              </div>
              <h3 className="font-bold mb-2">1. Un jeu est mis à jour</h3>
              <p className="text-sm text-gray-400">
                Dès qu&apos;un patch sort, nous mettons à jour le script et vous êtes notifié instantanément.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-xl border border-yellow-500/20">
                🔐
              </div>
              <h3 className="font-bold mb-2">2. Nouveau build chiffré</h3>
              <p className="text-sm text-gray-400">
                Un nouveau build unique est généré automatiquement avec votre pseudo, clé de licence et watermarks.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-xl border border-yellow-500/20">
                📧
              </div>
              <h3 className="font-bold mb-2">3. Livré par email</h3>
              <p className="text-sm text-gray-400">
                Vous recevez le fichier .gpc directement par email. Il ne reste plus qu&apos;à flasher !
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="text-center">
          <p className="text-gray-400 mb-4">Des questions sur l&apos;abonnement ?</p>
          <Link href="/faq" className="text-yellow-400 hover:underline">
            Consulter la FAQ →
          </Link>
        </div>
      </div>
    </div>
  );
}
