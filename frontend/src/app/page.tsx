import Link from 'next/link';
import AutoplayMusic from '@/components/AutoplayMusic';

const games = [
  { name: 'Fortnite', image: '/images/fortnite.jpg' },
  { name: 'Rainbow Six', image: '/images/r6.jpg' },
  { name: 'EA FC 26', image: '/images/fc26.jpg' },
  { name: 'PUBG', image: '/images/pubg.jpg' },
  { name: 'NBA 2K26', image: '/images/nba2k.jpg' },
  { name: 'Rocket League', image: '/images/rocket.jpg' },
  { name: 'Call of Duty', image: '/images/bo7.jpg' },
  { name: 'DayZ', image: '/images/dayz.jpg' },
  { name: 'Rust', image: '/images/rust.jpg' },
  { name: 'ARC Raiders', image: '/images/arcraiders.jpg' },
  { name: 'Warzone', image: '/images/warzone.jpg' },
  { name: 'Battlefield 6', image: '/images/bf6.jpg' },
  { name: 'Apex Legends', image: '/images/apex.jpg' },
];

export default function HomePage() {
  return (
    <div>
      {/* Fortnite OG music - autoplay */}
      <AutoplayMusic youtubeId="HHCAz5mQnYY" label="Fortnite OG" />

      {/* ══ HERO — Split Warzone / Fortnite ══ */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden -mt-16">
        {/* Split background: Warzone left, Fortnite right */}
        <div className="absolute inset-0 flex">
          <div className="w-1/2 relative">
            <img src="/images/warzone.jpg" alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-primary/70" />
          </div>
          <div className="w-1/2 relative">
            <img src="/images/fortnite.jpg" alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-l from-primary/40 to-primary/70" />
          </div>
        </div>
        {/* Unified overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/50 via-transparent to-primary" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(10,10,18,0.7)_100%)]" />
        <div className="absolute inset-0 theme-warzone opacity-40" />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center pt-16">
          <div className="inline-flex items-center gap-3 bg-black/50 backdrop-blur-xl border border-orange-500/20 rounded-full px-6 py-2.5 mb-10">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            <span className="text-sm text-gray-300 font-mono tracking-widest uppercase">Scripts Premium — Cronus Zen</span>
          </div>

          <h1 className="text-7xl md:text-9xl font-black mb-2 tracking-tighter leading-[0.85]">
            <span className="text-white [text-shadow:0_0_60px_rgba(251,146,60,0.15)]">SCRIPTS</span>
            <br />
            <span className="text-gradient">ZEUS</span>
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

          <div className="flex flex-col sm:flex-row gap-5 justify-center mb-16">
            <Link href="/scripts" className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-amber-500 text-black font-black px-10 py-5 rounded-2xl text-lg transition-all hover:scale-105 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              <svg className="w-5 h-5 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="relative z-10">Voir les Scripts</span>
            </Link>
            <Link href="/register" className="px-10 py-5 rounded-2xl text-lg font-bold border-2 border-orange-500/25 hover:border-orange-500/50 text-orange-300 transition-all backdrop-blur-md bg-white/[0.03]">
              Créer un compte — 100 pts offerts
            </Link>
          </div>

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
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-primary to-transparent" />
      </section>

      {/* ══ TRUST ══ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 theme-warzone opacity-30" />
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Testés en <span className="text-orange-400">conditions réelles</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Chaque script est développé, testé et optimisé personnellement. Vous achetez directement au créateur.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '🎮', title: 'Testé en jeu', desc: 'Testé sur PS5 & Xbox avant publication' },
              { icon: '👨‍💻', title: 'Dev unique', desc: 'Contact direct, support réactif' },
              { icon: '🔄', title: 'Mises à jour', desc: 'Mis à jour à chaque patch de jeu' },
              { icon: '🛡️', title: 'Build chiffré', desc: 'Crypté et lié à votre pseudo' },
            ].map((item, i) => (
              <div key={i} className="glass rounded-2xl p-6 text-center group hover:border-orange-500/20 transition-all">
                <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <h3 className="font-bold text-sm mb-2">{item.title}</h3>
                <p className="text-gray-500 text-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ GAMES ══ */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Nos <span className="text-orange-400">jeux</span></h2>
          <p className="text-gray-400 text-center mb-12">Cliquez pour voir les scripts disponibles.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {games.map((g) => (
              <Link key={g.name} href="/scripts" className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/[0.06] hover:border-orange-500/40 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
                <img src={g.image} alt={g.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <span className="text-white font-bold text-sm drop-shadow-lg">{g.name}</span>
                </div>
                <div className="absolute top-2 right-2 z-20">
                  <span className="bg-green-500/20 text-green-400 text-[10px] px-2 py-0.5 rounded-full border border-green-500/30 backdrop-blur-sm font-medium">Dispo</span>
                </div>
                <div className="absolute inset-0 z-10 bg-orange-500/0 group-hover:bg-orange-500/10 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="py-24 relative">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Comment ça <span className="text-orange-400">marche ?</span></h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: '👤', n: '01', title: 'Créez un compte', desc: '100 points de bienvenue offerts.' },
              { icon: '💳', n: '02', title: 'Achetez', desc: 'Choisissez et payez en sécurité.' },
              { icon: '📧', n: '03', title: 'Recevez', desc: 'Build chiffré livré par email.' },
              { icon: '💎', n: '04', title: 'Gagnez', desc: 'Points échangeables en réductions.' },
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="relative w-16 h-16 mx-auto mb-6">
                  <div className="absolute inset-0 bg-orange-500/10 rounded-2xl border border-orange-500/20 group-hover:bg-orange-500/20 transition-all" />
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

      {/* ══ FEATURES ══ */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { icon: '⚡', title: 'Livraison instantanée', desc: 'Script envoyé par email dès le paiement.' },
              { icon: '🔒', title: 'Script chiffré & unique', desc: 'Hash, watermarks et fingerprints liés à votre pseudo.' },
              { icon: '💎', title: 'Programme de fidélité', desc: '10 pts/euro. Réductions de 5% à 25%.' },
              { icon: '🔄', title: 'Abonnement Premium', desc: 'Updates auto + build chiffré + 200 pts/mois.', link: '/subscription' },
            ].map((item, i) => (
              <div key={i} className={`rounded-2xl border p-8 transition-all hover:translate-y-[-2px] ${i === 3 ? 'bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/20' : 'glass'}`}>
                <span className="text-3xl mb-4 block">{item.icon}</span>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
                {'link' in item && item.link && (
                  <Link href={item.link} className="inline-block mt-4 text-orange-400 text-sm hover:underline font-semibold">Découvrir →</Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="relative rounded-3xl p-14 overflow-hidden">
            <div className="absolute inset-0 flex">
              <div className="w-1/2"><img src="/images/warzone.jpg" alt="" className="w-full h-full object-cover" /></div>
              <div className="w-1/2"><img src="/images/fortnite.jpg" alt="" className="w-full h-full object-cover" /></div>
            </div>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px]" />
            <div className="absolute inset-0 rounded-3xl border border-orange-500/15" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Prêt à <span className="text-orange-400">dominer</span> ?</h2>
              <p className="text-gray-300 text-lg mb-10">Rejoignez des centaines de joueurs.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/scripts" className="bg-gradient-to-r from-orange-500 to-amber-500 text-black px-10 py-4 rounded-xl text-lg font-black inline-block transition-all hover:scale-105">Découvrir les Scripts</Link>
                <Link href="/register" className="px-10 py-4 rounded-xl text-lg font-bold border-2 border-white/10 hover:border-orange-500/30 text-gray-300 inline-block">Créer un compte</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
