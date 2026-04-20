'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getScripts } from '@/lib/api';
import type { Script } from '@/lib/api';
import BackgroundMusic from '@/components/BackgroundMusic';

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
    <div className="min-h-screen relative">
      {/* ── Fortnite-themed background ── */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a20] via-[#0d0b1a] to-primary" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,rgba(147,51,234,0.08),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,130,246,0.06),transparent_50%)]" />
      </div>

      {/* ── Music player (client: placez votre MP3 dans public/audio/fortnite.mp3) ── */}
      <BackgroundMusic src="/audio/fortnite.mp3" label="Fortnite Theme" />

      <div className="py-12 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          {/* ── Header with Fortnite flair ── */}
          <div className="text-center mb-12 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
                <span className="text-purple-400">🎮</span>
                <span className="text-sm text-purple-400 font-medium">Catalogue complet</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black mb-4">
                Nos <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400">Scripts</span>
              </h1>
              <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                Scripts premium pour Cronus Zen. Livraison instantanée par email après achat.
              </p>
            </div>
          </div>

          {/* ── Search ── */}
          <div className="max-w-md mx-auto mb-10">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Rechercher un script..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-surface/80 backdrop-blur-sm border border-purple-500/20 rounded-xl pl-11 pr-5 py-3 text-white placeholder-gray-500 focus:border-purple-500/50 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* ── Delivery banner ── */}
          <div className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 border border-purple-500/20 rounded-xl p-4 mb-8 text-center">
            <span className="text-purple-300 text-sm">
              ⚡ Livraison automatique — Recevez votre build chiffré unique par email immédiatement après paiement
            </span>
          </div>

          {/* ── Scripts grid ── */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
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
                    className="group bg-surface/60 backdrop-blur-sm rounded-2xl border border-surface-border overflow-hidden hover:border-purple-500/40 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      {script.images?.[0] ? (
                        <img
                          src={script.images[0]}
                          alt={script.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-blue-900/50 flex items-center justify-center">
                          <span className="text-4xl">🎮</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

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
                      <h3 className="text-lg font-bold mb-1 group-hover:text-purple-400 transition-colors">
                        {script.name}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{script.short_description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-purple-400 font-bold text-xl">
                          {(script.price_cents / 100).toFixed(2)} €
                        </span>
                        <span className="text-purple-400 text-sm group-hover:translate-x-1 transition-transform font-medium">
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
    </div>
  );
}
