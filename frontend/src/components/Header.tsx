'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from './AuthProvider';

export default function Header() {
  const { user, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
          <Link href="/subscription" className="text-gray-400 hover:text-white transition-colors text-sm">Abonnement</Link>
          <Link href="/faq" className="text-gray-400 hover:text-white transition-colors text-sm">FAQ</Link>
          <Link href="/support" className="text-gray-400 hover:text-white transition-colors text-sm">Support</Link>
        </nav>

        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-surface animate-pulse" />
          ) : user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 bg-surface border border-surface-border rounded-full pl-3 pr-2 py-1.5 hover:border-yellow-500/50 transition-all"
              >
                <span className="text-yellow-400 text-xs font-bold">{user.points_balance} pts</span>
                <div className="w-7 h-7 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-xs font-bold text-primary">
                  {user.username.charAt(0).toUpperCase()}
                </div>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-surface border border-surface-border rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-surface-border">
                    <div className="font-medium text-sm">{user.username}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                    {user.is_subscribed && (
                      <span className="inline-block mt-1 text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full font-medium">
                        {user.subscription_tier?.toUpperCase()} ⚡
                      </span>
                    )}
                  </div>
                  <div className="py-1">
                    <Link href="/dashboard" className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-primary-light hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>
                      Dashboard
                    </Link>
                    <Link href="/dashboard/orders" className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-primary-light hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>
                      Mes commandes
                    </Link>
                    <Link href="/dashboard/points" className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-primary-light hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>
                      Mes points ({user.points_balance})
                    </Link>
                    <Link href="/dashboard/subscription" className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-primary-light hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>
                      Abonnement
                    </Link>
                    <Link href="/dashboard/settings" className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-primary-light hover:text-white transition-colors" onClick={() => setMenuOpen(false)}>
                      Paramètres
                    </Link>
                  </div>
                  <div className="border-t border-surface-border py-1">
                    <button
                      onClick={() => { logout(); setMenuOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-primary-light transition-colors"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-gray-400 hover:text-white transition-colors text-sm px-3 py-2">
                Connexion
              </Link>
              <Link href="/register" className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-primary font-semibold px-4 py-2 rounded-lg transition-all shadow-lg shadow-yellow-500/20 text-sm">
                Créer un compte
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-400 hover:text-white ml-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface border-t border-surface-border">
          <div className="px-4 py-4 space-y-3">
            <Link href="/scripts" className="block text-gray-300 hover:text-white" onClick={() => setMobileOpen(false)}>Scripts</Link>
            <Link href="/subscription" className="block text-gray-300 hover:text-white" onClick={() => setMobileOpen(false)}>Abonnement</Link>
            <Link href="/faq" className="block text-gray-300 hover:text-white" onClick={() => setMobileOpen(false)}>FAQ</Link>
            <Link href="/support" className="block text-gray-300 hover:text-white" onClick={() => setMobileOpen(false)}>Support</Link>
            {user && <Link href="/dashboard" className="block text-yellow-400 hover:text-yellow-300" onClick={() => setMobileOpen(false)}>Dashboard</Link>}
          </div>
        </div>
      )}
    </header>
  );
}
