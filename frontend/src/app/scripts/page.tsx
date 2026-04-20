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
      {/* ── Fortnite themed background ── */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[#080818]" />
        <div className="absolute inset-0 fortnite-glow" />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(rgba(147,51,234,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(147,51,234,0.3) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }} />
      </div>

      {/* ── Fortnite OG Lobby Music (YouTube) ── */}
      <BackgroundMusic youtubeId="HHCAz5mQnYY" label="Fortnite OG" />

      <div className="py-12 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          {/* ── Hero header with Fortnite image ── */}
          <div className="relative rounded-3xl overflow-hidden mb-12">
            <div className="absolute inset-0">
              <img src="/images/fortnite.jpg" alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-[#080818]/70 to-blue-900/80" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080818] via-transparent to-transparent" />
            </div>
            <div className="relative z-10 py-16 px-8 text-center">
              <div className="inline-flex items-center gap-2 bg-purple-500/15 backdrop-blur-sm border border-purple-500/25 rounded-full px-5 py-2 mb-6">
                <span className="text-purple-400">🎮</span>
                <span className="text-sm text-purple-300 font-medium">Catalogue complet</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black mb-4">
                Nos <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400">Scripts</span>
              </h1>
              <p className="text-gray-300 max-w-2xl mx-auto text-lg">
                Scripts premium pour Cronus Zen. Livraison instantanée par email après achat.
              </p>
            </div>
          </div>

          {/* ── Search ── */}
          <div className="max-w-md mx-auto mb-10">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Rechercher un script..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/[0.04] backdrop-blur-sm border border-purple-500/15 rounded-2xl pl-11 pr-5 py-3.5 text-white placeholder-gray-500 focus:border-purple-500/40 focus:bg-white/[0.06] focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* ── Delivery banner ── */}
          <div className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 border border-purple-500/15 rounded-2xl p-4 mb-10 text-center backdrop-blur-sm">
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
            <div className="text-center py-20 text-gray-400">Aucun script trouvé.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {scripts.map((script) => {
                const hasVideo = script.video_url && script.video_url.trim() !== '';
                return (
                  <Link
                    key={script.id}
                    href={`/scripts/${script.slug}`}
                    className="group bg-white/[0.03] backdrop-blur-sm rounded-2xl border border-white/[0.06] overflow-hidden hover:border-purple-500/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      {script.images?.[0] ? (
                        <img
                          src={script.images[0]}
                          alt={script.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-900/50 to-blue-900/50 flex items-center justify-center">
                          <span className="text-4xl">🎮</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080818] via-transparent to-transparent opacity-60" />
                      {/* Purple hover overlay */}
                      <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/10 transition-colors duration-300" />

                      {hasVideo && (
                        <div className="absolute top-2 left-2 z-10">
                          <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 border border-red-500/30">
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
                        <span className="text-purple-400/70 text-sm group-hover:text-purple-300 group-hover:translate-x-1 transition-all font-medium">
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
