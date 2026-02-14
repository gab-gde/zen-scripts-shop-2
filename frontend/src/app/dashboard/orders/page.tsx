'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getUserOrders, getUserScripts, Order } from '@/lib/api';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [userScripts, setUserScripts] = useState<any[]>([]);
  const [tab, setTab] = useState<'scripts' | 'orders'>('scripts');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [o, s] = await Promise.all([getUserOrders(), getUserScripts()]);
        setOrders(o);
        setUserScripts(s);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mes scripts & commandes</h1>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setTab('scripts')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === 'scripts' ? 'bg-yellow-500 text-primary' : 'bg-surface text-gray-400 hover:text-white'
          }`}
        >
          Bibliothèque ({userScripts.length})
        </button>
        <button
          onClick={() => setTab('orders')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === 'orders' ? 'bg-yellow-500 text-primary' : 'bg-surface text-gray-400 hover:text-white'
          }`}
        >
          Historique ({orders.length})
        </button>
      </div>

      {tab === 'scripts' && (
        <div>
          {userScripts.length === 0 ? (
            <div className="bg-surface rounded-2xl border border-surface-border p-12 text-center">
              <div className="text-5xl mb-4">🎮</div>
              <h2 className="text-xl font-bold mb-2">Aucun script</h2>
              <p className="text-gray-400 mb-6">Vous n&apos;avez pas encore acheté de script.</p>
              <Link href="/scripts" className="btn-zeus px-6 py-3 rounded-xl inline-block">
                Découvrir les scripts
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {userScripts.map((us) => (
                <div key={us.id} className="bg-surface rounded-xl border border-surface-border overflow-hidden">
                  <div className="flex items-start gap-4 p-4">
                    {us.scripts?.images?.[0] && (
                      <img src={us.scripts.images[0]} alt={us.scripts.name} className="w-20 h-14 rounded-lg object-cover flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{us.scripts?.name}</h3>
                      <p className="text-xs text-gray-500 truncate">{us.scripts?.short_description}</p>
                      {us.license_key && (
                        <div className="mt-2">
                          <span className="text-[10px] text-gray-500">CLÉ : </span>
                          <code className="text-[10px] text-yellow-400 bg-primary px-1.5 py-0.5 rounded">{us.license_key}</code>
                        </div>
                      )}
                      {us.current_version && (
                        <span className="inline-block mt-1 text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                          v{us.current_version}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-primary-light border-t border-surface-border flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Acquis le {new Date(us.created_at).toLocaleDateString('fr-FR')}
                    </span>
                    <Link href={`/scripts/${us.scripts?.slug}`} className="text-xs text-yellow-400 hover:underline">
                      Voir la page →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'orders' && (
        <div className="bg-surface rounded-2xl border border-surface-border overflow-hidden">
          {orders.length === 0 ? (
            <div className="p-8 text-center text-gray-400">Aucune commande</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary-light">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Commande</th>
                    <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Script</th>
                    <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Montant</th>
                    <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Statut</th>
                    <th className="text-left px-4 py-3 text-xs text-gray-400 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td className="px-4 py-3 font-mono text-yellow-400 text-sm">{o.order_number}</td>
                      <td className="px-4 py-3 text-sm">{o.scripts?.name || '-'}</td>
                      <td className="px-4 py-3 text-sm font-medium">{(o.amount_cents / 100).toFixed(2)} €</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          o.payment_status === 'paid'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-orange-500/20 text-orange-400'
                        }`}>
                          {o.payment_status === 'paid' ? 'Payé' : o.payment_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400">
                        {new Date(o.created_at).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
