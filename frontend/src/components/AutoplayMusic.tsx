'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

declare global {
  interface Window { YT: any; onYouTubeIframeAPIReady: () => void; }
}

export default function AutoplayMusic({ youtubeId, label = '🔊' }: { youtubeId: string; label?: string }) {
  const [muted, setMuted] = useState(true);
  const playerRef = useRef<any>(null);
  const divRef = useRef<HTMLDivElement>(null);

  const init = useCallback(() => {
    if (!divRef.current || playerRef.current) return;
    playerRef.current = new window.YT.Player(divRef.current, {
      videoId: youtubeId,
      height: '0',
      width: '0',
      playerVars: { autoplay: 1, loop: 1, playlist: youtubeId, mute: 1 },
      events: {
        onReady: (e: any) => { e.target.setVolume(25); e.target.playVideo(); },
      },
    });
  }, [youtubeId]);

  useEffect(() => {
    if (window.YT?.Player) { init(); return; }
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { prev?.(); init(); };
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(s);
    }
    return () => { try { playerRef.current?.destroy(); } catch {} playerRef.current = null; };
  }, [init]);

  function toggleMute() {
    if (!playerRef.current) return;
    if (muted) { playerRef.current.unMute(); playerRef.current.setVolume(25); }
    else { playerRef.current.mute(); }
    setMuted(!muted);
  }

  return (
    <>
      <div ref={divRef} className="hidden" />
      {muted ? (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <button
            onClick={toggleMute}
            className="flex items-center gap-2.5 bg-black/80 backdrop-blur-xl border border-white/15 rounded-full px-6 py-3 text-white hover:bg-black/90 hover:border-white/30 transition-all shadow-2xl shadow-black/50 animate-[bounce_2s_ease-in-out_3]"
          >
            <span className="text-lg">🔊</span>
            <span className="text-sm font-medium">Activer le son</span>
          </button>
        </div>
      ) : (
        <button
          onClick={toggleMute}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-3.5 py-2.5 transition-all hover:bg-black/80 group"
        >
          <span className="flex items-end gap-[2px] h-3.5">
            {[0, 1, 2, 3].map(i => (
              <span
                key={i}
                className="w-[3px] bg-green-400 rounded-full"
                style={{ animation: 'musicBar 0.6s ease-in-out infinite alternate', animationDelay: `${i * 0.12}s`, height: '40%' }}
              />
            ))}
          </span>
          <span className="text-xs text-gray-400 group-hover:text-white hidden sm:block">{label}</span>
        </button>
      )}
    </>
  );
}
