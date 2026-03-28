'use client';

import { useState } from 'react';

const features = [
  {
    tab: 'Aimbot',
    icon: '🎯',
    items: [
      { name: 'Silent Aim', desc: 'Tirs redirigés sans mouvement de caméra visible' },
      { name: 'Visible Check', desc: 'Vérifie la ligne de vue avant verrouillage' },
      { name: 'Bullet Drop', desc: 'Compensation automatique de la chute des balles' },
      { name: 'Velocity Prediction', desc: 'Prédiction du mouvement des cibles' },
      { name: 'Smoothing (1-20)', desc: 'Mouvement naturel et réglable du réticule' },
      { name: 'FOV (10°-360°)', desc: 'Rayon de détection personnalisable' },
    ],
  },
  {
    tab: 'Visuals',
    icon: '👁️',
    items: [
      { name: 'ESP Bounding Box', desc: 'Rectangles 2D/3D autour des joueurs ennemis' },
      { name: 'Skeleton ESP', desc: 'Squelette complet des joueurs affiché' },
      { name: 'Health & Armor', desc: "Barres de vie et d'armure en temps réel" },
      { name: 'Chams', desc: 'Matériaux colorés visibles à travers les murs' },
      { name: 'Loot & Vehicle ESP', desc: 'Localisation du loot et des véhicules' },
      { name: 'Name + Distance', desc: 'Pseudo et distance sur chaque ennemi' },
    ],
  },
  {
    tab: 'Misc',
    icon: '⚙️',
    items: [
      { name: 'No Recoil / Spread', desc: 'Suppression du recul et de la dispersion' },
      { name: 'Radar Hack', desc: 'Tous les ennemis sur la minimap' },
      { name: 'No Flash / Stun', desc: 'Immunité aux grenades flash et stun' },
      { name: 'Custom Crosshair', desc: 'Réticule personnalisable (5 styles)' },
      { name: 'Stream Proof', desc: "Invisible en stream et capture d'écran" },
      { name: 'Profiles (Legit/Rage)', desc: 'Configs prédéfinies selon votre style' },
    ],
  },
];

const tiers = [
  {
    name: 'Standard',
    key: 'standard',
    color: 'cyan',
    price: '0,50',
    features: ['Aimbot basique', 'ESP Boxes', 'No Recoil', 'HUD Overlays'],
    locked: ['Silent Aim', 'Chams', 'Radar Hack'],
  },
  {
    name: 'Pro',
    key: 'pro',
    color: 'yellow',
    price: '1,00',
    features: ['Tout Standard +', 'Silent Aim', 'Chams complets', 'World ESP', 'Radar Hack', 'Support prioritaire'],
    locked: [],
  },
  {
    name: 'Lifetime',
    key: 'lifetime',
    color: 'red',
    badge: true,
    price: '2,00',
    features: ['Accès complet permanent', 'Toutes les features', 'Mises à jour à vie', 'Support VIP', 'Accès anticipé', 'Configs prédéfinies'],
    locked: [],
  },
];

const steps = [
  { n: '01', title: 'Téléchargez', desc: "Cliquez sur le bouton ci-dessus. Vous recevez NEXUS.exe (~60 Mo), un exécutable portable." },
  { n: '02', title: 'Activez', desc: "Lancez NEXUS.exe. Entrez la clé de licence que nous vous fournissons par message." },
  { n: '03', title: 'Configurez', desc: "Naviguez dans les onglets (Aimbot, Visuals, Misc, Config) et ajustez selon votre style." },
  { n: '04', title: 'Jouez', desc: "Touche INSERT pour toggle le menu en jeu. ESCAPE pour quitter. C'est tout." },
];

