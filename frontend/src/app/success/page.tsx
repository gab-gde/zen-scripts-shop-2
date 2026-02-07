'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getOrderDetails } from '@/lib/api';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      getOrderDetails(sessionId)
        .then(setOrder)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="max-w-2xl mx-auto px-4 text-center">
        <div className="bg-surface rounded-2xl border border-surface-border p-10">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-3xl font-bold mb-4">Paiement réussi !</h1>
          
          {order && (
            <div className="bg-primary/50 rounded-xl p-4 mb-6">
              <p className="text-gray-400 text-sm">Numéro de commande</p>
              <p className="text-xl font-bold text-yellow-400">{order.order_number || sessionId}</p>
            </div>
          )}

          <p className="text-gray-400 mb-8">
            Merci pour votre achat ! Un email de confirmation a été envoyé.
          </p>

          {/* ← CHANGÉ: Nouvelles instructions sans Marketplace */}
          <div className="bg-primary/30 rounded-xl p-6 text-left mb-8">
            <h2 className="text-lg font-bold mb-4 text-yellow-400">📋 Prochaines étapes</h2>
            <ol className="space-y-4 text-gray-300">
              <li className="flex gap-3">
                <span className="bg-yellow-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">1</span>
                <div>
                  <strong>Rejoignez notre Discord</strong>
                  <p className="text-gray-400 text-sm">Lien dans l&apos;email de confirmation</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="bg-yellow-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">2</span>
                <div>
                  <strong>Postez dans #registration</strong>
                  <p className="text-gray-400 text-sm">Votre numéro de commande + votre pseudo</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="bg-yellow-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">3</span>
                <div>
                  <strong>Recevez votre build chiffré unique</strong>
                  <p className="text-gray-400 text-sm">Nous générons un script .gpc unique lié à votre pseudo (sous 24h)</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="bg-yellow-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">4</span>
                <div>
                  <strong>Flashez avec Zen Studio</strong>
                  <p className="text-gray-400 text-sm">Importez le .gpc → Compilez → Flashez sur votre Cronus Zen</p>
                </div>
              </li>
            </ol>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/scripts" className="btn-zeus px-6 py-3 rounded-xl">
              Voir d&apos;autres scripts
            </Link>
            <Link href="/support" className="px-6 py-3 rounded-xl border border-surface-border hover:border-yellow-500/50 transition-colors">
              Besoin d&apos;aide ?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
