'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { getScriptBySlug, createCheckoutSession, validateDiscountCode } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';
import type { Script } from '@/lib/api';

export default function ScriptDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const [script, setScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountValid, setDiscountValid] = useState<{ valid: boolean; percent: number } | null>(null);
  const [validatingCode, setValidatingCode] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getScriptBySlug(params.slug as string);
        setScript(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.slug]);

  const handleValidateCode = async () => {
    if (!discountCode.trim()) return;
    setValidatingCode(true);
    try {
      const result = await validateDiscountCode(discountCode.trim());
      setDiscountValid({ valid: result.valid, percent: result.discount_percent });
    } catch {
      setDiscountValid({ valid: false, percent: 0 });
    }
    setValidatingCode(false);
  };

  const handlePurchase = async () => {
    if (!script) return;
    setPurchasing(true);
    try {
      const code = discountValid?.valid ? discountCode.trim() : undefined;
      const { url } = await createCheckoutSession(script.id, code);
      if (url) window.location.href = url;
    } catch (err) {
      console.error(err);
      setPurchasing(false);
    }
  };

  const getFinalPrice = () => {
    if (!script) return 0;
    if (discountValid?.valid && discountValid.percent > 0) {
      return script.price_cents * (1 - discountValid.percent / 100);
    }
    return script.price_cents;
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
            {script.images && script.images.length > 0 && (
              <div className="rounded-2xl overflow-hidden border border-surface-border mb-8">
                <img src={script.images[0]} alt={script.name} className="w-full aspect-video object-cover" />
              </div>
            )}

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
                {discountValid?.valid ? (
                  <div>
                    <span className="text-lg text-gray-500 line-through mr-2">
                      {(script.price_cents / 100).toFixed(2)} €
                    </span>
                    <span className="text-4xl font-bold text-yellow-400">
                      {(getFinalPrice() / 100).toFixed(2)} €
                    </span>
                    <span className="ml-2 text-sm bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                      -{discountValid.percent}%
                    </span>
                  </div>
                ) : (
                  <div className="text-4xl font-bold text-yellow-400">
                    {(script.price_cents / 100).toFixed(2)} €
                  </div>
                )}
              </div>

              {/* Points info */}
              {user && (
                <div className="mb-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-3">
                  <div className="text-xs text-gray-400">Cet achat vous rapportera</div>
                  <div className="text-yellow-400 font-bold">
                    +{Math.floor((getFinalPrice() / 100) * 10)} points
                  </div>
                </div>
              )}

              {/* Discount code */}
              <div className="mb-6">
                <label className="text-sm text-gray-400 mb-2 block">Code de réduction</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => { setDiscountCode(e.target.value); setDiscountValid(null); }}
                    placeholder="ZS-OR-XXXX"
                    className="flex-1 bg-primary border border-surface-border rounded-lg px-3 py-2 text-sm focus:border-yellow-500 focus:outline-none"
                  />
                  <button
                    onClick={handleValidateCode}
                    disabled={validatingCode || !discountCode.trim()}
                    className="px-3 py-2 bg-surface-light border border-surface-border rounded-lg text-sm hover:border-yellow-500/30 transition-colors disabled:opacity-50"
                  >
                    {validatingCode ? '...' : 'Appliquer'}
                  </button>
                </div>
                {discountValid !== null && (
                  <p className={`text-xs mt-1 ${discountValid.valid ? 'text-green-400' : 'text-red-400'}`}>
                    {discountValid.valid ? `✓ Code valide : -${discountValid.percent}%` : '✗ Code invalide ou expiré'}
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-6 text-sm">
                {[
                  '⚡ Livraison instantanée par email',
                  '🔒 Build unique chiffré à votre nom',
                  '🔄 Mises à jour gratuites à vie',
                  '💬 Support inclus',
                  user ? `💎 +${Math.floor((getFinalPrice() / 100) * 10)} points de fidélité` : '💎 Créez un compte pour gagner des points',
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={handlePurchase}
                disabled={purchasing}
                className="w-full btn-zeus py-4 rounded-xl disabled:opacity-50"
              >
                {purchasing ? 'Redirection...' : `Acheter — ${(getFinalPrice() / 100).toFixed(2)} €`}
              </button>

              <div className="mt-4 text-center text-xs text-gray-500">
                Paiement sécurisé par Stripe
              </div>

              {!user && (
                <div className="mt-4 text-center">
                  <Link href="/register" className="text-xs text-yellow-400 hover:underline">
                    Créez un compte pour gagner des points et accéder à votre dashboard →
                  </Link>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-surface-border">
                <div className="text-sm text-gray-400 mb-3">Compatible avec</div>
                <div className="flex flex-wrap gap-2">
                  {['PS5', 'PS4', 'Xbox Series', 'Xbox One'].map((p) => (
                    <span key={p} className="bg-primary px-3 py-1 rounded-lg text-xs border border-surface-border">{p}</span>
                  ))}
                </div>
              </div>

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
