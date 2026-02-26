'use client';

import { useRef, useState } from 'react';

interface VideoPlayerProps {
  url: string;
  title: string;
  poster?: string;
}

export default function VideoPlayer({ url, title, poster }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const isYoutube = url.includes('youtube.com') || url.includes('youtu.be');

  function getYoutubeEmbedUrl(ytUrl: string): string {
    let videoId = '';
    if (ytUrl.includes('youtu.be/')) {
      videoId = ytUrl.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (ytUrl.includes('v=')) {
      videoId = ytUrl.split('v=')[1]?.split('&')[0] || '';
    }
    return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1&playsinline=1`;
  }

  function handlePlay() {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
      setShowControls(false);
    }
  }

  function handleVideoClick() {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    setShowControls(!isPlaying);
  }

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
        {isYoutube ? (
          <iframe
            src={getYoutubeEmbedUrl(url)}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            loading="lazy"
            style={{ border: 0 }}
          />
        ) : (
          <>
            <video
              ref={videoRef}
              src={url}
              poster={poster}
              playsInline
              controls={isPlaying}
              preload="metadata"
              onClick={handleVideoClick}
              onEnded={() => { setIsPlaying(false); setShowControls(true); }}
              className="absolute inset-0 w-full h-full object-cover cursor-pointer"
            />

            {/* Play overlay */}
            {showControls && !isPlaying && (
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer transition-all"
                onClick={handlePlay}
              >
                <div className="relative">
                  {/* Glow ring */}
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
            )}
          </>
        )}
      </div>
    </div>
  );
}
