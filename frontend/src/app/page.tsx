import Link from 'next/link';

const games = [
  { 
    name: 'Rainbow Six Siege', 
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop',
    available: true
  },
  { 
    name: 'EA FC 26', 
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=450&fit=crop',
    available: true
  },
  { 
    name: 'PUBG', 
    image: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=800&h=450&fit=crop',
    available: true
  },
  { 
    name: 'NBA 2K25', 
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=450&fit=crop',
    available: true
  },
  { 
    name: 'Rocket League', 
    image: 'https://images.unsplash.com/photo-1511882150382-421056c89033?w=800&h=450&fit=crop',
    available: true
  },
  { 
    name: 'Call of Duty BO6', 
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b2b0d?w=800&h=450&fit=crop',
    available: true
  },
  { 
    name: 'DayZ', 
    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&h=450&fit=crop',
    available: true
  },
  { 
    name: 'Rust', 
    image: 'https://images.unsplash.com/photo-1493711662062-fa541f7f3d24?w=800&h=450&fit=crop',
    available: true
  },
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
            <Link href="/scripts" className="btn-zeus px-8 py-4 rounded-xl text-lg">
              Découvrir les Scripts
            </Link>
            <Link href="/faq" className="bg-surface hover:bg-surface-light text-white px-8 py-4 rounded-xl border border-surface-border transition-all">
              Comment ça marche ?
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div>
              <div className="text-3xl font-bold text-yellow-400">2000+</div>
              <div className="text-sm text-gray-500">Utilisateurs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">8</div>
              <div className="text-sm text-gray-500">Jeux disponibles</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">24/7</div>
              <div className="text-sm text-gray-500">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section className="py-20 bg-primary-light">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Scripts pour <span className="text-yellow-400">tous vos jeux</span></h2>
            <p className="text-gray-400">Des scripts optimisés pour les jeux les plus populaires</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {games.map((game) => (
              <div 
                key={game.name} 
                className="relative rounded-xl overflow-hidden border border-surface-border hover:border-yellow-500/50 transition-all card-hover"
              >
                <div className="aspect-[16/9] relative">
                  <img 
                    src={game.image} 
                    alt={game.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-sm truncate">{game.name}</span>
                    <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-0.5 rounded-full whitespace-nowrap">Dispo</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link href="/scripts" className="btn-zeus px-6 py-3 rounded-xl inline-block">
              Voir tous les scripts disponibles
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Pourquoi choisir <span className="text-yellow-400">ScriptsZeus</span> ?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: '⚡', 
                title: 'Performance Maximale', 
                desc: 'Scripts optimisés avec des timings précis. Aim assist, anti-recul, macros personnalisées pour chaque jeu.' 
              },
              { 
                icon: '🔧', 
                title: 'Personnalisation Totale', 
                desc: 'Menu OLED intuitif pour ajuster tous les paramètres en temps réel pendant vos parties.' 
              },
              { 
                icon: '🔒', 
                title: 'Distribution Sécurisée', 
                desc: 'Livraison via le Marketplace officiel Cronus. Script lié à votre serial, impossible à pirater.' 
              },
            ].map((f, i) => (
              <div key={i} className="bg-surface rounded-2xl p-8 border border-surface-border card-hover">
                <div className="w-14 h-14 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-6 text-2xl border border-yellow-500/20">
                  {f.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                <p className="text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section className="py-20 bg-primary-light">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Compatible toutes plateformes</h2>
          <p className="text-gray-400 mb-10">Fonctionne sur toutes les consoles via Cronus Zen</p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {['PlayStation 5', 'PlayStation 4', 'Xbox Series X|S', 'Xbox One'].map((platform) => (
              <div key={platform} className="flex items-center gap-3 bg-surface px-6 py-4 rounded-xl border border-surface-border">
                <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                <span className="font-medium">{platform}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-6xl mb-6">⚡</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à passer au niveau supérieur ?
          </h2>
          <p className="text-gray-400 mb-8 text-lg">
            Rejoignez des milliers de joueurs qui dominent avec ScriptsZeus.
          </p>
          <Link href="/scripts" className="btn-zeus px-10 py-5 rounded-xl text-lg inline-flex items-center gap-2">
            Voir tous les Scripts
            <span>→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
