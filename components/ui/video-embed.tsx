"use client";

import { useState } from "react";
import { Play } from "lucide-react";

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube(?:-nocookie)?\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}

/**
 * YouTube embed without the title/channel overlay: shows only the video
 * thumbnail with a play button, and loads the real player (autoplaying)
 * on click — so YouTube's top bar never appears before playback.
 */
export function VideoEmbed({ url, title }: { url: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const id = getYouTubeId(url);

  // Non-YouTube URLs: plain iframe
  if (!id) {
    return (
      <iframe
        src={url}
        title={title}
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
        allowFullScreen
      />
    );
  }

  if (!playing) {
    return (
      <button
        onClick={() => setPlaying(true)}
        aria-label={`Play video: ${title}`}
        className="group relative block h-full w-full cursor-pointer"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
          alt=""
          className="h-full w-full object-cover"
        />
        <span className="absolute inset-0 bg-black/35 transition group-hover:bg-black/20" />
        <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-light shadow-[0_8px_30px_rgba(0,0,0,0.6)] transition group-hover:scale-110">
          <Play className="ml-1 h-7 w-7 fill-[#1a1405] text-[#1a1405]" />
        </span>
      </button>
    );
  }

  return (
    <iframe
      src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1&fs=1`}
      title={title}
      className="h-full w-full"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}
