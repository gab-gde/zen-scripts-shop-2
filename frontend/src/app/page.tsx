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
      {/* ══ HERO — Warzone Theme ══ */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img src="/images/warzone.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/70 to-primary" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-transparent to-primary/90" />
        </div>

        {/* Animated smoke/dust particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[150px] animate-float" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] animate-float" style={{ animationDelay: '3s' }} />
          <div className="absolute top-0 right-1/3 w-[400px] h-[400px] bg-yellow-500/3 rounded-full blur-[100px] animate-float" style={{ animationDelay: '1.5s' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          {/* Status badge */}
          <div className="inline-flex items-center gap-3 bg-black/40 backdrop-blur-md border border-orange-500/30 rounded-full px-5 py-2.5 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
            </span>
            <span className="text-sm text-gray-300 font-mono tracking-wider uppercase">Scripts Premium — Cronus Zen</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tight leading-[0.9]">
            <span className="text-white drop-shadow-[0_0_30px_rgba(251,146,60,0.3)]">SCRIPTS</span>
            <br />
            <span className="text-gradient">ZEUS</span>
          </h1>

          <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 mx-auto mb-6 rounded-full" />

          <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto font-light">
            Dominez sur tous vos jeux préférés avec nos scripts Cronus Zen professionnels,
            élaborés et créés par notre développeur expérimenté.
          </p>
          <p className="text-orange-400 font-semibold text-lg mb-10">
            Livraison instantanée · Mises à jour régulières · Support réactif
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/scripts" className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-black px-10 py-5 rounded-xl text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(251,146,60,0.4)]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Voir les Scripts
            </Link>
            <Link href="/register" className="inline-flex items-center gap-3 px-10 py-5 rounded-xl text-lg font-bold border-2 border-orange-500/30 hover:border-orange-500/60 text-orange-400 hover:text-orange-300 transition-all backdrop-blur-sm bg-black/20">
              Créer un compte — 100 pts offerts
            </Link>
          </div>

          {/* Stats bar */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-14">
            {[
              { value: '13+', label: 'Jeux supportés' },
              { value: '24h', label: 'Support max' },
              { value: '100%', label: 'Made in France' },
              { value: '∞', label: 'Mises à jour' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-black text-orange-400">{s.value}</div>
                <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary to-transparent" />
      </section>

      {/* ══ TRUST / REASSURANCE ══ */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(251,146,60,0.05),transparent_60%)]" />
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 mb-5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-green-400 font-medium">Qualité vérifiée</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Testés en <span className="text-orange-400">conditions réelles</span> par le développeur
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Chaque script est développé, testé et optimisé personnellement avant d&apos;être mis en vente. Pas de revente, pas d&apos;intermédiaire — vous achetez directement au créateur.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: '🎮', title: 'Testé en jeu', desc: 'Chaque script est testé en parties réelles sur PS5 & Xbox avant publication' },
              { icon: '👨‍💻', title: 'Développeur unique', desc: 'Un seul développeur passionné — contact direct, support réactif' },
              { icon: '🔄', title: 'Mises à jour régulières', desc: 'Scripts mis à jour à chaque patch du jeu pour un fonctionnement optimal' },
              { icon: '🛡️', title: 'Build unique chiffré', desc: 'Chaque achat génère un build crypté unique lié à votre pseudo' },
            ].map((item, i) => (
              <div key={i} className="bg-surface/80 backdrop-blur-sm rounded-2xl border border-surface-border p-5 text-center hover:border-orange-500/20 transition-all group">
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <h3 className="font-bold text-sm mb-1.5">{item.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ GAMES GRID ══ */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Nos <span className="text-orange-400">jeux disponibles</span>
            </h2>
            <p className="text-gray-400">Scripts optimisés pour chaque jeu. Cliquez pour voir les détails.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {games.map((game) => (
              <Link
                key={game.name}
                href="/scripts"
                className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-surface-border hover:border-orange-500/50 transition-all hover:scale-[1.02]"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10" />
                <div className="absolute inset-0 bg-surface" />
                {game.image && (
                  <img
                    src={game.image}
                    alt={game.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                )}
                <div className="absolute bottom-3 left-3 z-20">
                  <span className="text-white font-bold text-sm">{game.name}</span>
                </div>
                {game.available && (
                  <div className="absolute top-2 right-2 z-20">
                    <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/30">
                      Disponible
                    </span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/[0.02] to-transparent" />
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comment ça <span className="text-orange-400">marche ?</span>
            </h2>
            <p className="text-gray-400">100% automatique, recevez votre script en quelques minutes</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: '👤', step: '1', title: 'Créez un compte', desc: 'Inscrivez-vous gratuitement et recevez 100 points de bienvenue.' },
              { icon: '💳', step: '2', title: 'Achetez', desc: 'Choisissez votre jeu, entrez votre pseudo et payez en toute sécurité.' },
              { icon: '📧', step: '3', title: 'Recevez', desc: 'Votre build chiffré unique + clé de licence arrivent par email.' },
              { icon: '💎', step: '4', title: 'Gagnez', desc: 'Cumulez des points à chaque achat et échangez-les contre des réductions.' },
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-orange-500/20 transition-colors">
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-3">{item.step}. {item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: '⚡', title: 'Livraison instantanée', desc: 'Votre script chiffré est généré et envoyé automatiquement par email dès le paiement. Aucune attente.', accent: false },
              { icon: '🔒', title: 'Script chiffré & unique', desc: 'Chaque build est généré avec un hash cryptographique, des watermarks et fingerprints liés à votre pseudo.', accent: false },
              { icon: '💎', title: 'Programme de fidélité', desc: 'Gagnez 10 points par euro dépensé. Échangez vos points contre des réductions de 5% à 25%.', accent: false },
              { icon: '🔄', title: 'Abonnement Premium', desc: 'Recevez automatiquement les mises à jour de vos scripts avec un nouveau build chiffré + 200 points bonus/mois.', accent: true },
            ].map((item, i) => (
              <div key={i} className={`rounded-2xl border p-8 transition-all hover:scale-[1.01] ${
                item.accent 
                  ? 'bg-gradient-to-br from-orange-500/10 to-amber-500/5 border-orange-500/20 hover:border-orange-500/40' 
                  : 'bg-surface border-surface-border hover:border-orange-500/20'
              }`}>
                <span className="text-3xl mb-4 block">{item.icon}</span>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
                {item.accent && (
                  <Link href="/subscription" className="inline-block mt-4 text-orange-400 text-sm hover:underline font-semibold">
                    Découvrir les offres →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="relative rounded-3xl p-12 overflow-hidden">
            <div className="absolute inset-0">
              <img src="/images/warzone.jpg" alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent" />
            </div>
            <div className="absolute inset-0 rounded-3xl border-2 border-orange-500/20" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Prêt à passer au <span className="text-orange-400">niveau supérieur</span> ?
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Rejoignez des centaines de joueurs qui utilisent nos scripts premium.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/scripts" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black px-10 py-4 rounded-xl text-lg font-black inline-block transition-all hover:shadow-[0_0_30px_rgba(251,146,60,0.3)]">
                  Découvrir les Scripts
                </Link>
                <Link href="/register" className="px-10 py-4 rounded-xl text-lg font-bold border-2 border-orange-500/30 hover:border-orange-500/50 transition-colors inline-block text-orange-400">
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
