'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getScripts, Script } from '@/lib/api';

function formatPrice(cents: number, currency: string): string {
  return `${(cents / 100).toFixed(2)} ${currency}`;
}

function ScriptCard({ script }: { script: Script }) {
  return (
    <Link
      href={`/scripts/${script.slug}`}
      className="group bg-surface rounded-2xl border border-surface-border overflow-hidden card-hover"
    >
      <div className="aspect-video bg-primary-light relative overflow-hidden">
        {script.images[0] ? (
          <Image
            src={script.images[0]}
            alt={script.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🎮</span>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-60" />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
          {script.name}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {script.short_description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-accent">
            {formatPrice(script.price_cents, script.currency)}
          </span>
          <span className="text-sm text-gray-500 group-hover:text-accent transition-colors flex items-center gap-1">
            Voir détails
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ScriptsPage() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadScripts() {
      try {
        setLoading(true);
        const data = await getScripts(search || undefined);
        setScripts(data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des scripts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    const debounce = setTimeout(loadScripts, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Nos <span className="text-accent">Scripts</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Scripts professionnels pour Cronus Zen. Tous compatibles EA FC 26 et mis à jour régulièrement.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un script..."
              className="w-full bg-surface border border-surface-border rounded-xl px-5 py-4 pl-12 text-white placeholder-gray-500 focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => setSearch('')}
              className="text-accent hover:underline"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Scripts Grid */}
        {!loading && !error && (
          <>
            {scripts.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🔍</span>
                </div>
                <p className="text-gray-400 text-lg mb-2">Aucun script trouvé</p>
                <p className="text-gray-500 text-sm">
                  {search ? 'Essayez avec d\'autres mots-clés' : 'Revenez bientôt !'}
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {scripts.map((script) => (
                  <ScriptCard key={script.id} script={script} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Info Box */}
        <div className="mt-16 bg-surface rounded-2xl border border-surface-border p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-accent/20">
              <svg className="w-7 h-7 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Comment ça fonctionne ?</h3>
              <p className="text-gray-400 mb-4">
                Après l'achat, vous recevez un email avec les instructions. Rejoignez notre Discord, 
                enregistrez votre serial Cronus Zen, et flashez le script via le Marketplace officiel.
              </p>
              <Link href="/faq" className="text-accent hover:underline font-medium">
                Voir la FAQ complète →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
