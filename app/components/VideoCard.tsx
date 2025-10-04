"use client";
import { useEffect, useRef, useState } from "react";

interface VideoCardProps {
  src: string;
  title?: string;
}

export default function VideoCard({ src, title }: VideoCardProps) {
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: "200px", threshold: 0.01 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="bg-gray-800/80 rounded-xl shadow-xl overflow-hidden border border-white/10">
      {inView ? (
        <video
          src={src}
          preload="metadata"
          controls
          muted
          playsInline
          className="w-full h-64 object-cover bg-black"
          controlsList="nodownload noremoteplayback"
          disablePictureInPicture
          aria-label={title}
        />
      ) : (
        <div className="w-full h-64 bg-gray-700 animate-pulse" aria-hidden />
      )}
    </div>
  );
}
