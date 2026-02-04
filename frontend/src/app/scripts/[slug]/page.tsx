'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { getScriptBySlug, createCheckoutSession, Script } from '@/lib/api';

export default function ScriptDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [script, setScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    if (slug) {
      getScriptBySlug(slug).then(setScript).finally(() => setLoading(false));
    }
  }, [slug]);

  const handlePurchase = async () => {
    if (!script) return;
    setPurchasing(true);
    try {
      const { url } = await createCheckoutSession(script.id);
      if (url) window.location.href = url;
    } catch {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!script) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold mb-4">Script non trouvé</h1>
          <Link href="/scripts" className="text-yellow-400 hover:underline">← Retour aux scripts</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        <Link href="/scripts" className="text-gray-400 hover:text-white mb-8 inline-flex items-center gap-2">
          ← Retour aux scripts
        </Link>

        <div className="grid lg:grid-cols-3 gap-12 mt-6">
          <div className="lg:col-span-2">
            {script.images[0] && (
              <div className="aspect-video bg-surface rounded-2xl overflow-hidden mb-8 relative">
                <Image src={script.images[0]} alt={script.name} fill className="object-cover" />
              </div>
            )}
            <div className="bg-surface rounded-2xl border border-surface-border p-8">
              <div className="prose-custom">
                <ReactMarkdown>{script.description}</ReactMarkdown>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-surface rounded-2xl border border-surface-border p-6">
              <h1 className="text-2xl font-bold mb-2">{script.name}</h1>
              <p className="text-gray-400 text-sm mb-6">{script.short_description}</p>
              
              <div className="mb-6 pb-6 border-b border-surface-border">
                <div className="text-sm text-gray-400 mb-1">Prix</div>
                <div className="text-4xl font-bold text-yellow-400">{(script.price_cents / 100).toFixed(2)} €</div>
              </div>

              <ul className="space-y-3 mb-6 text-sm">
                {['Livraison instantanée par email', 'Mises à jour gratuites à vie', 'Support Discord inclus', 'Distribution sécurisée Marketplace'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="text-yellow-400">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button 
                onClick={handlePurchase} 
                disabled={purchasing} 
                className="w-full btn-zeus py-4 rounded-xl disabled:opacity-50"
              >
                {purchasing ? 'Redirection...' : `Acheter - ${(script.price_cents / 100).toFixed(2)} €`}
              </button>

              <div className="mt-4 text-center text-xs text-gray-500">
                Paiement sécurisé par Stripe
              </div>

              {/* Platforms */}
              <div className="mt-6 pt-6 border-t border-surface-border">
                <div className="text-sm text-gray-400 mb-3">Compatible avec</div>
                <div className="flex flex-wrap gap-2">
                  {['PS5', 'PS4', 'Xbox Series', 'Xbox One'].map((p) => (
                    <span key={p} className="bg-primary px-3 py-1 rounded-lg text-xs border border-surface-border">{p}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
