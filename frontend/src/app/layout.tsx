import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Scripts Zeus - Scripts Cronus Zen Premium',
  description: 'Scripts professionnels Cronus Zen pour tous vos jeux. Fortnite, FIFA, R6, Rocket League et plus. Performance maximale garantie.',
  keywords: 'cronus zen, scripts, fortnite, fifa, rainbow six, rocket league, gaming, aim assist',
};

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary/80 backdrop-blur-xl border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/20">
            <span className="text-primary font-black text-lg">⚡</span>
          </div>
          <span className="text-white font-bold text-lg">Scripts<span className="text-yellow-400">Zeus</span></span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/scripts" className="text-gray-400 hover:text-white transition-colors text-sm">Scripts</Link>
          <Link href="/faq" className="text-gray-400 hover:text-white transition-colors text-sm">FAQ</Link>
          <Link href="/support" className="text-gray-400 hover:text-white transition-colors text-sm">Support</Link>
        </nav>
        <Link href="/scripts" className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-primary font-semibold px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-yellow-500/20 text-sm">
          Voir les Scripts
        </Link>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-primary-light border-t border-surface-border mt-auto py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
              <span className="text-primary font-black">⚡</span>
            </div>
            <span className="text-white font-bold">ScriptsZeus</span>
          </div>
          <div className="flex gap-8 text-sm">
            <Link href="/scripts" className="text-gray-400 hover:text-yellow-400 transition-colors">Scripts</Link>
            <Link href="/faq" className="text-gray-400 hover:text-yellow-400 transition-colors">FAQ</Link>
            <Link href="/support" className="text-gray-400 hover:text-yellow-400 transition-colors">Support</Link>
          </div>
        </div>
        <div className="border-t border-surface-border mt-8 pt-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} ScriptsZeus. Tous droits réservés. Non affilié à Cronus.
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark">
      <body className="bg-primary text-white min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
