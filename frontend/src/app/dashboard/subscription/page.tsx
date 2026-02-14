'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { getSubscriptionStatus, cancelSubscription, reactivateSubscription, createSubscription } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';

function SubscriptionContent() {
  const { user, refreshUser } = useAuth();
  const searchParams = useSearchParams();
  const [subStatus, setSubStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const success = searchParams.get('success');
  const cancelled = searchParams.get('cancelled');

  useEffect(() => {
    loadStatus();
  }, []);

  async function loadStatus() {
    try {
      const data = await getSubscriptionStatus();
      setSubStatus(data.subscription);
      await refreshUser();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  async function handleCancel() {
    if (!confirm('Êtes-vous sûr de vouloir annuler votre abonnement ?')) return;
    setActionLoading(true);
    try {
      await cancelSubscription();
      await loadStatus();
    } catch (err: any) {
      alert(err.message);
    }
    setActionLoading(false);
  }

  async function handleReactivate() {
    setActionLoading(true);
    try {
      await reactivateSubscription();
      await loadStatus();
    } catch (err: any) {
      alert(err.message);
    }
    setActionLoading(false);
  }

  async function handleSubscribe(tier: 'pro' | 'elite') {
    setActionLoading(true);
    try {
      const { url } = await createSubscription(tier);
      if (url) window.location.href = url;
    } catch (err: any) {
      alert(err.message);
      setActionLoading(false);
    }
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
      <h1 className="text-2xl font-bold mb-6">Mon abonnement</h1>

      {success && (
        <div className="mb-6 bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-green-400">
          ✅ Abonnement activé avec succès ! Bienvenue dans le programme.
        </div>
      )}

      {cancelled && (
        <div className="mb-6 bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 text-orange-400">
          Le processus d&apos;abonnement a été annulé.
        </div>
      )}

      {subStatus?.isActive ? (
        /* Active subscription */
        <div className="bg-surface rounded-2xl border border-yellow-500/20 p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-yellow-500/10 rounded-xl flex items-center justify-center text-3xl border border-yellow-500/20">
              ⚡
            </div>
            <div>
              <div className="text-lg font-bold">
                Abonnement <span className="text-yellow-400">{subStatus.tier?.toUpperCase()}</span>
              </div>
              <div className="text-sm text-green-400">Actif</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-primary rounded-xl p-4">
              <div className="text-xs text-gray-400">Prochain renouvellement</div>
              <div className="font-medium mt-1">
                {subStatus.stripe?.currentPeriodEnd
                  ? new Date(subStatus.stripe.currentPeriodEnd).toLocaleDateString('fr-FR')
                  : '-'}
              </div>
            </div>
            <div className="bg-primary rounded-xl p-4">
              <div className="text-xs text-gray-400">Statut Stripe</div>
              <div className="font-medium mt-1 capitalize">{subStatus.stripe?.status || '-'}</div>
            </div>
          </div>

          <div className="bg-primary-light rounded-xl p-4 mb-4">
            <h3 className="font-medium text-sm mb-2">Avantages actifs</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <span className="text-yellow-400">✓</span>
                Mises à jour automatiques avec nouveau build chiffré
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-400">✓</span>
                Notifications instantanées des updates
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-400">✓</span>
                +200 points bonus chaque mois
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-400">✓</span>
                Support prioritaire
              </div>
            </div>
          </div>

          {subStatus.stripe?.cancelAtPeriodEnd ? (
            <div>
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4 text-sm text-red-400">
                ⚠️ Annulation programmée à la fin de la période en cours.
              </div>
              <button
                onClick={handleReactivate}
                disabled={actionLoading}
                className="btn-zeus px-6 py-3 rounded-xl disabled:opacity-50"
              >
                {actionLoading ? 'Chargement...' : 'Réactiver l\'abonnement'}
              </button>
            </div>
          ) : (
            <button
              onClick={handleCancel}
              disabled={actionLoading}
              className="text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              {actionLoading ? 'Chargement...' : 'Annuler l\'abonnement'}
            </button>
          )}
        </div>
      ) : (
        /* No subscription */
        <div>
          <div className="bg-surface rounded-2xl border border-surface-border p-8 text-center mb-8">
            <div className="text-5xl mb-4">⚡</div>
            <h2 className="text-xl font-bold mb-2">Pas encore abonné</h2>
            <p className="text-gray-400 mb-6">
              Abonnez-vous pour recevoir automatiquement les mises à jour de vos scripts et gagner des points bonus chaque mois.
            </p>
            <Link href="/subscription" className="btn-zeus px-8 py-3 rounded-xl inline-block">
              Voir les offres d&apos;abonnement
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
      </div>
    }>
      <SubscriptionContent />
    </Suspense>
  );
}
