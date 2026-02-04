'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { getScriptBySlug, createCheckoutSession, Script } from '@/lib/api';

function formatPrice(cents: number, currency: string): string {
  return `${(cents / 100).toFixed(2)} ${currency}`;
}

export default function ScriptDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [script, setScript] = useState<Script | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadScript() {
      try {
        setLoading(true);
        const data = await getScriptBySlug(slug);
        if (!data) {
          setError('Script non trouvé');
        } else {
          setScript(data);
        }
      } catch (err) {
        setError('Erreur lors du chargement');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadScript();
    }
  }, [slug]);

  const handlePurchase = async () => {
    if (!script) return;

    try {
      setPurchasing(true);
      const { url } = await createCheckoutSession(script.id);
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      setError('Erreur lors de la création du paiement');
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !script) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">😕</span>
          </div>
          <h1 className="text-2xl font-bold mb-4">{error || 'Script non trouvé'}</h1>
          <Link href="/scripts" className="text-accent hover:underline">
            ← Retour aux scripts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link href="/scripts" className="text-gray-400 hover:text-white transition-colors">
            ← Retour aux scripts
          </Link>
        </nav>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Image */}
            {script.images[0] && (
              <div className="aspect-video bg-surface rounded-2xl overflow-hidden mb-8 relative">
                <Image
                  src={script.images[0]}
                  alt={script.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Title (mobile) */}
            <div className="lg:hidden mb-8">
              <h1 className="text-3xl font-bold mb-2">{script.name}</h1>
              <p className="text-gray-400">{script.short_description}</p>
            </div>

            {/* Description */}
            <div className="bg-surface rounded-2xl border border-surface-border p-8">
              <div className="prose-custom">
                <ReactMarkdown>{script.description}</ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Sidebar - Purchase Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-surface rounded-2xl border border-surface-border p-6">
                {/* Title (desktop) */}
                <div className="hidden lg:block mb-6">
                  <h1 className="text-2xl font-bold mb-2">{script.name}</h1>
                  <p className="text-gray-400 text-sm">{script.short_description}</p>
                </div>

                {/* Price */}
                <div className="mb-6 pb-6 border-b border-surface-border">
                  <div className="text-sm text-gray-400 mb-1">Prix</div>
                  <div className="text-4xl font-bold text-accent">
                    {formatPrice(script.price_cents, script.currency)}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3 text-sm">
                    <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Livraison instantanée par email</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Mises à jour gratuites à vie</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Support Discord inclus</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Distribution sécurisée Marketplace</span>
                  </li>
                </ul>

                {/* Purchase Button */}
                <button
                  onClick={handlePurchase}
                  disabled={purchasing}
                  className="w-full bg-accent hover:bg-accent-dark text-primary font-bold py-4 rounded-xl transition-all hover:shadow-lg hover:shadow-accent/30 disabled:opacity-50 disabled:cursor-not-allowed btn-glow"
                >
                  {purchasing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Redirection...
                    </span>
                  ) : (
                    `Acheter - ${formatPrice(script.price_cents, script.currency)}`
                  )}
                </button>

                {/* Payment methods */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500 mb-2">Paiement sécurisé par</p>
                  <div className="flex justify-center gap-4 text-gray-400">
                    <span className="text-sm font-medium">Stripe</span>
                    <span className="text-sm">•</span>
                    <span className="text-sm">Visa</span>
                    <span className="text-sm">•</span>
                    <span className="text-sm">Mastercard</span>
                  </div>
                </div>
              </div>

              {/* Compatibility */}
              <div className="mt-6 bg-surface/50 rounded-xl border border-surface-border p-4">
                <div className="text-sm text-gray-400 mb-3">Compatible avec</div>
                <div className="flex flex-wrap gap-2">
                  {['PS5', 'PS4', 'Xbox Series', 'Xbox One'].map((platform) => (
                    <span
                      key={platform}
                      className="bg-surface px-3 py-1 rounded-lg text-sm border border-surface-border"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>

              {/* Help */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-400 mb-2">Des questions ?</p>
                <Link href="/faq" className="text-accent hover:underline text-sm">
                  Voir la FAQ
                </Link>
                <span className="text-gray-600 mx-2">ou</span>
                <Link href="/support" className="text-accent hover:underline text-sm">
                  Contactez-nous
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
