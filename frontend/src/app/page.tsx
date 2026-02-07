import Link from 'next/link';

const games = [
  { name: 'Rainbow Six Siege', image: '/images/r6.jpg', available: true },
  { name: 'EA FC 26', image: '/images/fc26.jpg', available: true },
  { name: 'PUBG', image: '/images/pubg.jpg', available: true },
  { name: 'NBA 2K26', image: '/images/nba2k.jpg', available: true },       // ← CHANGÉ: 2K25 → 2K26
  { name: 'Rocket League', image: '/images/rocket.jpg', available: true },
  { name: 'Call of Duty BO6', image: '/images/bo6.jpg', available: true },
  { name: 'DayZ', image: '/images/dayz.jpg', available: true },
  { name: 'Rust', image: '/images/rust.jpg', available: true },
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
            Dominez sur tous vos jeux préférés avec nos scripts Cronus Zen professionnels. 
            Performance maximale, mises à jour régulières, support réactif.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/scripts" className="btn-zeus px-8 py-4 rounded-xl text-lg font-bold">
              Voir les Scripts
            </Link>
            <Link href="/faq" className="px-8 py-4 rounded-xl text-lg font-bold border border-surface-border hover:border-yellow-500/50 transition-colors">
              Comment ça marche ?
            </Link>
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Scripts disponibles pour <span className="text-yellow-400">tous vos jeux</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Chaque script est optimisé pour la dernière version du jeu et livré avec un build unique chiffré à votre nom.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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

      {/* How it works - CHANGÉ: Plus de Marketplace */}
      <section className="py-20 bg-surface/30">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comment ça <span className="text-yellow-400">marche ?</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">💳</span>
              </div>
              <h3 className="text-xl font-bold mb-3">1. Achetez votre script</h3>
              <p className="text-gray-400">
                Choisissez votre jeu, payez en toute sécurité par carte bancaire via Stripe.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🔐</span>
              </div>
              <h3 className="text-xl font-bold mb-3">2. Recevez votre build unique</h3>
              <p className="text-gray-400">
                Rejoignez notre Discord, fournissez votre pseudo. Nous générons un script chiffré unique lié à votre identité.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🎮</span>
              </div>
              <h3 className="text-xl font-bold mb-3">3. Flashez et jouez</h3>
              <p className="text-gray-400">
                Chargez votre script dans Zen Studio, flashez-le sur votre Cronus Zen, et profitez !
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
              <span className="text-3xl mb-4 block">🔒</span>
              <h3 className="text-xl font-bold mb-3">Script chiffré & unique</h3>
              <p className="text-gray-400">
                Chaque build est généré avec un hash cryptographique unique, des watermarks et fingerprints liés à votre pseudo. Impossible à partager.
              </p>
            </div>
            <div className="bg-surface rounded-2xl border border-surface-border p-8">
              <span className="text-3xl mb-4 block">🔄</span>
              <h3 className="text-xl font-bold mb-3">Mises à jour à vie</h3>
              <p className="text-gray-400">
                Chaque patch du jeu, nous mettons à jour le script et vous recevez un nouveau build chiffré gratuitement.
              </p>
            </div>
            <div className="bg-surface rounded-2xl border border-surface-border p-8">
              <span className="text-3xl mb-4 block">💬</span>
              <h3 className="text-xl font-bold mb-3">Support Discord réactif</h3>
              <p className="text-gray-400">
                Notre équipe est disponible sur Discord pour vous aider avec l'installation et les réglages.
              </p>
            </div>
            <div className="bg-surface rounded-2xl border border-surface-border p-8">
              <span className="text-3xl mb-4 block">⚡</span>
              <h3 className="text-xl font-bold mb-3">Performance optimale</h3>
              <p className="text-gray-400">
                Scripts optimisés pour la dernière version de chaque jeu. Anti-recoil, aim assist, skill moves et plus.
              </p>
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
            <Link href="/scripts" className="btn-zeus px-10 py-4 rounded-xl text-lg font-bold inline-block">
              Découvrir les Scripts
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
