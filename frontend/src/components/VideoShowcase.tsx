'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface VideoItem {
  slug: string;
  name: string;
  video_url: string;
  short_description: string;
  images?: string[];
}

interface VideoShowcaseProps {
  videos: VideoItem[];
}

function getYoutubeId(url: string): string | null {
  if (url.includes('youtu.be/')) {
    return url.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0] || null;
  }
  if (url.includes('v=')) {
    return url.split('v=')[1]?.split('&')[0] || null;
  }
  return null;
}

function VideoCard({ video }: { video: VideoItem }) {
  const [isHovered, setIsHovered] = useState(false);

  const ytId = getYoutubeId(video.video_url);
  const thumbnailUrl = ytId
    ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
    : (video.images?.[0] || '');

  return (
    <div
      className="flex-shrink-0 w-[340px] md:w-[420px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/scripts/${video.slug}`} className="block">
        <div className={`relative rounded-2xl overflow-hidden border transition-all duration-500 ${
          isHovered
            ? 'border-yellow-500/60 shadow-[0_0_40px_rgba(250,204,21,0.15)] scale-[1.02]'
            : 'border-surface-border'
        }`}>
          <div className="aspect-video relative bg-black">
            {/* Thumbnail */}
            <img
              src={thumbnailUrl}
              alt={video.name}
              className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${
                isHovered ? 'scale-105' : ''
              }`}
            />

            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10" />

            {/* Play icon center */}
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-70'
            }`}>
              <div className={`w-14 h-14 bg-yellow-500/90 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                isHovered ? 'scale-110 shadow-yellow-500/40' : 'shadow-yellow-500/20'
              }`}>
                <svg className="w-6 h-6 text-primary ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>

            {/* Demo badge */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-white/80 font-medium tracking-wide uppercase">Demo</span>
            </div>

            {/* CTA on hover */}
            <div className={`absolute top-3 left-3 transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
            }`}>
              <div className="bg-yellow-500 rounded-full px-3 py-1 flex items-center gap-1.5">
                <span className="text-primary text-xs font-bold">Voir le script</span>
                <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Bottom info */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className={`font-bold text-lg transition-colors duration-300 ${
                isHovered ? 'text-yellow-400' : 'text-white'
              }`}>
                {video.name}
              </h3>
              <p className="text-gray-400 text-sm mt-0.5 line-clamp-1">{video.short_description}</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function VideoShowcase({ videos }: VideoShowcaseProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const displayVideos = [...videos, ...videos];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || videos.length === 0) return;

    let animId: number;
    let pos = 0;

    function tick() {
      if (!el) return;
      if (!isPaused) {
        pos += 0.5;
        if (pos >= el.scrollWidth / 2) pos = 0;
        el.style.transform = `translateX(-${pos}px)`;
      }
      animId = requestAnimationFrame(tick);
    }

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isPaused, videos.length]);

  if (videos.length === 0) return null;

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(250,204,21,0.05),transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="flex items-end justify-between">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-3 py-1.5 mb-4">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs text-red-400 font-medium tracking-wider uppercase">Démos</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Voyez nos scripts <span className="text-yellow-400">en action</span>
            </h2>
            <p className="text-gray-400 mt-3 max-w-lg">
              Aperçu de ce que vous obtenez. Cliquez pour voir la démo complète.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="flex items-center gap-2 bg-surface border border-surface-border rounded-full px-4 py-2 text-sm text-gray-400 hover:text-white hover:border-yellow-500/30 transition-all"
            >
              {isPaused ? (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  Reprendre
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                  Pause
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-primary to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-primary to-transparent z-10 pointer-events-none" />

        <div className="overflow-hidden">
          <div
            ref={scrollRef}
            className="flex gap-5 pl-4 will-change-transform"
            style={{ width: 'max-content' }}
          >
            {displayVideos.map((video, i) => (
              <VideoCard key={`${video.slug}-${i}`} video={video} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