export default function NexusPage() {
  const [tab, setTab] = useState(0);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  async function handleCheckout(tier: string = 'lifetime') {
    setCheckoutLoading(tier);
    try {
      const res = await fetch(`${API_URL}/api/nexus/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Erreur lors de la création du checkout.');
        setCheckoutLoading(null);
      }
    } catch {
      alert('Erreur réseau. Réessayez.');
      setCheckoutLoading(null);
    }
  }

  return (
    <div className="min-h-screen">
      {/* ══ Hero ══ */}
      <section className="relative overflow-hidden pt-24 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,62,62,0.08),transparent_60%)]" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-yellow-500/5 rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 bg-surface border border-surface-border rounded-full px-5 py-2 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            <span className="text-sm text-gray-400 tracking-wide font-mono">UNDETECTED · EXTERNAL · DÈS 0,50€</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-3 tracking-tight text-red-500">NEXUS</h1>
          <p className="font-mono text-gray-500 tracking-widest text-sm mb-3">v4.2.1 — WARZONE CHEAT SUITE</p>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
            Suite complète pour Call of Duty: Warzone. Aimbot, ESP, No Recoil et plus.
            <span className="text-yellow-400 font-semibold"> Disponible dès 0,50€</span> pour les clients Zeus Prenium.
          </p>

          {/* Download buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
            <button
              onClick={() => handleCheckout('lifetime')}
              disabled={!!checkoutLoading}
              className="group inline-flex items-center gap-3 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-wait text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,62,62,0.3)] hover:scale-105"
            >
              {checkoutLoading === 'lifetime' ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              )}
              {checkoutLoading === 'lifetime' ? 'Redirection...' : 'Obtenir NEXUS Lifetime'}
              <span className="text-red-200 text-sm font-normal">2,00 €</span>
            </button>
            <a
              href="/downloads/NEXUS_Documentation.pdf"
              className="inline-flex items-center gap-3 bg-surface border border-surface-border hover:border-yellow-500/40 text-gray-300 hover:text-white font-medium px-8 py-4 rounded-xl transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Documentation PDF
            </a>
          </div>
          <p className="text-xs text-gray-600 font-mono">Windows 10/11 · Portable · Licence fournie après checkout</p>
        </div>
      </section>

      {/* ══ Features ══ */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2">
            <span className="text-gradient">Fonctionnalités</span>
          </h2>
          <p className="text-gray-500 text-center mb-10">Tout ce dont vous avez besoin, dans une seule application.</p>

          <div className="flex justify-center gap-2 mb-10">
            {features.map((f, i) => (
              <button
                key={f.tab}
                onClick={() => setTab(i)}
                className={`px-5 py-2.5 rounded-lg font-mono text-sm font-bold tracking-wider transition-all ${
                  tab === i
                    ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                    : 'bg-surface text-gray-500 border border-surface-border hover:text-gray-300'
                }`}
              >
                <span className="mr-2">{f.icon}</span>{f.tab.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features[tab].items.map((item) => (
              <div
                key={item.name}
                className="group bg-surface border border-surface-border hover:border-yellow-500/20 rounded-xl p-5 transition-all card-hover"
              >
                <h3 className="text-white font-semibold mb-1 group-hover:text-yellow-400 transition-colors text-sm">
                  {item.name}
                </h3>
                <p className="text-gray-500 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Tiers ══ */}
      <section className="py-20 border-t border-surface-border">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-2">
            <span className="text-gradient">Niveaux de licence</span>
          </h2>
          <p className="text-gray-500 text-center mb-12">Choisissez votre licence. Votre clé est fournie après achat.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tiers.map((t) => {
              const borderColor = t.color === 'cyan' ? 'border-cyan-500/20 hover:border-cyan-500/40' :
                                  t.color === 'yellow' ? 'border-yellow-500/20 hover:border-yellow-500/40' :
                                  'border-red-500/20 hover:border-red-500/40';
              const textColor = t.color === 'cyan' ? 'text-cyan-400' :
                                t.color === 'yellow' ? 'text-yellow-400' :
                                'text-red-400';
              const bgColor = t.color === 'cyan' ? 'bg-cyan-500/10' :
                              t.color === 'yellow' ? 'bg-yellow-500/10' :
                              'bg-red-500/10';

              return (
                <div key={t.name} className={`relative bg-surface border ${borderColor} rounded-2xl p-6 transition-all`}>
                  {t.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full tracking-wider">
                      ⚡ RECOMMANDÉ
                    </div>
                  )}
                  <div className={`inline-block ${bgColor} rounded-lg px-3 py-1 mb-4`}>
                    <span className={`font-mono font-bold text-xs tracking-wider ${textColor}`}>
                      {t.name.toUpperCase()}
                    </span>
                  </div>
                  <div className="mb-5">
                    <span className="text-2xl font-black text-white">{t.price} €</span>
                  </div>
                  <div className="space-y-2.5 mb-6">
                    {t.features.map((f) => (
                      <div key={f} className="flex items-start gap-2">
                        <span className="text-green-400 text-xs mt-0.5">✓</span>
                        <span className="text-gray-300 text-sm">{f}</span>
                      </div>
                    ))}
                    {t.locked.map((f) => (
                      <div key={f} className="flex items-start gap-2 opacity-40">
                        <span className="text-gray-600 text-xs mt-0.5">✗</span>
                        <span className="text-gray-500 text-sm line-through">{f}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => handleCheckout(t.key)}
                    disabled={!!checkoutLoading}
                    className={`w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all ${
                      t.color === 'red'
                        ? 'bg-red-500 hover:bg-red-600 text-white hover:shadow-[0_0_20px_rgba(255,62,62,0.3)]'
                        : t.color === 'yellow'
                        ? 'bg-yellow-500 hover:bg-yellow-600 text-primary hover:shadow-[0_0_20px_rgba(250,204,21,0.3)]'
                        : 'bg-surface-light border border-surface-border hover:border-cyan-500/40 text-gray-300 hover:text-white'
                    } disabled:opacity-40 disabled:cursor-wait`}
                  >
                    {checkoutLoading === t.key ? 'Redirection...' : `Obtenir ${t.name}`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ How it works ══ */}
      <section className="py-20 border-t border-surface-border">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            <span className="text-gradient">Comment ça marche</span>
          </h2>
          <div className="space-y-0">
            {steps.map((s, i) => (
              <div key={s.n} className="flex gap-5 items-start group">
                <div className="flex flex-col items-center">
                  <div className="w-11 h-11 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center font-mono font-bold text-yellow-400 text-sm group-hover:bg-yellow-500/20 transition-colors">
                    {s.n}
                  </div>
                  {i < steps.length - 1 && <div className="w-px h-10 bg-surface-border my-2" />}
                </div>
                <div className="pb-6">
                  <h3 className="text-white font-bold mb-1">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ Disclaimer ══ */}
      <section className="py-10 border-t border-surface-border">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-gray-600 text-[10px] font-mono leading-relaxed">
            NEXUS est fourni gratuitement aux clients Zeus Prenium à des fins de divertissement uniquement.
            Zeus Prenium n'est pas responsable de l'utilisation faite de ce logiciel.
            En téléchargeant, vous acceptez de l'utiliser sous votre propre responsabilité.
          </p>
        </div>
      </section>
    </div>
  );
}
