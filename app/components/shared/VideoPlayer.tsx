"use client";
import { useState, useRef } from "react";

interface VideoPlayerProps {
  src: string;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
  showExternalLink?: boolean;
}

export const VideoPlayer = ({
  src,
  title,
  className = "",
  style,
  showExternalLink = true,
}: VideoPlayerProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  return (
    <div className={`relative group rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm ${className}`} style={style}>
      <div className="aspect-video relative">
        {isLoading && (
          <div className="absolute inset-0 animate-pulse bg-slate-200 dark:bg-slate-800" />
        )}
        <video
          ref={videoRef}
          controls
          preload="metadata"
          className={`absolute inset-0 w-full h-full object-cover ${isLoading ? "opacity-0" : "opacity-100"}`}
          src={src}
          title={title}
          onLoadedData={() => setIsLoading(false)}
        />
      </div>

      {showExternalLink && (
        <button
          onClick={() => window.open(src, "_blank")}
          className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-md transition-opacity duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          title="Deschide în tab nou"
          aria-label="Deschide în tab nou"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </button>
      )}
    </div>
  );
};
