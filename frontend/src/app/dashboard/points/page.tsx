'use client';

import { useEffect, useState } from 'react';
import { getUserPoints, redeemPoints, PointsTransaction, RewardTier, RewardCode } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';

export default function PointsPage() {
  const { user, refreshUser } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [tiers, setTiers] = useState<RewardTier[]>([]);
  const [codes, setCodes] = useState<RewardCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [redeemResult, setRedeemResult] = useState<{ code: string; discount: number } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const data = await getUserPoints();
      setBalance(data.balance);
      setTransactions(data.transactions);
      setTiers(data.tiers);
      setCodes(data.codes);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  async function handleRedeem(tierId: string) {
    setRedeeming(tierId);
    setRedeemResult(null);
    try {
      const result = await redeemPoints(tierId);
      setRedeemResult({ code: result.code, discount: result.discount_percent });
      await loadData();
      await refreshUser();
    } catch (err: any) {
      alert(err.message || 'Erreur');
    }
    setRedeeming(null);
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
      <h1 className="text-2xl font-bold mb-6">Points & Récompenses</h1>

      {/* Balance card */}
      <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/5 rounded-2xl border border-yellow-500/20 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-400 mb-1">Votre solde</div>
            <div className="text-4xl font-bold text-yellow-400">{balance} <span className="text-lg">points</span></div>
          </div>
          <div className="text-5xl">💎</div>
        </div>
        <div className="mt-4 text-xs text-gray-500">
          Gagnez 10 points par euro dépensé. Les abonnés reçoivent 200 points bonus chaque mois.
        </div>
      </div>

      {/* Success message */}
      {redeemResult && (
        <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-xl p-4">
          <div className="text-green-400 font-medium mb-1">Code de réduction généré !</div>
          <div className="flex items-center gap-3">
            <code className="bg-primary px-4 py-2 rounded-lg text-yellow-400 font-mono text-lg">{redeemResult.code}</code>
            <span className="text-sm text-gray-400">-{redeemResult.discount}%</span>
            <button
              onClick={() => { navigator.clipboard.writeText(redeemResult.code); }}
              className="text-xs text-gray-400 hover:text-white bg-surface px-3 py-1.5 rounded-lg transition-colors"
            >
              Copier
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Utilisez ce code lors de votre prochain achat. Valide 30 jours.</p>
        </div>
      )}

      {/* Reward tiers */}
      <h2 className="text-lg font-semibold mb-4">Paliers de récompenses</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {tiers.map((tier) => {
          const canRedeem = balance >= tier.points_required;
          const progressPercent = Math.min(100, (balance / tier.points_required) * 100);

          return (
            <div
              key={tier.id}
              className={`bg-surface rounded-xl border p-5 transition-all ${
                canRedeem ? 'border-yellow-500/30 hover:border-yellow-500/50' : 'border-surface-border'
              }`}
            >
              <div className="text-center mb-3">
                <div className="text-3xl mb-2">
                  {tier.name === 'Bronze' ? '🥉' : tier.name === 'Argent' ? '🥈' : tier.name === 'Or' ? '🥇' : '💠'}
                </div>
                <div className="font-bold">{tier.name}</div>
                <div className="text-yellow-400 text-lg font-bold">-{tier.discount_percent}%</div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{balance} / {tier.points_required}</span>
                  <span>{Math.round(progressPercent)}%</span>
                </div>
                <div className="h-2 bg-primary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <button
                onClick={() => handleRedeem(tier.id)}
                disabled={!canRedeem || redeeming === tier.id}
                className={`w-full py-2 rounded-lg text-sm font-medium transition-all ${
                  canRedeem
                    ? 'btn-zeus'
                    : 'bg-surface-light text-gray-500 cursor-not-allowed'
                }`}
              >
                {redeeming === tier.id ? 'Génération...' : canRedeem ? 'Échanger' : `${tier.points_required - balance} pts manquants`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Active codes */}
      {codes.filter(c => !c.is_used).length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Mes codes actifs</h2>
          <div className="space-y-2">
            {codes.filter(c => !c.is_used).map((code) => (
              <div key={code.id} className="bg-surface rounded-xl border border-surface-border p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <code className="text-yellow-400 font-mono bg-primary px-3 py-1 rounded-lg">{code.code}</code>
                  <span className="text-sm text-gray-400">-{code.discount_percent}%</span>
                </div>
                <div className="text-xs text-gray-500">
                  Expire le {new Date(code.expires_at).toLocaleDateString('fr-FR')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transaction history */}
      <h2 className="text-lg font-semibold mb-4">Historique des points</h2>
      <div className="bg-surface rounded-2xl border border-surface-border overflow-hidden">
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-400">Aucune transaction</div>
        ) : (
          <div className="divide-y divide-surface-border max-h-[400px] overflow-y-auto">
            {transactions.map((tx) => (
              <div key={tx.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm">{tx.description}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(tx.created_at).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </div>
                </div>
                <div className={`font-bold text-sm ${tx.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount} pts
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
