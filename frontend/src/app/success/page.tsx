'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getCheckoutSession } from '@/lib/api';

interface OrderInfo {
  orderNumber: string;
  scriptName: string;
  amount: string;
  email: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      if (sessionId) {
        try {
          const data = await getCheckoutSession(sessionId);
          setOrder(data);
        } catch (err) {
          console.error('Failed to load order:', err);
        }
      }
      setLoading(false);
    }

    loadOrder();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="max-w-2xl mx-auto px-4 text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-accent/30 animate-scale-in">
          <svg className="w-12 h-12 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-slide-up">
          Paiement <span className="text-accent">Réussi</span> !
        </h1>

        <p className="text-xl text-gray-400 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          Merci pour votre achat. Vous allez recevoir un email de confirmation.
        </p>

        {/* Order Info */}
        {order && (
          <div className="bg-surface rounded-2xl border border-surface-border p-8 mb-8 text-left animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-lg font-semibold mb-4 text-center">Détails de la commande</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-surface-border">
                <span className="text-gray-400">Numéro de commande</span>
                <span className="font-mono font-bold text-accent">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-surface-border">
                <span className="text-gray-400">Script</span>
                <span className="font-semibold">{order.scriptName}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-surface-border">
                <span className="text-gray-400">Montant payé</span>
                <span className="font-semibold text-accent">{order.amount}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-400">Email</span>
                <span className="font-semibold">{order.email}</span>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-surface rounded-2xl border border-surface-border p-8 text-left animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <span className="text-accent">📋</span>
            Prochaines étapes
          </h2>

          <ol className="space-y-6">
            <li className="flex gap-4">
              <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 border border-accent/30">
                <span className="text-accent font-bold text-sm">1</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Vérifiez votre email</h3>
                <p className="text-gray-400 text-sm">
                  Vous avez reçu un email avec votre numéro de commande et les instructions détaillées.
                </p>
              </div>
            </li>

            <li className="flex gap-4">
              <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 border border-accent/30">
                <span className="text-accent font-bold text-sm">2</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Rejoignez notre Discord</h3>
                <p className="text-gray-400 text-sm">
                  Le lien est dans l'email. Allez dans le canal <code className="bg-primary px-2 py-0.5 rounded text-accent text-xs">#registration</code>
                </p>
              </div>
            </li>

            <li className="flex gap-4">
              <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 border border-accent/30">
                <span className="text-accent font-bold text-sm">3</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Enregistrez votre serial</h3>
                <p className="text-gray-400 text-sm">
                  Postez votre numéro de commande et votre serial Cronus Zen (16 caractères).
                </p>
              </div>
            </li>

            <li className="flex gap-4">
              <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 border border-accent/30">
                <span className="text-accent font-bold text-sm">4</span>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Flashez le script</h3>
                <p className="text-gray-400 text-sm">
                  Une fois validé, allez sur{' '}
                  <a href="https://marketplace.cmindapi.com" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                    marketplace.cmindapi.com
                  </a>
                  {' '}et flashez votre script !
                </p>
              </div>
            </li>
          </ol>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <Link
            href="/"
            className="bg-surface hover:bg-surface-light text-white px-6 py-3 rounded-xl transition-all border border-surface-border"
          >
            Retour à l'accueil
          </Link>
          <Link
            href="/scripts"
            className="bg-accent hover:bg-accent-dark text-primary font-semibold px-6 py-3 rounded-xl transition-all"
          >
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
        <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
