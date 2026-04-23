'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { createSubscription, createLifetimeCheckout } from '@/lib/api';

const plans = [
  { tier: 'pro' as const, name: 'Pro', price: '3', description: 'Pour les joueurs réguliers', highlight: false,
    features: ['Notifications de mise à jour instantanées', 'Nouveau build chiffré automatique', '+200 points bonus par mois', 'Support prioritaire (24h)', 'Accès aux changelogs détaillés'] },
  { tier: 'elite' as const, name: 'Elite', price: '5', description: 'Pour les joueurs compétitifs', highlight: true,
    features: ['Tout le plan Pro +', 'Builds livrés en priorité', '+500 points bonus par mois', 'Support VIP (< 6h)', 'Accès bêta aux nouveaux scripts', 'Configuration personnalisée'] },
];

export default function SubscriptionPublicPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleSubscribe(tier: 'pro' | 'elite') {
    if (!user) { window.location.href = '/register'; return; }
    if (user.is_subscribed) { window.location.href = '/dashboard/subscription'; return; }
    setLoading(tier);
    try { const { url } = await createSubscription(tier); if (url) window.location.href = url; }
    catch (err: any) { alert(err.message || 'Erreur'); setLoading(null); }
  }

  async function handleLifetime() {
    if (!user) { window.location.href = '/register'; return; }
    if (user.is_lifetime) { window.location.href = '/dashboard/subscription'; return; }
    setLoading('lifetime');
    try { const { url } = await createLifetimeCheckout(); if (url) window.location.href = url; }
    catch (err: any) { alert(err.message || 'Erreur'); setLoading(null); }
  }

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[#0a0a12]" />
        <div className="absolute inset-0">
          <img src="/images/fortnite.jpg" alt="" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a18]/40 via-[#0e0c1d]/70 to-[#0a0a12]/95" />
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[radial-gradient(ellipse,rgba(250,204,21,0.05),transparent_60%)]" />
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse,rgba(251,146,60,0.04),transparent_70%)]" />
        <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'linear-gradient(rgba(250,204,21,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(250,204,21,0.2) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      <div className="py-16 relative z-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-4 py-2 mb-6">
              <span className="text-yellow-400">⚡</span><span className="text-sm text-yellow-400 font-medium">Abonnement Premium</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">Ne ratez plus jamais une <span className="text-yellow-400">mise à jour</span></h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">Recevez automatiquement vos scripts mis à jour avec un nouveau build chiffré.</p>
          </div>

          {/* Lifetime */}
          <div className="relative rounded-3xl p-8 mb-12 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/15 via-amber-500/8 to-orange-900/10" />
            <div className="absolute inset-0 border-2 border-yellow-400/30 rounded-3xl" />
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-yellow-500/8 rounded-full blur-[100px] animate-float" />
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
              <span className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs font-black px-6 py-1.5 rounded-full tracking-wider shadow-lg">🏆 OFFRE EXCLUSIVE — ACCÈS À VIE</span>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-8 mt-4 relative z-10">
              <div className="text-center md:text-left flex-1">
                <h2 className="text-3xl font-black mb-1">Zeus Prenium <span className="text-yellow-400">Lifetime</span></h2>
                <p className="text-gray-400 mb-4">Un seul paiement. Tous les scripts. Pour toujours.</p>
                <div className="flex items-baseline gap-2 justify-center md:justify-start mb-2">
                  <span className="text-6xl font-black text-yellow-400 [text-shadow:0_0_30px_rgba(250,204,21,0.25)]">24</span>
                  <div><span className="text-2xl text-yellow-400">.99€</span><p className="text-gray-500 text-xs">paiement unique</p></div>
                </div>
                <p className="text-xs text-gray-500">vs. 100€+ si acheté à l&apos;unité</p>
              </div>
              <div className="flex-1">
                <ul className="space-y-3 mb-6">
                  {[{ icon: '♾️', t: 'Accès à vie à tous les scripts' }, { icon: '🎮', t: 'Nouveaux scripts auto' }, { icon: '🔄', t: 'Mises à jour gratuites à vie' }, { icon: '💎', t: '+500 points offerts' }, { icon: '🛡️', t: 'Support VIP à vie' }, { icon: '🔐', t: 'Build chiffré unique' }].map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm"><span className="text-lg">{f.icon}</span><span className="text-gray-200">{f.t}</span></li>
                  ))}
                </ul>
                <button onClick={handleLifetime} disabled={loading === 'lifetime' || user?.is_lifetime}
                  className="w-full py-4 rounded-xl font-black text-lg text-black bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 disabled:opacity-50 shadow-xl shadow-yellow-500/20 transition-all hover:scale-[1.02]">
                  {loading === 'lifetime' ? 'Redirection...' : user?.is_lifetime ? '✅ Accès à vie actif' : user ? "🏆 Obtenir l'accès à vie — 24.99€" : 'Créer un compte pour acheter'}
                </button>
                {!user && <p className="text-center text-xs text-gray-500 mt-2"><Link href="/register" className="text-yellow-400 hover:underline">Créer un compte</Link> ou <Link href="/login" className="text-yellow-400 hover:underline">se connecter</Link></p>}
              </div>
            </div>
          </div>

          {/* Monthly */}
          <p className="text-gray-400 text-sm text-center mb-8">Ou choisissez un abonnement mensuel</p>
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {plans.map((plan) => (
              <div key={plan.tier} className={`relative rounded-2xl p-8 transition-all hover:translate-y-[-2px] ${plan.highlight ? 'bg-gradient-to-br from-yellow-500/10 via-amber-500/5 to-orange-500/5 border-2 border-yellow-500/25 shadow-xl shadow-yellow-500/5' : 'glass'}`}>
                {plan.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><span className="bg-gradient-to-r from-yellow-400 to-amber-500 text-primary text-xs font-bold px-4 py-1 rounded-full shadow-lg">POPULAIRE</span></div>}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-1">{plan.name}</h2>
                  <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1"><span className="text-5xl font-black text-yellow-400">{plan.price}</span><span className="text-gray-400">€ / mois</span></div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, i) => (<li key={i} className="flex items-start gap-3 text-sm"><span className="text-yellow-400 mt-0.5">✓</span><span className="text-gray-300">{f}</span></li>))}
                </ul>
                <button onClick={() => handleSubscribe(plan.tier)} disabled={loading === plan.tier}
                  className={`w-full py-3.5 rounded-xl font-bold transition-all disabled:opacity-50 ${plan.highlight ? 'btn-zeus' : 'glass hover:border-yellow-500/25 text-white'}`}>
                  {loading === plan.tier ? 'Redirection...' : user?.is_subscribed ? 'Gérer mon abonnement' : user ? `S'abonner — ${plan.price}€/mois` : "Créer un compte pour s'abonner"}
                </button>
              </div>
            ))}
          </div>

          {/* How it works */}
          <div className="glass rounded-3xl p-10 mb-16">
            <h2 className="text-2xl font-bold text-center mb-10">Comment ça <span className="text-yellow-400">fonctionne</span> ?</h2>
            <div className="grid md:grid-cols-3 gap-10">
              {[{ icon: '🔔', t: '1. Jeu mis à jour', d: 'Notification instantanée.' }, { icon: '🔐', t: '2. Nouveau build', d: 'Généré avec votre pseudo et clé.' }, { icon: '📧', t: '3. Livré par email', d: 'Fichier .gpc directement dans votre boîte.' }].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-14 h-14 bg-yellow-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl border border-yellow-500/15">{item.icon}</div>
                  <h3 className="font-bold mb-2">{item.t}</h3><p className="text-sm text-gray-400">{item.d}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center"><p className="text-gray-400 mb-4">Des questions ?</p><Link href="/faq" className="text-yellow-400 hover:underline">Consulter la FAQ →</Link></div>
        </div>
      </div>
    </div>
  );
}
