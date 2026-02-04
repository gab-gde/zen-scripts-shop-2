import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Zen Scripts Shop - Scripts Cronus Zen Premium',
  description: 'Scripts professionnels pour Cronus Zen. EA FC 26, skill moves, perfect timing. Livraison instantanée via le Marketplace officiel.',
  keywords: 'cronus zen, scripts, ea fc 26, fifa, skill moves, gaming',
};

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary/80 backdrop-blur-xl border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center border border-accent/30 group-hover:border-accent transition-colors">
              <span className="text-accent font-bold text-lg">Z</span>
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">
              Zen<span className="text-accent">Scripts</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/scripts" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
              Scripts
            </Link>
            <Link href="/faq" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
              FAQ
            </Link>
            <Link href="/support" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
              Support
            </Link>
          </nav>

          <Link
            href="/scripts"
            className="bg-accent hover:bg-accent-dark text-primary font-semibold px-5 py-2.5 rounded-lg transition-all hover:shadow-lg hover:shadow-accent/20 text-sm"
          >
            Voir les Scripts
          </Link>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-primary-light border-t border-surface-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center border border-accent/30">
                <span className="text-accent font-bold text-lg">Z</span>
              </div>
              <span className="text-white font-semibold text-lg">ZenScripts</span>
            </div>
            <p className="text-gray-500 text-sm max-w-md">
              Scripts professionnels pour Cronus Zen. Qualité premium, support réactif, mises à jour gratuites.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Liens</h4>
            <ul className="space-y-3">
              <li><Link href="/scripts" className="text-gray-400 hover:text-accent transition-colors text-sm">Scripts</Link></li>
              <li><Link href="/faq" className="text-gray-400 hover:text-accent transition-colors text-sm">FAQ</Link></li>
              <li><Link href="/support" className="text-gray-400 hover:text-accent transition-colors text-sm">Support</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Ressources</h4>
            <ul className="space-y-3">
              <li><a href="https://marketplace.cmindapi.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-accent transition-colors text-sm">Marketplace</a></li>
              <li><a href="https://discord.gg/cronuszen" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-accent transition-colors text-sm">Discord</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-surface-border mt-10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} ZenScripts. Tous droits réservés.
          </p>
          <p className="text-gray-600 text-xs">
            Non affilié à Cronus ou EA Sports.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className="bg-primary text-white min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
