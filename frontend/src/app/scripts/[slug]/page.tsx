'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { getScript, createCheckoutSession } from '@/lib/api';

interface Script {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  price_cents: number;
  images: string[];
  platforms: string[];
}

export default function ScriptDetailPage() {
  const params = useParams();
  const [script, setScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getScript(params.slug as string);
        setScript(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.slug]);

  const handlePurchase = async () => {
    if (!script) return;
    setPurchasing(true);
    try {
      const { url } = await createCheckoutSession(script.id);
      if (url) window.location.href = url;
    } catch (err) {
      console.error(err);
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Chargement...</div>
      </div>
    );
  }

  if (!script) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Script non trouvé</h1>
          <Link href="/scripts" className="text-yellow-400 hover:underline">Retour aux scripts</Link>
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

        <div className="grid lg:grid-cols-3 gap-8 mt-6">
          <div className="lg:col-span-2">
            {/* Images */}
            {script.images && script.images.length > 0 && (
              <div className="rounded-2xl overflow-hidden border border-surface-border mb-8">
                <img src={script.images[0]} alt={script.name} className="w-full aspect-video object-cover" />
              </div>
            )}

            {/* Description */}
            <div className="bg-surface rounded-2xl border border-surface-border p-8">
              <h2 className="text-2xl font-bold mb-6">Description</h2>
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

              {/* ← CHANGÉ: Plus de "Distribution sécurisée Marketplace" */}
              <ul className="space-y-3 mb-6 text-sm">
                {[
                  'Build unique chiffré à votre nom',          // ← NOUVEAU
                  'Livraison sous 24h via Discord',            // ← NOUVEAU
                  'Mises à jour gratuites à vie',
                  'Support Discord inclus',
                ].map((f, i) => (
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

              {/* Sécurité - NOUVEAU */}
              <div className="mt-6 pt-6 border-t border-surface-border">
                <div className="text-sm text-gray-400 mb-3">Protection</div>
                <p className="text-xs text-gray-500">
                  🔐 Chaque script est généré avec un chiffrement unique (hash, sel, watermarks) lié à votre pseudo. Le partage est détectable et interdit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
