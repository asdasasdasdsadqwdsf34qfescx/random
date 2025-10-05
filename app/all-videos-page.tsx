import { useEffect, useState } from "react";
import { VideoPlayer } from "./components/shared/VideoPlayer";

const AllVideosPage = () => {
  const [allVideos, setAllVideos] = useState<{ model: string; video: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllVideos = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/allvideos");
        if (!res.ok) throw new Error("Could not load videos");
        const data = await res.json();
        setAllVideos(data.allVideos ?? []);
      } catch (err) {
        setAllVideos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAllVideos();
  }, []);

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold mb-6">All videos</h1>
      {loading && <p>Loading...</p>}
      {!loading && allVideos.length === 0 && <p>No videos.</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allVideos.map((item, idx) => (
          <div key={idx} className="rounded shadow bg-black/80 p-2 flex flex-col items-center">
            <div className="mb-2 text-emerald-400 font-semibold">{item.model}</div>
            <VideoPlayer
              className="w-full max-w-full bg-black/80"
              style={{ height: '300px', width: '100%' }}
              src={`/videos/${item.model}/${item.video}`}
            />
            <div className="text-xs text-gray-400 mt-2">{item.video}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllVideosPage;
