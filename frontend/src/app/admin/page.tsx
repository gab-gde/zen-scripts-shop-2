'use client';

import { useState, useEffect } from 'react';
import { adminCheckAuth, adminLogin, adminLogout, adminGetStats, adminGetScripts, adminGetOrders, adminUpdateScript, Script, Order } from '@/lib/api';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Fonction pour récupérer les messages
async function adminGetMessages(): Promise<any[]> {
  const res = await fetch(`${API_URL}/api/admin/messages`, {
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data.messages || [];
}

// Fonction pour marquer un message comme lu
async function adminMarkMessageRead(id: string): Promise<void> {
  await fetch(`${API_URL}/api/admin/messages/${id}/read`, {
    method: 'PUT',
    credentials: 'include',
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
            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl border border-yellow-500/30">🔐</div>
            <h1 className="text-2xl font-bold">Administration</h1>
            <p className="text-gray-400 text-sm mt-2">ScriptsZeus - Panel Admin</p>
          </div>
          {error && <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">{error}</div>}
          <form onSubmit={handleSubmit}>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Mot de passe admin" 
              className="w-full bg-primary border border-surface-border rounded-xl px-4 py-3 mb-4 focus:border-yellow-500" 
            />
            <button type="submit" disabled={loading} className="w-full btn-zeus py-3 rounded-xl disabled:opacity-50">
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const [tab, setTab] = useState<'stats' | 'scripts' | 'orders' | 'messages'>('stats');
  const [stats, setStats] = useState<any>(null);
  const [scripts, setScripts] = useState<Script[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [s, sc, o, m] = await Promise.all([
        adminGetStats(), 
        adminGetScripts(), 
        adminGetOrders(),
        adminGetMessages().catch(() => [])
      ]);
      setStats(s);
      setScripts(sc);
      setOrders(o);
      setMessages(m);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  async function toggleScript(script: Script) {
    await adminUpdateScript(script.id, { is_active: !script.is_active });
    loadData();
  }

  async function openMessage(message: any) {
    setSelectedMessage(message);
    if (!message.is_read) {
      await adminMarkMessageRead(message.id);
      loadData();
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            <span className="text-yellow-400">⚡</span> Admin Dashboard
          </h1>
          <button onClick={() => { adminLogout(); window.location.reload(); }} className="text-gray-400 hover:text-white transition-colors">
            Déconnexion
          </button>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-surface rounded-xl border border-surface-border p-6">
              <div className="text-sm text-gray-400">Scripts actifs</div>
              <div className="text-3xl font-bold text-yellow-400">{stats.totalScripts}</div>
            </div>
            <div className="bg-surface rounded-xl border border-surface-border p-6">
              <div className="text-sm text-gray-400">Commandes</div>
              <div className="text-3xl font-bold">{stats.totalOrders}</div>
            </div>
            <div className="bg-surface rounded-xl border border-surface-border p-6">
              <div className="text-sm text-gray-400">Revenu total</div>
              <div className="text-3xl font-bold text-yellow-400">{stats.totalRevenue?.toFixed(2)} €</div>
            </div>
            <div 
              className="bg-surface rounded-xl border border-surface-border p-6 cursor-pointer hover:border-yellow-500/50 transition-all"
              onClick={() => setTab('messages')}
            >
              <div className="text-sm text-gray-400">Messages</div>
              <div className="text-3xl font-bold flex items-center gap-2">
                {stats.unreadMessages}
                {stats.unreadMessages > 0 && (
                  <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4 mb-6">
          {(['stats', 'scripts', 'orders', 'messages'] as const).map((t) => (
            <button 
              key={t} 
              onClick={() => setTab(t)} 
              className={`px-4 py-2 rounded-lg font-medium transition-all relative ${
                tab === t 
                  ? 'bg-yellow-500 text-primary' 
                  : 'bg-surface text-gray-400 hover:text-white'
              }`}
            >
              {t === 'stats' ? 'Vue générale' : t === 'scripts' ? 'Scripts' : t === 'orders' ? 'Commandes' : 'Messages'}
              {t === 'messages' && stats?.unreadMessages > 0 && tab !== 'messages' && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                  {stats.unreadMessages}
                </span>
              )}
            </button>
          ))}
        </div>

        {tab === 'scripts' && (
          <div className="bg-surface rounded-2xl border border-surface-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-primary-light">
                <tr>
                  <th className="text-left px-6 py-4 text-sm">Nom</th>
                  <th className="text-left px-6 py-4 text-sm">Slug</th>
                  <th className="text-left px-6 py-4 text-sm">Prix</th>
                  <th className="text-left px-6 py-4 text-sm">Statut</th>
                  <th className="text-left px-6 py-4 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {scripts.map((s) => (
                  <tr key={s.id} className="border-t border-surface-border">
                    <td className="px-6 py-4 font-medium">{s.name}</td>
                    <td className="px-6 py-4 text-gray-400 font-mono text-sm">{s.slug}</td>
                    <td className="px-6 py-4">{(s.price_cents / 100).toFixed(2)} €</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${s.is_active ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                        {s.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => toggleScript(s)} className="text-sm text-gray-400 hover:text-yellow-400 transition-colors">
                        {s.is_active ? 'Désactiver' : 'Activer'}
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
                  <th className="text-left px-6 py-4 text-sm">Commande</th>
                  <th className="text-left px-6 py-4 text-sm">Email</th>
                  <th className="text-left px-6 py-4 text-sm">Script</th>
                  <th className="text-left px-6 py-4 text-sm">Montant</th>
                  <th className="text-left px-6 py-4 text-sm">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t border-surface-border">
                    <td className="px-6 py-4 font-mono text-yellow-400 text-sm">{o.order_number}</td>
                    <td className="px-6 py-4 text-sm">{o.email}</td>
                    <td className="px-6 py-4 text-sm">{o.scripts?.name || '-'}</td>
                    <td className="px-6 py-4 font-semibold">{(o.amount_cents / 100).toFixed(2)} €</td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(o.created_at).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">Aucune commande</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'messages' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Liste des messages */}
            <div className="bg-surface rounded-2xl border border-surface-border overflow-hidden">
              <div className="p-4 border-b border-surface-border">
                <h3 className="font-semibold">Messages de support</h3>
              </div>
              <div className="divide-y divide-surface-border max-h-[500px] overflow-y-auto">
                {messages.map((m) => (
                  <div 
                    key={m.id} 
                    onClick={() => openMessage(m)}
                    className={`p-4 cursor-pointer hover:bg-primary-light transition-all ${
                      selectedMessage?.id === m.id ? 'bg-primary-light border-l-2 border-yellow-500' : ''
                    } ${!m.is_read ? 'bg-yellow-500/5' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {!m.is_read && <span className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0" />}
                          <span className="font-medium truncate">{m.subject}</span>
                        </div>
                        <div className="text-sm text-gray-400 truncate">{m.email}</div>
                      </div>
                      <div className="text-xs text-gray-500 flex-shrink-0">
                        {new Date(m.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                ))}
                {messages.length === 0 && (
                  <div className="p-8 text-center text-gray-400">Aucun message</div>
                )}
              </div>
            </div>

            {/* Détail du message */}
            <div className="bg-surface rounded-2xl border border-surface-border overflow-hidden">
              {selectedMessage ? (
                <>
                  <div className="p-4 border-b border-surface-border">
                    <h3 className="font-semibold text-lg">{selectedMessage.subject}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className="text-gray-400">De : <span className="text-yellow-400">{selectedMessage.email}</span></span>
                      <span className="text-gray-500">
                        {new Date(selectedMessage.created_at).toLocaleString('fr-FR')}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-300 whitespace-pre-wrap">{selectedMessage.message}</p>
                  </div>
                  <div className="p-4 border-t border-surface-border">
                    <a 
                      href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                      className="btn-zeus px-4 py-2 rounded-lg text-sm inline-block"
                    >
                      Répondre par email
                    </a>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center text-gray-400">
                  <div className="text-4xl mb-4">📧</div>
                  Sélectionnez un message pour le lire
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'stats' && (
          <div className="bg-surface rounded-2xl border border-surface-border p-8 text-center text-gray-400">
            <div className="text-4xl mb-4">⚡</div>
            Bienvenue sur le panel admin ScriptsZeus. Utilisez les onglets pour gérer vos scripts et commandes.
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [auth, setAuth] = useState<boolean | null>(null);

  useEffect(() => { adminCheckAuth().then(setAuth); }, []);

  if (auth === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
      </div>
    );
  }
  
  if (!auth) return <LoginForm onLogin={() => setAuth(true)} />;
  return <Dashboard />;
}
