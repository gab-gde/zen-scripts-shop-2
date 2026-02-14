'use client';

import Link from 'next/link';

export default function Footer() {
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
            <Link href="/subscription" className="text-gray-400 hover:text-yellow-400 transition-colors">Abonnement</Link>
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
