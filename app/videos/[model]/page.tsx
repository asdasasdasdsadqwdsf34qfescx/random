"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { VideoPlayer } from "@/app/components/shared/VideoPlayer";

const ModelVideosPage = () => {
  const params = useParams();
  const model = params?.model as string;
  const [videos, setVideos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!model) return;
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/videos?name=${encodeURIComponent(model as string)}`);
        if (!res.ok) throw new Error("Could not load videos");
        const data = await res.json();
        setVideos(data.videos ?? []);
      } catch (err) {
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [model]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Videos for model: <span className="text-emerald-600">{model}</span></h1>
      {loading && <p>Loading...</p>}
      {!loading && videos.length === 0 && <p>No videos for this model.</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video, idx) => (
          <div key={idx} className="rounded shadow bg-black/80 p-2 flex flex-col items-center">
            <VideoPlayer
              className="w-full max-w-full bg-black/80"
              style={{ height: '300px', width: '100%' }}
              src={`/videos/${model}/${video}`}
            />
            <div className="text-xs text-gray-400 mt-2">{video}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelVideosPage;
