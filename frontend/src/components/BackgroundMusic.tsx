'use client';

import { useState, useRef, useEffect } from 'react';

interface BackgroundMusicProps {
  src: string;
  label?: string;
}

export default function BackgroundMusic({ src, label = 'Musique' }: BackgroundMusicProps) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(src);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [src]);

  function toggle() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlaying(!playing);
  }

  return (
    <button
      onClick={toggle}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 hover:border-white/30 rounded-full px-4 py-2.5 transition-all group hover:scale-105"
      title={playing ? 'Couper la musique' : 'Jouer la musique'}
    >
      {playing ? (
        <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 8.5v7a4.49 4.49 0 002.5-3.5zM14 3.23v2.06a6.51 6.51 0 010 13.42v2.06A8.5 8.5 0 0014 3.23z" />
        </svg>
      ) : (
        <svg className="w-4 h-4 text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16.5 12A4.5 4.5 0 0014 8.5v7a4.49 4.49 0 002.5-3.5zM3 9v6h4l5 5V4L7 9H3z" />
          <line x1="23" y1="1" x2="1" y2="23" stroke="currentColor" strokeWidth="2" />
        </svg>
      )}
      <span className="text-xs text-gray-400 group-hover:text-white hidden sm:block">{label}</span>
      {playing && (
        <span className="flex gap-0.5">
          {[1,2,3].map(i => (
            <span key={i} className="w-0.5 bg-green-400 rounded-full animate-pulse" style={{ height: `${8 + i * 3}px`, animationDelay: `${i * 0.15}s` }} />
          ))}
        </span>
      )}
    </button>
  );
}
