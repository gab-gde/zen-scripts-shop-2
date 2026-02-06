'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getScripts, Script } from '@/lib/api';

export default function ScriptsPage() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getScripts(search || undefined);
        setScripts(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };
    const debounce = setTimeout(load, 300);
    return () => clearTimeout(debounce);
  }, [search]);

  // Fonction pour obtenir l'image locale selon le slug
  const getLocalImage = (slug: string): string => {
    const images: Record<string, string> = {
      'r6-siege-ultimate': '/images/r6.jpg',
      'fc26-pro-controller': '/images/fc26.jpg',
      'pubg-battlegrounds-pro': '/images/pubg.jpg',
      'nba-2k25-shot-perfect': '/images/nba2k.jpg',
      'rocket-league-precision': '/images/rocket.jpg',
      'black-ops-6-dominator': '/images/bo6.jpg',
      'dayz-survivor-pro': '/images/dayz.jpg',
      'rust-recoil-master': '/images/rust.jpg',
    };
    return images[slug] || '/images/default.jpg';
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Nos <span className="text-yellow-400">Scripts</span></h1>
          <p className="text-gray-400">Scripts professionnels pour Cronus Zen. Tous les jeux, toutes les plateformes.</p>
        </div>

        <div className="max-w-md mx-auto mb-12">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un script..."
            className="w-full bg-surface border border-surface-border rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
          />
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center py-20 text-red-400">
            {error}
            <button onClick={() => setSearch('')} className="block mx-auto mt-4 text-yellow-400 hover:underline">Réessayer</button>
          </div>
        )}

        {!loading && !error && scripts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-400">Aucun script trouvé</p>
          </div>
        )}

        {!loading && !error && scripts.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {scripts.map((script) => (
              <Link key={script.id} href={`/scripts/${script.slug}`} className="group bg-surface rounded-2xl border border-surface-border overflow-hidden card-hover">
                <div className="aspect-video bg-primary-light relative overflow-hidden">
                  <img 
                    src={getLocalImage(script.slug)} 
                    alt={script.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback si l'image locale n'existe pas
                      const target = e.target as HTMLImageElement;
                      if (script.images[0]) {
                        target.src = script.images[0];
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-60" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-yellow-400 transition-colors">{script.name}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{script.short_description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-yellow-400">{(script.price_cents / 100).toFixed(2)} €</span>
                    <span className="text-sm text-gray-500 group-hover:text-yellow-400 transition-colors">Voir →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-16 bg-surface rounded-2xl border border-surface-border p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-14 h-14 bg-yellow-500/10 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl border border-yellow-500/20">
              💡
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Comment ça fonctionne ?</h3>
              <p className="text-gray-400 mb-4">
                Après l'achat, vous recevez un email avec les instructions. Rejoignez notre Discord, 
                enregistrez votre serial Cronus Zen, et flashez le script via le Marketplace officiel.
              </p>
              <Link href="/faq" className="text-yellow-400 hover:underline font-medium">
                Voir la FAQ complète →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
