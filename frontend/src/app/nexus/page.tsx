'use client';
import { useState } from 'react';
import AutoplayMusic from '@/components/AutoplayMusic';

const features = [
  { tab: 'Aimbot', icon: '🎯', items: [
    { name: 'Silent Aim', desc: 'Tirs redirigés sans mouvement de caméra visible' },
    { name: 'Visible Check', desc: 'Vérifie la ligne de vue avant verrouillage' },
    { name: 'Bullet Drop', desc: 'Compensation automatique de la chute des balles' },
    { name: 'Velocity Prediction', desc: 'Prédiction du mouvement des cibles' },
    { name: 'Smoothing (1-20)', desc: 'Mouvement naturel et réglable du réticule' },
    { name: 'FOV (10°-360°)', desc: 'Rayon de détection personnalisable' },
  ]},
  { tab: 'Visuals', icon: '👁️', items: [
    { name: 'ESP Bounding Box', desc: 'Rectangles 2D/3D autour des ennemis' },
    { name: 'Skeleton ESP', desc: 'Squelette complet affiché' },
    { name: 'Health & Armor', desc: "Barres de vie et d'armure en temps réel" },
    { name: 'Chams', desc: 'Visibles à travers les murs' },
    { name: 'Loot & Vehicle ESP', desc: 'Localisation du loot et véhicules' },
    { name: 'Name + Distance', desc: 'Pseudo et distance sur chaque ennemi' },
  ]},
  { tab: 'Misc', icon: '⚙️', items: [
    { name: 'No Recoil / Spread', desc: 'Suppression du recul et dispersion' },
    { name: 'Radar Hack', desc: 'Ennemis sur la minimap' },
    { name: 'No Flash / Stun', desc: 'Immunité aux grenades' },
    { name: 'Custom Crosshair', desc: 'Réticule personnalisable (5 styles)' },
    { name: 'Stream Proof', desc: "Invisible en stream et capture" },
    { name: 'Profiles (Legit/Rage)', desc: 'Configs prédéfinies' },
  ]},
];

const tiers = [
  { name: 'Standard', key: 'standard', color: 'cyan' as const, price: '13.99',
    features: ['Aimbot basique', 'ESP Boxes', 'No Recoil', 'HUD Overlays'],
    locked: ['Silent Aim', 'Chams', 'Radar Hack'], badge: false },
  { name: 'Pro', key: 'pro', color: 'yellow' as const, price: '18.99',
    features: ['Tout Standard +', 'Silent Aim', 'Chams complets', 'World ESP', 'Radar Hack', 'Support prioritaire'],
    locked: [], badge: false },
  { name: 'Lifetime', key: 'lifetime', color: 'red' as const, price: '24.99',
    features: ['Accès complet permanent', 'Toutes les features', 'Mises à jour à vie', 'Support VIP', 'Accès anticipé', 'Configs prédéfinies'],
    locked: [], badge: true },
];

