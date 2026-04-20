'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface BackgroundMusicProps {
  youtubeId: string;
  label?: string;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function BackgroundMusic({ youtubeId, label = 'Musique' }: BackgroundMusicProps) {
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const initPlayer = useCallback(() => {
    if (!containerRef.current || playerRef.current) return;
    playerRef.current = new window.YT.Player(containerRef.current, {
      videoId: youtubeId,
      height: '0',
      width: '0',
      playerVars: { autoplay: 0, loop: 1, playlist: youtubeId },
      events: {
        onReady: () => setReady(true),
      },
    });
  }, [youtubeId]);

  useEffect(() => {
    if (window.YT && window.YT.Player) {
      initPlayer();
      return;
    }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      initPlayer();
    };
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }
    return () => {
      playerRef.current?.destroy?.();
      playerRef.current = null;
    };
  }, [initPlayer]);

  function toggle() {
    if (!playerRef.current || !ready) return;
    if (playing) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.setVolume(25);
      playerRef.current.playVideo();
    }
    setPlaying(!playing);
  }

  return (
    <>
      <div ref={containerRef} className="hidden" />
      <button
        onClick={toggle}
        disabled={!ready}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-black/70 backdrop-blur-xl border border-white/10 hover:border-white/25 rounded-full px-4 py-2.5 transition-all group hover:scale-105 disabled:opacity-30 shadow-2xl"
        title={playing ? 'Couper la musique' : 'Jouer la musique'}
      >
        {playing ? (
          <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 8.5v7a4.49 4.49 0 002.5-3.5zM14 3.23v2.06a6.51 6.51 0 010 13.42v2.06A8.5 8.5 0 0014 3.23z" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 8.5v7a4.49 4.49 0 002.5-3.5z" />
          </svg>
        )}
        <span className="text-xs text-gray-400 group-hover:text-white transition-colors hidden sm:block font-medium">{label}</span>
        {playing && (
          <span className="flex items-end gap-[2px] h-3.5">
            {[0, 1, 2, 3].map(i => (
              <span key={i} className="w-[3px] bg-green-400 rounded-full" style={{
                animation: 'musicBar 0.6s ease-in-out infinite alternate',
                animationDelay: `${i * 0.12}s`,
                height: '40%'
              }} />
            ))}
          </span>
        )}
      </button>
    </>
  );
}
