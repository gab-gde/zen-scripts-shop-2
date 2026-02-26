'use client';

import { useState } from 'react';

interface VideoPlayerProps {
  url: string;
  title: string;
  poster?: string;
}

function getYoutubeId(url: string): string | null {
  if (url.includes('youtu.be/')) {
    return url.split('youtu.be/')[1]?.split('?')[0]?.split('&')[0] || null;
  }
  if (url.includes('v=')) {
    return url.split('v=')[1]?.split('&')[0] || null;
  }
  if (url.includes('youtube.com/embed/')) {
    return url.split('embed/')[1]?.split('?')[0] || null;
  }
  return null;
}

export default function VideoPlayer({ url, title, poster }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);

  const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');
  const ytId = isYoutube ? getYoutubeId(url) : null;
  const thumbnailUrl = ytId ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg` : poster;

  return (
    <div className="rounded-2xl overflow-hidden border border-surface-border bg-black relative group">
      {/* Header bar */}
      <div className="bg-surface/80 backdrop-blur-sm border-b border-surface-border px-4 py-2.5 flex items-center gap-3">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-2 bg-primary/60 rounded-full px-3 py-0.5">
            <svg className="w-3 h-3 text-red-400" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="5" />
            </svg>
            <span className="text-xs text-gray-400 font-medium">Démo — {title}</span>
          </div>
        </div>
      </div>

      {/* Video area */}
      <div className="aspect-video relative">
        {playing ? (
          /* Embed actif */
          isYoutube && ytId ? (
            <iframe
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
              className="absolute inset-0 w-full h-full"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              style={{ border: 0 }}
            />
          ) : (
            <video
              src={url}
              poster={poster}
              playsInline
              controls
              autoPlay
              className="absolute inset-0 w-full h-full object-cover"
            />
          )
        ) : (
          /* Thumbnail + Play button */
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={() => setPlaying(true)}
          >
            <img
              src={thumbnailUrl || ''}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-all hover:bg-black/30">
              <div className="relative">
                <div className="absolute inset-0 w-20 h-20 -m-2 bg-yellow-500/20 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
                <div className="w-16 h-16 bg-yellow-500/90 backdrop-blur rounded-full flex items-center justify-center shadow-2xl shadow-yellow-500/40 hover:bg-yellow-400 hover:scale-110 transition-all duration-300">
                  <svg className="w-7 h-7 text-primary ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              <div className="absolute bottom-6 left-0 right-0 text-center">
                <span className="bg-black/60 backdrop-blur-sm text-white/80 text-sm px-4 py-1.5 rounded-full">
                  Cliquez pour voir la démo
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
