'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { getScriptBySlug, createCheckoutSession, validateDiscountCode } from '@/lib/api';
import { useAuth } from '@/components/AuthProvider';
import VideoPlayer from '@/components/VideoPlayer';
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
  const [activeTab, setActiveTab] = useState<'description' | 'video'>('description');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getScriptBySlug(params.slug as string);
        setScript(data);
        // If script has video, default to video tab
        if (data?.video_url) {
          setActiveTab('video');
        }
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

  const hasVideo = script.video_url && script.video_url.trim() !== '';

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        <Link href="/scripts" className="text-gray-400 hover:text-white mb-8 inline-flex items-center gap-2">
          ← Retour aux scripts
        </Link>

        <div className="grid lg:grid-cols-3 gap-8 mt-6">
          <div className="lg:col-span-2">
            {/* ═══ Tab switcher (only if video exists) ═══ */}
            {hasVideo && (
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setActiveTab('video')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'video'
                      ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                      : 'bg-surface text-gray-400 border border-surface-border hover:text-white'
                  }`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  Démo vidéo
                </button>
                <button
                  onClick={() => setActiveTab('description')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === 'description'
                      ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30'
                      : 'bg-surface text-gray-400 border border-surface-border hover:text-white'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Description
                </button>
              </div>
            )}

            {/* ═══ Video section ═══ */}
            {hasVideo && activeTab === 'video' && (
              <div className="mb-8">
                <VideoPlayer
                  url={script.video_url!}
                  title={script.name}
                  poster={script.images?.[0]}
                />
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                  <svg className="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                  <span>Gameplay réel filmé avec notre script actif — ce que vous obtiendrez</span>
                </div>
              </div>
            )}

            {/* ═══ Image (show if no video, or if on description tab) ═══ */}
            {((!hasVideo && script.images && script.images.length > 0) || (activeTab === 'description' && script.images && script.images.length > 0)) && (
              <div className="rounded-2xl overflow-hidden border border-surface-border mb-8">
                <img src={script.images[0]} alt={script.name} className="w-full aspect-video object-cover" />
              </div>
            )}

            {/* ═══ Description ═══ */}
            {(activeTab === 'description' || !hasVideo) && (
              <div className="bg-surface rounded-2xl border border-surface-border p-8">
                <h2 className="text-2xl font-bold mb-6">Description</h2>
                <div className="prose-custom">
                  <ReactMarkdown>{script.description}</ReactMarkdown>
                </div>
              </div>
            )}

            {/* ═══ Always show description below video ═══ */}
            {hasVideo && activeTab === 'video' && (
              <div className="bg-surface rounded-2xl border border-surface-border p-8">
                <h2 className="text-2xl font-bold mb-6">Description</h2>
                <div className="prose-custom">
                  <ReactMarkdown>{script.description}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-surface rounded-2xl border border-surface-border p-6">
              <h1 className="text-2xl font-bold mb-2">{script.name}</h1>
              <p className="text-gray-400 text-sm mb-6">{script.short_description}</p>

              {/* Video badge */}
              {hasVideo && (
                <div className="mb-4 flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  <span className="text-sm text-red-400 font-medium">Démo vidéo disponible</span>
                </div>
              )}

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
                  hasVideo ? '🎥 Démo vidéo vérifiable' : null,
                  user ? `💎 +${Math.floor((getFinalPrice() / 100) * 10)} points de fidélité` : '💎 Créez un compte pour gagner des points',
                ].filter(Boolean).map((f, i) => (
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
