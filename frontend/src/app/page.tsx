import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-surface/50 border border-surface-border rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <span className="text-sm text-gray-400">Compatible EA FC 26 • Patch 1.14</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Scripts <span className="text-gradient">Cronus Zen</span>
            <br />
            <span className="text-gray-400">Premium</span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Dominez vos adversaires avec des scripts professionnels. 
            Perfect timing, skill moves automatiques, dribbles ultra-rapides.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/scripts"
              className="bg-accent hover:bg-accent-dark text-primary font-bold px-8 py-4 rounded-xl transition-all hover:shadow-xl hover:shadow-accent/30 text-lg btn-glow"
            >
              Voir les Scripts
            </Link>
            <Link
              href="/faq"
              className="bg-surface hover:bg-surface-light text-white font-semibold px-8 py-4 rounded-xl transition-all border border-surface-border hover:border-accent/30"
            >
              Comment ça marche ?
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div>
              <div className="text-3xl font-bold text-accent">2000+</div>
              <div className="text-sm text-gray-500">Utilisateurs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent">85%+</div>
              <div className="text-sm text-gray-500">Green Timing</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-accent">24/7</div>
              <div className="text-sm text-gray-500">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-primary-light">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pourquoi choisir <span className="text-accent">ZenScripts</span> ?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Des scripts développés par des experts, testés en conditions réelles, et mis à jour à chaque patch.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-surface rounded-2xl p-8 border border-surface-border card-hover">
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6 border border-accent/20">
                <svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Performance Maximale</h3>
              <p className="text-gray-400 leading-relaxed">
                Timings parfaits calculés en temps réel. Taux de green supérieur à 85% sur les tirs et les passes.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-surface rounded-2xl p-8 border border-surface-border card-hover">
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6 border border-accent/20">
                <svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Personnalisation Totale</h3>
              <p className="text-gray-400 leading-relaxed">
                Menu OLED complet pour ajuster chaque paramètre en temps réel pendant vos matchs.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-surface rounded-2xl p-8 border border-surface-border card-hover">
              <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center mb-6 border border-accent/20">
                <svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Distribution Sécurisée</h3>
              <p className="text-gray-400 leading-relaxed">
                Via le Marketplace officiel Cronus. Votre script est lié à votre serial Zen, impossible à pirater.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Compatibility Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Compatible avec toutes les plateformes
            </h2>
            <p className="text-gray-400">
              Fonctionne sur PS5, PS4, Xbox Series X|S, et Xbox One via Cronus Zen.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {['PlayStation 5', 'PlayStation 4', 'Xbox Series X|S', 'Xbox One'].map((platform) => (
              <div key={platform} className="flex items-center gap-3 bg-surface/50 px-6 py-4 rounded-xl border border-surface-border">
                <div className="w-3 h-3 bg-accent rounded-full" />
                <span className="font-medium">{platform}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary-light relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à dominer sur EA FC 26 ?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Rejoignez plus de 2000 joueurs qui utilisent déjà nos scripts.
          </p>
          <Link
            href="/scripts"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-primary font-bold px-10 py-5 rounded-xl transition-all hover:shadow-xl hover:shadow-accent/30 text-lg btn-glow"
          >
            Découvrir les Scripts
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
