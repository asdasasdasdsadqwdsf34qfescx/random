"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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
        if (!res.ok) throw new Error("Nu s-au putut încărca videourile");
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
      <h1 className="text-2xl font-bold mb-6">Videouri pentru model: <span className="text-emerald-600">{model}</span></h1>
      {loading && <p>Loading...</p>}
      {!loading && videos.length === 0 && <p>Nu există videouri pentru acest model.</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video, idx) => (
          <div key={idx} className="rounded shadow bg-black/80 p-2 flex flex-col items-center">
            <video
              controls
              className="w-full max-w-full rounded shadow bg-black/80"
              style={{ height: '300px', width: '100%' }}
              src={`/videos/${model}/${video}`}
            />
            <div className="text-xs text-gray-400 mt-2">{video}</div>
            <button
              className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
              onClick={() => {
                const url = `/videos/${model}/${video}`;
                window.open(url, '_blank');
              }}
            >
              Deschide în alt tab
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelVideosPage;
