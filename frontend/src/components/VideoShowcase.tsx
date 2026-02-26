'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

interface VideoItem {
  slug: string;
  name: string;
  video_url: string;
  short_description: string;
}

interface VideoShowcaseProps {
  videos: VideoItem[];
}

function VideoCard({ video, index }: { video: VideoItem; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isVisible) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isVisible]);

  const isYoutube = video.video_url.includes('youtube.com') || video.video_url.includes('youtu.be');

  function getYoutubeEmbedUrl(url: string): string {
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (url.includes('v=')) {
      videoId = url.split('v=')[1]?.split('&')[0] || '';
    }
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&modestbranding=1&rel=0&playsinline=1`;
  }

  return (
    <div
      ref={cardRef}
      className="video-card flex-shrink-0 w-[340px] md:w-[420px] group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/scripts/${video.slug}`} className="block">
        <div className={`relative rounded-2xl overflow-hidden border transition-all duration-500 ${
          isHovered 
            ? 'border-yellow-500/60 shadow-[0_0_40px_rgba(250,204,21,0.15)] scale-[1.03]' 
            : 'border-surface-border shadow-xl'
        }`}>
          {/* Video */}
          <div className="aspect-video relative bg-primary">
            {isYoutube ? (
              <iframe
                src={getYoutubeEmbedUrl(video.video_url)}
                className="absolute inset-0 w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
                loading="lazy"
                style={{ border: 0 }}
              />
            ) : (
              <video
                ref={videoRef}
                src={video.video_url}
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

            {/* Play indicator */}
            <div className={`absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1 transition-all duration-300 ${
              isHovered ? 'opacity-0 scale-90' : 'opacity-100'
            }`}>
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-white/80 font-medium tracking-wide uppercase">Live</span>
            </div>

            {/* Hover CTA */}
            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 pointer-events-none ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className="bg-yellow-500/90 backdrop-blur-sm rounded-full px-6 py-2.5 flex items-center gap-2 shadow-lg shadow-yellow-500/30">
                <span className="text-primary font-bold text-sm">Voir le script</span>
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
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

  // Double the videos for seamless loop
  const displayVideos = [...videos, ...videos];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || videos.length === 0) return;

    let animationId: number;
    let scrollPos = 0;
    const speed = 0.5; // px per frame

    function animate() {
      if (!scrollContainer || isPaused) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      scrollPos += speed;
      const halfWidth = scrollContainer.scrollWidth / 2;

      if (scrollPos >= halfWidth) {
        scrollPos = 0;
      }

      scrollContainer.style.transform = `translateX(-${scrollPos}px)`;
      animationId = requestAnimationFrame(animate);
    }

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused, videos.length]);

  if (videos.length === 0) return null;

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(250,204,21,0.05),transparent_70%)]" />
      
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <div className="flex items-end justify-between">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-3 py-1.5 mb-4">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-xs text-red-400 font-medium tracking-wider uppercase">Démos en direct</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Voyez nos scripts <span className="text-yellow-400">en action</span>
            </h2>
            <p className="text-gray-400 mt-3 max-w-lg">
              Aperçu de ce que vous obtenez. Chaque script est filmé en conditions réelles de jeu.
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

      {/* Scroll container */}
      <div
        className="relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-r from-primary to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 bg-gradient-to-l from-primary to-transparent z-10 pointer-events-none" />

        <div className="overflow-hidden">
          <div
            ref={scrollRef}
            className="flex gap-5 pl-4 will-change-transform"
            style={{ width: 'max-content' }}
          >
            {displayVideos.map((video, i) => (
              <VideoCard key={`${video.slug}-${i}`} video={video} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
