'use client';

import { useState, useEffect } from 'react';
import {
  adminCheckAuth,
  adminLogin,
  adminLogout,
  adminGetStats,
  adminGetScripts,
  adminGetOrders,
  adminUpdateScript,
  Script,
  Order,
} from '@/lib/api';

function formatPrice(cents: number, currency: string): string {
  return `${(cents / 100).toFixed(2)} ${currency}`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const success = await adminLogin(password);
    if (success) {
      onLogin();
    } else {
      setError('Mot de passe incorrect');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-surface rounded-2xl border border-surface-border p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-accent/30">
              <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">Administration</h1>
            <p className="text-gray-400 text-sm mt-2">Connectez-vous pour accéder au panneau</p>
          </div>
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe admin"
              className="w-full bg-primary border border-surface-border rounded-xl px-4 py-3 mb-4 text-white"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-accent-dark text-primary font-bold py-3 rounded-xl disabled:opacity-50"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [tab, setTab] = useState<'stats' | 'scripts' | 'orders'>('stats');
  const [stats, setStats] = useState<any>(null);
  const [scripts, setScripts] = useState<Script[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [statsData, scriptsData, ordersData] = await Promise.all([
        adminGetStats(),
        adminGetScripts(),
        adminGetOrders(),
      ]);
      setStats(statsData);
      setScripts(scriptsData);
      setOrders(ordersData);
    } catch (err) {
      console.error('Error loading data:', err);
    }
    setLoading(false);
  }

  async function handleLogout() {
    await adminLogout();
    window.location.reload();
  }

  async function toggleScriptActive(script: Script) {
    try {
      await adminUpdateScript(script.id, { is_active: !script.is_active });
      loadData();
    } catch (err) {
      console.error('Error updating script:', err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin <span className="text-accent">Dashboard</span></h1>
          <button onClick={handleLogout} className="text-gray-400 hover:text-white transition-colors">
            Déconnexion
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-surface rounded-xl border border-surface-border p-6">
              <div className="text-sm text-gray-400 mb-1">Scripts actifs</div>
              <div className="text-3xl font-bold text-accent">{stats.totalScripts}</div>
            </div>
            <div className="bg-surface rounded-xl border border-surface-border p-6">
              <div className="text-sm text-gray-400 mb-1">Commandes</div>
              <div className="text-3xl font-bold">{stats.totalOrders}</div>
            </div>
            <div className="bg-surface rounded-xl border border-surface-border p-6">
              <div className="text-sm text-gray-400 mb-1">Revenu total</div>
              <div className="text-3xl font-bold text-accent">{stats.totalRevenue.toFixed(2)} €</div>
            </div>
            <div className="bg-surface rounded-xl border border-surface-border p-6">
              <div className="text-sm text-gray-400 mb-1">Messages non lus</div>
              <div className="text-3xl font-bold">{stats.unreadMessages}</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          {(['stats', 'scripts', 'orders'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                tab === t ? 'bg-accent text-primary' : 'bg-surface text-gray-400 hover:text-white'
              }`}
            >
              {t === 'stats' ? 'Vue générale' : t === 'scripts' ? 'Scripts' : 'Commandes'}
            </button>
          ))}
        </div>

        {/* Content */}
        {tab === 'scripts' && (
          <div className="bg-surface rounded-2xl border border-surface-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-primary-light">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold">Nom</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold">Slug</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold">Prix</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold">Statut</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {scripts.map((script) => (
                  <tr key={script.id} className="border-t border-surface-border">
                    <td className="px-6 py-4 font-medium">{script.name}</td>
                    <td className="px-6 py-4 text-gray-400 font-mono text-sm">{script.slug}</td>
                    <td className="px-6 py-4">{formatPrice(script.price_cents, script.currency)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        script.is_active ? 'bg-accent/20 text-accent' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {script.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleScriptActive(script)}
                        className="text-sm text-gray-400 hover:text-white"
                      >
                        {script.is_active ? 'Désactiver' : 'Activer'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'orders' && (
          <div className="bg-surface rounded-2xl border border-surface-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-primary-light">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold">Commande</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold">Email</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold">Script</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold">Montant</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-surface-border">
                    <td className="px-6 py-4 font-mono text-accent text-sm">{order.order_number}</td>
                    <td className="px-6 py-4 text-sm">{order.email}</td>
                    <td className="px-6 py-4 text-sm">{order.scripts?.name || '-'}</td>
                    <td className="px-6 py-4 font-semibold">{formatPrice(order.amount_cents, order.currency)}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{formatDate(order.created_at)}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                      Aucune commande pour le moment
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'stats' && (
          <div className="bg-surface rounded-2xl border border-surface-border p-8 text-center">
            <p className="text-gray-400">
              Bienvenue dans le panneau d'administration. Utilisez les onglets pour gérer vos scripts et voir les commandes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const isAuth = await adminCheckAuth();
      setAuthenticated(isAuth);
    }
    checkAuth();
  }, []);

  if (authenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return <LoginForm onLogin={() => setAuthenticated(true)} />;
  }

  return <Dashboard />;
}
