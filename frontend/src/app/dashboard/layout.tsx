'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

const navItems = [
  { href: '/dashboard', label: 'Vue d\'ensemble', icon: '📊' },
  { href: '/dashboard/orders', label: 'Mes scripts', icon: '🎮' },
  { href: '/dashboard/points', label: 'Points & Récompenses', icon: '💎' },
  { href: '/dashboard/subscription', label: 'Abonnement', icon: '⚡' },
  { href: '/dashboard/settings', label: 'Paramètres', icon: '⚙️' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-surface rounded-2xl border border-surface-border p-4 lg:sticky lg:top-24">
              {/* User card */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-surface-border">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-lg font-bold text-primary">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{user.username}</div>
                  <div className="text-xs text-gray-500 truncate">{user.email}</div>
                  {user.is_subscribed && (
                    <span className="inline-block mt-0.5 text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full font-medium">
                      {user.subscription_tier?.toUpperCase()} ⚡
                    </span>
                  )}
                </div>
              </div>

              {/* Points summary */}
              <div className="mb-6 bg-gradient-to-r from-yellow-500/10 to-amber-500/5 rounded-xl p-3 border border-yellow-500/20">
                <div className="text-xs text-gray-400">Mes points</div>
                <div className="text-2xl font-bold text-yellow-400">{user.points_balance}</div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                        isActive
                          ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                          : 'text-gray-400 hover:text-white hover:bg-primary-light'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
