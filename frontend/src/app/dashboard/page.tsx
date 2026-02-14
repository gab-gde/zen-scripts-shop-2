'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getUserDashboard, getUserNotifications, markNotificationRead, Notification } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [dash, notifs] = await Promise.all([
          getUserDashboard(),
          getUserNotifications().catch(() => []),
        ]);
        setStats(dash.stats);
        setNotifications(notifs);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    load();
  }, []);

  async function handleReadNotif(id: string) {
    await markNotificationRead(id);
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Bienvenue, <span className="text-yellow-400">{user?.username}</span>
      </h1>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface rounded-xl border border-surface-border p-5">
          <div className="text-xs text-gray-400 mb-1">Scripts</div>
          <div className="text-2xl font-bold text-yellow-400">{stats?.totalScripts || 0}</div>
        </div>
        <div className="bg-surface rounded-xl border border-surface-border p-5">
          <div className="text-xs text-gray-400 mb-1">Commandes</div>
          <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
        </div>
        <div className="bg-surface rounded-xl border border-surface-border p-5">
          <div className="text-xs text-gray-400 mb-1">Total dépensé</div>
          <div className="text-2xl font-bold text-yellow-400">{stats?.totalSpent?.toFixed(2) || '0.00'} €</div>
        </div>
        <div className="bg-surface rounded-xl border border-surface-border p-5">
          <div className="text-xs text-gray-400 mb-1">Points</div>
          <div className="text-2xl font-bold text-yellow-400">{user?.points_balance || 0}</div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Link href="/scripts" className="bg-surface rounded-xl border border-surface-border p-5 hover:border-yellow-500/30 transition-all group">
          <span className="text-2xl mb-2 block">🎮</span>
          <div className="font-medium group-hover:text-yellow-400 transition-colors">Acheter un script</div>
          <p className="text-xs text-gray-500 mt-1">Parcourir nos scripts disponibles</p>
        </Link>
        <Link href="/dashboard/points" className="bg-surface rounded-xl border border-surface-border p-5 hover:border-yellow-500/30 transition-all group">
          <span className="text-2xl mb-2 block">💎</span>
          <div className="font-medium group-hover:text-yellow-400 transition-colors">Échanger des points</div>
          <p className="text-xs text-gray-500 mt-1">Obtenez des réductions exclusives</p>
        </Link>
        {!user?.is_subscribed ? (
          <Link href="/subscription" className="bg-gradient-to-br from-yellow-500/10 to-amber-500/5 rounded-xl border border-yellow-500/20 p-5 hover:border-yellow-500/40 transition-all group">
            <span className="text-2xl mb-2 block">⚡</span>
            <div className="font-medium text-yellow-400">S&apos;abonner</div>
            <p className="text-xs text-gray-500 mt-1">Mises à jour auto + points bonus</p>
          </Link>
        ) : (
          <Link href="/dashboard/subscription" className="bg-surface rounded-xl border border-surface-border p-5 hover:border-yellow-500/30 transition-all group">
            <span className="text-2xl mb-2 block">⚡</span>
            <div className="font-medium text-yellow-400">Abonnement actif</div>
            <p className="text-xs text-gray-500 mt-1">{user.subscription_tier?.toUpperCase()} — Gérer</p>
          </Link>
        )}
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="bg-surface rounded-2xl border border-surface-border overflow-hidden">
          <div className="p-4 border-b border-surface-border flex items-center justify-between">
            <h2 className="font-semibold">Notifications</h2>
            <span className="text-xs text-gray-500">
              {notifications.filter(n => !n.is_read).length} non lue(s)
            </span>
          </div>
          <div className="divide-y divide-surface-border max-h-[400px] overflow-y-auto">
            {notifications.slice(0, 10).map((notif) => (
              <div
                key={notif.id}
                className={`p-4 ${!notif.is_read ? 'bg-yellow-500/5' : ''}`}
                onClick={() => !notif.is_read && handleReadNotif(notif.id)}
              >
                <div className="flex items-start gap-3">
                  {!notif.is_read && <span className="w-2 h-2 bg-yellow-500 rounded-full mt-1.5 flex-shrink-0" />}
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      Mise à jour : {notif.script_updates?.scripts?.name}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      Version {notif.script_updates?.version} — {notif.script_updates?.changelog?.substring(0, 100)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(notif.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  {notif.build_delivered && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Build livré</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {notifications.length === 0 && (
        <div className="bg-surface rounded-2xl border border-surface-border p-8 text-center text-gray-400">
          <div className="text-4xl mb-4">🔔</div>
          <p>Aucune notification pour le moment.</p>
          <p className="text-sm mt-1">Les mises à jour de scripts apparaîtront ici.</p>
        </div>
      )}
    </div>
  );
}
