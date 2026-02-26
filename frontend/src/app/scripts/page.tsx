'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getScripts } from '@/lib/api';
import type { Script } from '@/lib/api';

export default function ScriptsPage() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getScripts(search || undefined);
        setScripts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [search]);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Nos <span className="text-yellow-400">Scripts</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Scripts premium pour Cronus Zen. Livraison instantanée par email après achat.
          </p>
        </div>

        <div className="max-w-md mx-auto mb-10">
          <input
            type="text"
            placeholder="Rechercher un script..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface border border-surface-border rounded-xl px-5 py-3 text-white placeholder-gray-500 focus:border-yellow-500/50 focus:outline-none transition-colors"
          />
        </div>

        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-8 text-center">
          <span className="text-green-400 text-sm">
            ⚡ Livraison automatique — Recevez votre build chiffré unique par email immédiatement après paiement
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
          </div>
        ) : scripts.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            Aucun script trouvé.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scripts.map((script) => {
              const hasVideo = script.video_url && script.video_url.trim() !== '';
              return (
                <Link
                  key={script.id}
                  href={`/scripts/${script.slug}`}
                  className="group bg-surface rounded-2xl border border-surface-border overflow-hidden hover:border-yellow-500/30 transition-all"
                >
                  <div className="aspect-video relative overflow-hidden">
                    {script.images?.[0] ? (
                      <img
                        src={script.images[0]}
                        alt={script.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary flex items-center justify-center">
                        <span className="text-4xl">🎮</span>
                      </div>
                    )}

                    {/* Video badge */}
                    {hasVideo && (
                      <div className="absolute top-2 left-2 z-10">
                        <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-sm rounded-full px-2.5 py-1 border border-red-500/30">
                          <svg className="w-3 h-3 text-red-400" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                          <span className="text-[10px] text-white/90 font-medium tracking-wide uppercase">Démo</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold mb-1 group-hover:text-yellow-400 transition-colors">
                      {script.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{script.short_description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-yellow-400 font-bold text-xl">
                        {(script.price_cents / 100).toFixed(2)} €
                      </span>
                      <span className="text-yellow-400 text-sm group-hover:translate-x-1 transition-transform">
                        Voir détails →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
