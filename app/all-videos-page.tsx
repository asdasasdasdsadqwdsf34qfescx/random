import { useEffect, useState } from "react";

const AllVideosPage = () => {
  const [allVideos, setAllVideos] = useState<{ model: string; video: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllVideos = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/allvideos");
        if (!res.ok) throw new Error("Nu s-au putut încărca videourile");
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Toate videourile</h1>
      {loading && <p>Loading...</p>}
      {!loading && allVideos.length === 0 && <p>Nu există videouri.</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allVideos.map((item, idx) => (
          <div key={idx} className="rounded shadow bg-black/80 p-2 flex flex-col items-center">
            <div className="mb-2 text-emerald-400 font-semibold">{item.model}</div>
            <video
              controls
              className="w-full max-w-full rounded shadow bg-black/80"
              style={{ height: '300px', width: '100%' }}
              src={`/videos/${item.model}/${item.video}`}
            />
            <div className="text-xs text-gray-400 mt-2">{item.video}</div>
            <button
              className="mt-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs"
              onClick={() => {
                const url = `/videos/${item.model}/${item.video}`;
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

export default AllVideosPage;
