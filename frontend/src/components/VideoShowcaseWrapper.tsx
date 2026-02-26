'use client';

import { useEffect, useState } from 'react';
import VideoShowcase from './VideoShowcase';
import { getScripts } from '@/lib/api';

export default function VideoShowcaseWrapper() {
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const scripts = await getScripts();
        // Filter scripts that have a video_url
        const withVideos = scripts
          .filter((s: any) => s.video_url && s.video_url.trim() !== '')
          .map((s: any) => ({
            slug: s.slug,
            name: s.name,
            video_url: s.video_url,
            short_description: s.short_description,
          }));
        setVideos(withVideos);
      } catch (err) {
        console.error('[VideoShowcase] Failed to load:', err);
      }
    }
    load();
  }, []);

  if (videos.length === 0) return null;

  return <VideoShowcase videos={videos} />;
}
