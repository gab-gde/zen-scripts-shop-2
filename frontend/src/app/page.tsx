import Link from 'next/link';
import VideoShowcaseWrapper from '@/components/VideoShowcaseWrapper';

const games = [
  { name: 'Fortnite', image: '/images/fortnite.jpg', available: true },
  { name: 'Rainbow Six Siege', image: '/images/r6.jpg', available: true },
  { name: 'EA FC 26', image: '/images/fc26.jpg', available: true },
  { name: 'PUBG', image: '/images/pubg.jpg', available: true },
  { name: 'NBA 2K26', image: '/images/nba2k.jpg', available: true },
  { name: 'Rocket League', image: '/images/rocket.jpg', available: true },
  { name: 'Call of Duty BO6', image: '/images/bo7.jpg', available: true },
  { name: 'DayZ', image: '/images/dayz.jpg', available: true },
  { name: 'Rust', image: '/images/rust.jpg', available: true },
  { name: 'ARC Raiders', image: '/images/arcraiders.jpg', available: true },
  { name: 'Warzone', image: '/images/warzone.jpg', available: true },
  { name: 'Battlefield 6', image: '/images/bf6.jpg', available: true },
  { name: 'Apex Legends S28', image: '/images/apex.jpg', available: true },
];

export default function HomePage() {
  return (
    <div>
      {/* ══════════════════════════════════════════════════════════════
          HERO — CINEMATIC WARZONE
          ══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden -mt-16">
        {/* Multi-layer background */}
        <div className="absolute inset-0">
          <img src="/images/warzone.jpg" alt="" className="w-full h-full object-cover scale-110" />
          {/* Color overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/50 to-primary" />
          {/* Side vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(10,10,18,0.8)_100%)]" />
          {/* Warm tint */}
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-900/20 via-transparent to-red-900/10" />
          {/* Animated smoke overlay */}
          <div className="absolute inset-0 warzone-smoke opacity-60" />
        </div>

        {/* Subtle grain texture */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center pt-16">
          {/* Status pill */}
          <div className="inline-flex items-center gap-3 bg-black/50 backdrop-blur-xl border border-orange-500/20 rounded-full px-6 py-2.5 mb-10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            <span className="text-sm text-gray-300 font-mono tracking-widest uppercase">Scripts Premium — Cronus Zen</span>
          </div>

          {/* Title */}
          <h1 className="text-7xl md:text-9xl font-black mb-2 tracking-tighter leading-[0.85]">
            <span className="text-white [text-shadow:0_0_60px_rgba(251,146,60,0.15)]">SCRIPTS</span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-yellow-400 to-amber-500 animated-gradient">ZEUS</span>
          </h1>

          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-orange-500/50" />
            <span className="text-orange-400/60 text-xs font-mono tracking-[0.3em] uppercase">Premium Gaming Scripts</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-orange-500/50" />
          </div>

          <p className="text-xl md:text-2xl text-gray-300 mb-3 max-w-3xl mx-auto font-light leading-relaxed">
            Dominez sur tous vos jeux préférés avec nos scripts Cronus Zen professionnels,
            élaborés et créés par notre développeur expérimenté.
          </p>
          <p className="text-orange-400/90 font-semibold text-lg mb-12 tracking-wide">
            Livraison instantanée · Mises à jour régulières · Support réactif
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center mb-16">
            <Link href="/scripts" className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-amber-500 text-black font-black px-10 py-5 rounded-2xl text-lg transition-all hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              <svg className="w-5 h-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="relative z-10">Voir les Scripts</span>
            </Link>
            <Link href="/register" className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-lg font-bold border-2 border-orange-500/25 hover:border-orange-500/50 text-orange-300 hover:text-orange-200 transition-all backdrop-blur-md bg-white/[0.03] hover:bg-white/[0.06]">
              Créer un compte — 100 pts offerts
            </Link>
          </div>

          {/* Stats */}
          <div className="inline-flex flex-wrap items-center justify-center gap-8 md:gap-12 bg-black/30 backdrop-blur-xl rounded-2xl border border-white/[0.06] px-8 py-5">
            {[
              { value: '13+', label: 'Jeux' },
              { value: '24h', label: 'Support' },
              { value: '100%', label: 'France' },
              { value: '∞', label: 'Updates' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-black text-orange-400">{s.value}</div>
                <div className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-[0.2em]">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-primary to-transparent" />
      </section>

      {/* ══════════════════════════════════════════════════════════════
          TRUST / REASSURANCE
          ══════════════════════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 warzone-smoke opacity-30" />
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-green-400 font-medium">Qualité vérifiée</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Testés en <span className="text-orange-400">conditions réelles</span> par le développeur
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Chaque script est développé, testé et optimisé personnellement. Pas de revente — vous achetez directement au créateur.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '🎮', title: 'Testé en jeu', desc: 'Testé en parties réelles sur PS5 & Xbox avant publication' },
              { icon: '👨‍💻', title: 'Développeur unique', desc: 'Contact direct, support réactif, sans intermédiaire' },
              { icon: '🔄', title: 'Mises à jour', desc: 'Scripts mis à jour à chaque patch pour un fonctionnement optimal' },
              { icon: '🛡️', title: 'Build chiffré', desc: 'Build crypté unique lié à votre pseudo — impossible à copier' },
            ].map((item, i) => (
              <div key={i} className="group bg-white/[0.03] backdrop-blur-sm rounded-2xl border border-white/[0.06] p-6 text-center hover:border-orange-500/20 hover:bg-white/[0.05] transition-all duration-300">
                <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <h3 className="font-bold text-sm mb-2">{item.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          GAMES GRID
          ══════════════════════════════════════════════════════════════ */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nos <span className="text-orange-400">jeux disponibles</span>
            </h2>
            <p className="text-gray-400">Scripts optimisés pour chaque jeu. Cliquez pour voir les détails.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {games.map((game) => (
              <Link
                key={game.name}
                href="/scripts"
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/[0.06] hover:border-orange-500/40 transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
                {game.image && (
                  <img
                    src={game.image}
                    alt={game.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <span className="text-white font-bold text-sm drop-shadow-lg">{game.name}</span>
                </div>
                <div className="absolute top-2 right-2 z-20">
                  <span className="bg-green-500/20 text-green-400 text-[10px] px-2 py-0.5 rounded-full border border-green-500/30 backdrop-blur-sm font-medium">
                    Dispo
                  </span>
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 z-10 bg-orange-500/0 group-hover:bg-orange-500/10 transition-colors duration-300" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          HOW IT WORKS
          ══════════════════════════════════════════════════════════════ */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/[0.015] to-transparent" />
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comment ça <span className="text-orange-400">marche ?</span>
            </h2>
            <p className="text-gray-400">100% automatique, recevez votre script en quelques minutes</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: '👤', n: '01', title: 'Créez un compte', desc: 'Inscrivez-vous et recevez 100 points de bienvenue.' },
              { icon: '💳', n: '02', title: 'Achetez', desc: 'Choisissez votre jeu, entrez votre pseudo et payez.' },
              { icon: '📧', n: '03', title: 'Recevez', desc: 'Build chiffré unique + clé de licence par email.' },
              { icon: '💎', n: '04', title: 'Gagnez', desc: 'Cumulez des points, échangez contre des réductions.' },
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="relative w-16 h-16 mx-auto mb-6">
                  <div className="absolute inset-0 bg-orange-500/10 rounded-2xl border border-orange-500/20 group-hover:bg-orange-500/20 group-hover:border-orange-500/30 transition-all" />
                  <div className="absolute inset-0 flex items-center justify-center text-2xl">{item.icon}</div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-[10px] font-black text-black">{item.n}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FEATURES
          ══════════════════════════════════════════════════════════════ */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { icon: '⚡', title: 'Livraison instantanée', desc: 'Script chiffré généré et envoyé par email dès le paiement.', accent: false },
              { icon: '🔒', title: 'Script chiffré & unique', desc: 'Hash cryptographique, watermarks et fingerprints liés à votre pseudo.', accent: false },
              { icon: '💎', title: 'Programme de fidélité', desc: '10 points par euro. Réductions de 5% à 25% sur vos prochains achats.', accent: false },
              { icon: '🔄', title: 'Abonnement Premium', desc: 'Mises à jour automatiques + nouveau build chiffré + 200 pts bonus/mois.', accent: true, link: '/subscription' },
            ].map((item, i) => (
              <div key={i} className={`rounded-2xl border p-8 transition-all duration-300 hover:translate-y-[-2px] ${
                item.accent
                  ? 'bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent border-orange-500/20 hover:border-orange-500/40'
                  : 'bg-white/[0.02] border-white/[0.06] hover:border-orange-500/15 hover:bg-white/[0.04]'
              }`}>
                <span className="text-3xl mb-4 block">{item.icon}</span>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
                {item.link && (
                  <Link href={item.link} className="inline-block mt-4 text-orange-400 text-sm hover:underline font-semibold">
                    Découvrir les offres →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CTA FINAL
          ══════════════════════════════════════════════════════════════ */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="relative rounded-3xl p-14 overflow-hidden">
            {/* Background image */}
            <div className="absolute inset-0">
              <img src="/images/warzone.jpg" alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px]" />
              <div className="absolute inset-0 bg-gradient-to-br from-orange-900/20 to-transparent" />
            </div>
            <div className="absolute inset-0 rounded-3xl border border-orange-500/15" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Prêt à passer au <span className="text-orange-400">niveau supérieur</span> ?
              </h2>
              <p className="text-gray-300 text-lg mb-10">
                Rejoignez des centaines de joueurs qui utilisent nos scripts premium.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/scripts" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-yellow-400 text-black px-10 py-4 rounded-xl text-lg font-black inline-block transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(251,146,60,0.3)]">
                  Découvrir les Scripts
                </Link>
                <Link href="/register" className="px-10 py-4 rounded-xl text-lg font-bold border-2 border-white/10 hover:border-orange-500/30 transition-all inline-block text-gray-300 hover:text-white backdrop-blur-sm">
                  Créer un compte
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
