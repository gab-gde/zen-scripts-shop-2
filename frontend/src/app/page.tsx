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
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="min-h-[90vh] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(250,204,21,0.1),transparent_70%)]" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-surface/50 border border-yellow-500/20 rounded-full px-4 py-2 mb-8">
            <span className="text-yellow-400">⚡</span>
            <span className="text-sm text-gray-400">Scripts Premium pour Cronus Zen</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6">
            <span className="text-gradient">Scripts Zeus</span>
            <br />
            <span className="text-white">Zen Premium</span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Dominez sur tous vos jeux préférés avec nos scripts Cronus Zen professionnels. Livraison instantanée, mises à jour automatiques, programme de fidélité.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/scripts" className="btn-zeus px-8 py-4 rounded-xl text-lg font-bold">
              Voir les Scripts
            </Link>
            <Link href="/register" className="px-8 py-4 rounded-xl text-lg font-bold border border-yellow-500/30 hover:border-yellow-500/50 transition-colors text-yellow-400">
              Créer un compte — 100 pts offerts
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          TRUST / REASSURANCE SECTION
          ══════════════════════════════════════════════════════════════ */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-500/[0.02] to-transparent" />
        <div className="max-w-5xl mx-auto px-4 relative z-10">
          {/* Main trust banner */}
          <div className="bg-gradient-to-br from-surface via-surface to-yellow-500/[0.03] rounded-3xl border border-yellow-500/20 p-8 md:p-12 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-1.5 mb-5">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm text-green-400 font-medium">Qualité vérifiée</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-3">
                  Testés en <span className="text-yellow-400">conditions réelles</span> par le développeur
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Chaque script est développé, testé et optimisé personnellement avant d&apos;être mis en vente. Pas de revente, pas d&apos;intermédiaire — vous achetez directement au créateur.
                </p>
              </div>

              {/* Trust points grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-primary/50 rounded-2xl border border-surface-border p-5 text-center hover:border-yellow-500/20 transition-colors">
                  <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🎮</span>
                  </div>
                  <h3 className="font-bold text-sm mb-1.5">Testé en jeu</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    Chaque script est testé en parties réelles sur PS5 &amp; Xbox avant publication
                  </p>
                </div>

                <div className="bg-primary/50 rounded-2xl border border-surface-border p-5 text-center hover:border-yellow-500/20 transition-colors">
                  <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">👨‍💻</span>
                  </div>
                  <h3 className="font-bold text-sm mb-1.5">Développeur unique</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    Un seul développeur passionné — contact direct, support réactif, sans intermédiaire
                  </p>
                </div>

                <div className="bg-primary/50 rounded-2xl border border-surface-border p-5 text-center hover:border-yellow-500/20 transition-colors">
                  <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🔄</span>
                  </div>
                  <h3 className="font-bold text-sm mb-1.5">Mises à jour régulières</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    Scripts mis à jour à chaque patch du jeu pour garantir un fonctionnement optimal
                  </p>
                </div>

                <div className="bg-primary/50 rounded-2xl border border-surface-border p-5 text-center hover:border-yellow-500/20 transition-colors">
                  <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🛡️</span>
                  </div>
                  <h3 className="font-bold text-sm mb-1.5">Build unique chiffré</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    Chaque achat génère un build crypté unique lié à votre pseudo — impossible à copier
                  </p>
                </div>
              </div>

              {/* Bottom stat bar */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-6 md:gap-10 pt-6 border-t border-surface-border/50">
                <div className="text-center">
                  <div className="text-2xl font-black text-yellow-400">10+</div>
                  <div className="text-xs text-gray-500 mt-0.5">Jeux supportés</div>
                </div>
                <div className="w-px h-8 bg-surface-border hidden md:block" />
                <div className="text-center">
                  <div className="text-2xl font-black text-yellow-400">24h</div>
                  <div className="text-xs text-gray-500 mt-0.5">Support max</div>
                </div>
                <div className="w-px h-8 bg-surface-border hidden md:block" />
                <div className="text-center">
                  <div className="text-2xl font-black text-yellow-400">100%</div>
                  <div className="text-xs text-gray-500 mt-0.5">Fait en France</div>
                </div>
                <div className="w-px h-8 bg-surface-border hidden md:block" />
                <div className="text-center">
                  <div className="text-2xl font-black text-green-400">✓</div>
                  <div className="text-xs text-gray-500 mt-0.5">Paiement Stripe sécurisé</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          VIDEO SHOWCASE - Scrolling Demo Reel
          ══════════════════════════════════════════════════════════════ */}
      <VideoShowcaseWrapper />

      {/* Games Grid */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Scripts disponibles pour <span className="text-yellow-400">tous vos jeux</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Chaque script est optimisé pour la dernière version du jeu et livré instantanément avec un build unique chiffré à votre nom.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {games.map((game) => (
              <Link
                key={game.name}
                href="/scripts"
                className="group relative aspect-[4/3] rounded-xl overflow-hidden border border-surface-border hover:border-yellow-500/50 transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                <div className="absolute inset-0 bg-surface" />
                {game.image && (
                  <img
                    src={game.image}
                    alt={game.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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

      {/* How it works */}
      <section className="py-20 bg-surface/30">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comment ça <span className="text-yellow-400">marche ?</span>
            </h2>
            <p className="text-gray-400">100% automatique, recevez votre script en quelques minutes</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">👤</span>
              </div>
              <h3 className="text-xl font-bold mb-3">1. Créez un compte</h3>
              <p className="text-gray-400 text-sm">
                Inscrivez-vous gratuitement et recevez 100 points de bienvenue.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">💳</span>
              </div>
              <h3 className="text-xl font-bold mb-3">2. Achetez</h3>
              <p className="text-gray-400 text-sm">
                Choisissez votre jeu, entrez votre pseudo et payez en toute sécurité.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📧</span>
              </div>
              <h3 className="text-xl font-bold mb-3">3. Recevez</h3>
              <p className="text-gray-400 text-sm">
                Votre build chiffré unique + clé de licence arrivent par email.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-xl font-bold mb-3">4. Gagnez</h3>
              <p className="text-gray-400 text-sm">
                Cumulez des points à chaque achat et échangez-les contre des réductions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-surface rounded-2xl border border-surface-border p-8">
              <span className="text-3xl mb-4 block">⚡</span>
              <h3 className="text-xl font-bold mb-3">Livraison instantanée</h3>
              <p className="text-gray-400">
                Votre script chiffré est généré et envoyé automatiquement par email dès le paiement. Aucune attente.
              </p>
            </div>
            <div className="bg-surface rounded-2xl border border-surface-border p-8">
              <span className="text-3xl mb-4 block">🔒</span>
              <h3 className="text-xl font-bold mb-3">Script chiffré & unique</h3>
              <p className="text-gray-400">
                Chaque build est généré avec un hash cryptographique, des watermarks et fingerprints liés à votre pseudo.
              </p>
            </div>
            <div className="bg-surface rounded-2xl border border-surface-border p-8">
              <span className="text-3xl mb-4 block">💎</span>
              <h3 className="text-xl font-bold mb-3">Programme de fidélité</h3>
              <p className="text-gray-400">
                Gagnez 10 points par euro dépensé. Échangez vos points contre des réductions de 5% à 25% sur vos prochains achats.
              </p>
            </div>
            <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/5 rounded-2xl border border-yellow-500/20 p-8">
              <span className="text-3xl mb-4 block">🔄</span>
              <h3 className="text-xl font-bold mb-3">Abonnement Premium</h3>
              <p className="text-gray-400">
                Recevez automatiquement les mises à jour de vos scripts avec un nouveau build chiffré + 200 points bonus/mois.
              </p>
              <Link href="/subscription" className="inline-block mt-4 text-yellow-400 text-sm hover:underline">
                Découvrir les offres →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/5 rounded-3xl border border-yellow-500/20 p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à passer au <span className="text-yellow-400">niveau supérieur</span> ?
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Rejoignez des centaines de joueurs qui utilisent nos scripts premium.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/scripts" className="btn-zeus px-10 py-4 rounded-xl text-lg font-bold inline-block">
                Découvrir les Scripts
              </Link>
              <Link href="/register" className="px-10 py-4 rounded-xl text-lg font-bold border border-surface-border hover:border-yellow-500/30 transition-colors inline-block">
                Créer un compte
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
