'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getCheckoutSession } from '@/lib/api';

function Content() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (sessionId) getCheckoutSession(sessionId).then(setOrder);
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="w-24 h-24 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl border-2 border-yellow-500/30">
          ⚡
        </div>
        <h1 className="text-4xl font-bold mb-4">Paiement <span className="text-yellow-400">Réussi</span> !</h1>
        <p className="text-xl text-gray-400 mb-8">Merci pour votre achat ! Vérifiez votre email.</p>

        {order && (
          <div className="bg-surface rounded-2xl border border-surface-border p-6 mb-8 text-left">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-surface-border">
                <span className="text-gray-400">Commande</span>
                <span className="font-mono text-yellow-400">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-surface-border">
                <span className="text-gray-400">Script</span>
                <span>{order.scriptName}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-400">Montant</span>
                <span className="text-yellow-400 font-semibold">{order.amount}</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-surface rounded-2xl border border-surface-border p-6 text-left mb-8">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <span className="text-yellow-400">📋</span> Prochaines étapes
          </h3>
          <ol className="space-y-3 text-sm text-gray-400">
            <li className="flex gap-3">
              <span className="text-yellow-400 font-bold">1.</span>
              Vérifiez votre email de confirmation
            </li>
            <li className="flex gap-3">
              <span className="text-yellow-400 font-bold">2.</span>
              Rejoignez notre Discord (lien dans l'email)
            </li>
            <li className="flex gap-3">
              <span className="text-yellow-400 font-bold">3.</span>
              Postez commande + serial dans #registration
            </li>
            <li className="flex gap-3">
              <span className="text-yellow-400 font-bold">4.</span>
              Flashez depuis marketplace.cmindapi.com
            </li>
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="bg-surface hover:bg-surface-light text-white px-6 py-3 rounded-xl border border-surface-border transition-all">
            Retour à l'accueil
          </Link>
          <Link href="/scripts" className="btn-zeus px-6 py-3 rounded-xl">
            Voir d'autres scripts
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
      </div>
    }>
      <Content />
    </Suspense>
  );
}
