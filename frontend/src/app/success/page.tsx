'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getCheckoutSession } from '@/lib/api';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      getCheckoutSession(sessionId)
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

          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-left mb-8">
            <h2 className="text-lg font-bold mb-4 text-green-400">🎮 Votre script arrive par email !</h2>
            <p className="text-gray-300 mb-4">
              Votre build chiffré unique est en cours de génération. Vous allez recevoir un email contenant :
            </p>
            <ol className="space-y-3 text-gray-300">
              <li className="flex gap-3">
                <span className="bg-green-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">1</span>
                <span>Un <strong className="text-white">lien de téléchargement sécurisé</strong> de votre fichier .gpc unique</span>
              </li>
              <li className="flex gap-3">
                <span className="bg-green-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">2</span>
                <span>Votre <strong className="text-white">clé de licence</strong> personnelle</span>
              </li>
              <li className="flex gap-3">
                <span className="bg-green-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shrink-0">3</span>
                <span>Les <strong className="text-white">instructions d&apos;installation</strong> (Zen Studio → Compiler → Flasher)</span>
              </li>
            </ol>
          </div>

          <div className="bg-primary/30 rounded-xl p-4 mb-8">
            <p className="text-gray-400 text-sm">
              📧 Vérifiez votre boîte mail (et les spams). L&apos;email arrive dans les minutes qui suivent le paiement.
            </p>
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