export default function NexusPage() {
  const [tab, setTab] = useState(0);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  async function handleCheckout(tier: string = 'lifetime') {
    setCheckoutLoading(tier);
    try {
      const res = await fetch(`${API_URL}/api/nexus/checkout`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tier }) });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else { alert('Erreur checkout.'); setCheckoutLoading(null); }
    } catch { alert('Erreur réseau.'); setCheckoutLoading(null); }
  }

  const colorMap = {
    cyan: { border: 'border-cyan-500/15 hover:border-cyan-500/35', text: 'text-cyan-400', bg: 'bg-cyan-500/10', btn: 'glass text-gray-300 hover:text-white hover:border-cyan-500/30' },
    yellow: { border: 'border-yellow-500/15 hover:border-yellow-500/35', text: 'text-yellow-400', bg: 'bg-yellow-500/10', btn: 'bg-yellow-500 hover:bg-yellow-600 text-primary' },
    red: { border: 'border-red-500/15 hover:border-red-500/35', text: 'text-red-400', bg: 'bg-red-500/10', btn: 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]' },
  };

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[#070710]" />
        <div className="absolute inset-0 theme-warzone opacity-50" />
        <div className="absolute inset-0">
          <img src="/images/warzone.jpg" alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#070710]/20 via-[#070710]/50 to-[#070710]/90" />
        </div>
        <div className="absolute inset-0 opacity-[0.012]" style={{ backgroundImage: 'linear-gradient(rgba(239,68,68,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.3) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      </div>
      <AutoplayMusic youtubeId="4vcW5pcNXRs" label="Warzone OST" />

      {/* Hero */}
      <section className="relative pt-20 pb-20 z-10">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-black/50 backdrop-blur-xl border border-green-500/20 rounded-full px-5 py-2 mb-8">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75" /><span className="relative rounded-full h-2 w-2 bg-green-400" /></span>
            <span className="text-sm text-gray-400 font-mono tracking-wide">UNDETECTED · EXTERNAL</span>
          </div>
          <h1 className="text-7xl md:text-9xl font-black mb-3 tracking-tighter text-red-500 [text-shadow:0_0_80px_rgba(239,68,68,0.2)]">NEXUS</h1>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-red-500/40" />
            <p className="font-mono text-gray-500 tracking-[0.3em] text-xs">v4.2.1 — WARZONE CHEAT</p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-red-500/40" />
          </div>
          <p className="text-gray-300 text-lg max-w-xl mx-auto mb-4">Cheat complet pour Call of Duty: Warzone. Aimbot, ESP, No Recoil et plus.</p>
          <p className="text-orange-400 font-semibold mb-2">Disponible dès 13,99€</p>
          <p className="text-gray-500 text-xs mb-10">⚠️ La vidéo Warzone présentée est dans la catégorie scripts en démonstration.</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <button onClick={() => handleCheckout('lifetime')} disabled={!!checkoutLoading}
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 disabled:opacity-50 text-white font-bold px-8 py-4 rounded-xl transition-all hover:shadow-[0_0_40px_rgba(239,68,68,0.35)] hover:scale-105">
              {checkoutLoading === 'lifetime' ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              )}
              {checkoutLoading === 'lifetime' ? 'Redirection...' : 'Obtenir NEXUS Lifetime'}
              <span className="text-red-200 text-sm">24,99 €</span>
            </button>
            <a href="/downloads/NEXUS_Documentation.pdf" className="inline-flex items-center gap-3 glass text-gray-300 hover:text-white font-medium px-8 py-4 rounded-xl transition-all">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              Documentation PDF
            </a>
          </div>
          <p className="text-xs text-gray-600 font-mono">Windows 10/11 · Portable · Licence fournie après checkout</p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 relative z-10">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2"><span className="text-gradient">Fonctionnalités</span></h2>
          <p className="text-gray-500 text-center mb-10">Tout ce dont vous avez besoin.</p>
          <div className="flex justify-center gap-2 mb-10">
            {features.map((f, i) => (
              <button key={f.tab} onClick={() => setTab(i)}
                className={`px-5 py-2.5 rounded-xl font-mono text-sm font-bold tracking-wider transition-all ${tab === i ? 'bg-red-500/10 text-red-400 border border-red-500/25' : 'glass text-gray-500 hover:text-gray-300'}`}>
                <span className="mr-2">{f.icon}</span>{f.tab.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features[tab].items.map((item) => (
              <div key={item.name} className="group glass rounded-xl p-5 hover:border-red-500/15 transition-all">
                <h3 className="text-white font-semibold mb-1 group-hover:text-red-400 transition-colors text-sm">{item.name}</h3>
                <p className="text-gray-500 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-20 border-t border-white/[0.04] relative z-10">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2"><span className="text-gradient">Niveaux de licence</span></h2>
          <p className="text-gray-500 text-center mb-12">Clé fournie après achat.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {tiers.map((t) => {
              const c = colorMap[t.color];
              return (
                <div key={t.name} className={`relative glass ${c.border} rounded-2xl p-6 transition-all hover:translate-y-[-2px]`}>
                  {t.badge && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><span className="bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wider shadow-lg">⚡ RECOMMANDÉ</span></div>}
                  <div className={`inline-block ${c.bg} rounded-lg px-3 py-1 mb-4`}><span className={`font-mono font-bold text-xs tracking-wider ${c.text}`}>{t.name.toUpperCase()}</span></div>
                  <div className="mb-5"><span className="text-2xl font-black text-white">{t.price} €</span></div>
                  <div className="space-y-2.5 mb-6">
                    {t.features.map((f) => (<div key={f} className="flex items-start gap-2"><span className="text-green-400 text-xs mt-0.5">✓</span><span className="text-gray-300 text-sm">{f}</span></div>))}
                    {t.locked.map((f) => (<div key={f} className="flex items-start gap-2 opacity-40"><span className="text-gray-600 text-xs mt-0.5">✗</span><span className="text-gray-500 text-sm line-through">{f}</span></div>))}
                  </div>
                  <button onClick={() => handleCheckout(t.key)} disabled={!!checkoutLoading} className={`w-full py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-40 ${c.btn}`}>
                    {checkoutLoading === t.key ? 'Redirection...' : `Obtenir ${t.name}`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-10 border-t border-white/[0.04] relative z-10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-gray-600 text-[10px] font-mono">Zeus Prenium n&apos;est pas responsable de l&apos;utilisation faite de ce logiciel.</p>
        </div>
      </section>
    </div>
  );
}
