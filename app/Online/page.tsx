"use client";

import { useState, useEffect, useRef, memo } from "react";
import Sidebar from "../components/Sidebar";
import { VideoModel } from "@/app/types";
import { add, getOnlineModels } from "../ids";

// Модальное окно для добавления новой модели
const AddModelModal = ({
  show,
  onAdd,
  onCancel,
  newModelName,
  setNewModelName,
}: {
  show: boolean;
  onAdd: () => void;
  onCancel: () => void;
  newModelName: string;
  setNewModelName: (name: string) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus();
    }
  }, [show]);

  if (!show) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-slate-900 p-8 rounded-2xl shadow-2xl border-2 border-emerald-400/20 min-w-[320px] flex flex-col gap-4">
        <h2 className="text-xl font-bold text-white mb-2">Add New Pinned Model</h2>
        <input
          type="text"
          placeholder="Model name"
          value={newModelName}
          onChange={(e) => setNewModelName(e.target.value)}
          className="px-4 py-3 rounded-lg bg-white text-slate-900 border-2 border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-300 text-lg font-semibold shadow-md placeholder:text-slate-400"
          ref={inputRef}
          style={{ minWidth: 0 }}
        />
        <div className="flex gap-4 mt-4">
          <button
            className="flex-1 px-4 py-2 rounded bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-900 font-semibold hover:from-emerald-300 hover:to-cyan-300 transition-colors"
            onClick={onAdd}
            disabled={!newModelName.trim()}
          >
            Add
          </button>
          <button
            className="flex-1 px-4 py-2 rounded bg-slate-700 text-white font-semibold hover:bg-slate-600 transition-colors"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const OnlineModelCard = memo(({ model }: { model: VideoModel }) => {
  const [showVideo, setShowVideo] = useState(false);

  const handleMouseEnter = () => {
    setShowVideo(true);
  };

  const handleMouseLeave = () => {
    setShowVideo(false);
  };

  return (
    <div
      className="group relative bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl transition-transform duration-300 hover:scale-[1.04] hover:shadow-2xl hover:z-20 border border-gradient-to-br from-yellow-400/40 via-emerald-400/30 to-cyan-400/40 hover:border-emerald-400/60 ring-1 ring-white/10"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-emerald-400/10 to-cyan-400/10 opacity-60 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none z-0" />
      <div className="aspect-video relative">
        {showVideo ? (
          <iframe
            src={`https://chaturbate.com/embed/${model.name}/?join_overlay=1&campaign=GeOP2&embed_video_only=1&disable_sound=1&tour=9oGW&mobileRedirect=never&disable_autoplay=1`}
            className="w-full h-full object-cover rounded-t-2xl shadow-2xl border-b-4 border-emerald-400/30"
            frameBorder="0"
            scrolling="no"
            allowFullScreen
            title={`${model.name} Live Cam`}
            loading="lazy"
          />
          
        ) : (
          <img
            src={model.imageUrl}
            alt={`Preview for ${model.name}`}
            className="w-full h-full object-cover rounded-t-2xl shadow-xl border-b-4 border-yellow-400/20"
          />
        )}
      </div>
        <span className="flex justify-center items-center font-bold text-lg text-transparent bg-gradient-to-r from-yellow-300 via-emerald-300 to-cyan-300 bg-clip-text drop-shadow">
          {model.name}
        </span>
    </div>
  );
});

const OnlineTab = () => {
  const [online, setOnline] = useState<VideoModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newModelName, setNewModelName] = useState("");

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const onlineModels = await getOnlineModels();
        if (isMounted && onlineModels) {
          setOnline(onlineModels);
        }
      } catch (error) {
        if (isMounted) console.error("Error fetching video data:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleAddModel = async () => {
    if (newModelName.trim()) {
      try {
        await add(newModelName.trim());
        setNewModelName("");
        setShowAddModal(false);
      } catch (err) {
        alert("Failed to add model to database.");
      }
    }
  };

  return (
    <div className="p-6 min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg
          className="absolute top-1/4 left-1/4 w-96 h-96 opacity-40 animate-spin-slow"
          viewBox="0 0 400 400"
          fill="none"
        >
          <circle
            cx="200"
            cy="200"
            r="160"
            stroke="url(#gold)"
            strokeWidth="12"
            strokeDasharray="20 24"
          />
          <defs>
            <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#FFD700" />
              <stop offset="1" stopColor="#00FFD0" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute w-96 h-96 bg-emerald-400/20 rounded-full -top-48 -left-48 blur-3xl mix-blend-screen" />
        <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full -bottom-48 -right-48 blur-3xl mix-blend-screen" />
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-emerald-400/10 to-cyan-400/10 opacity-30" />
      </div>
      <Sidebar />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute w-96 h-96 bg-emerald-500/20 rounded-full -top-48 -left-48 mix-blend-screen" />
        <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full -bottom-48 -right-48 mix-blend-screen" />
      </div>
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 relative z-10">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-video bg-slate-800/50 rounded-xl animate-pulse">
              <div className="h-full w-full bg-slate-700/30 rounded-xl" />
            </div>
          ))}
        </div>
      ) : online.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 relative z-10">
          {online.map((model) => (
            <OnlineModelCard key={model.name} model={model} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 relative z-10">
          <div className="inline-block bg-white/10 backdrop-blur-xl p-10 rounded-2xl border-2 border-gradient-to-r from-yellow-400 via-emerald-400 to-cyan-400 shadow-xl">
            <div className="text-7xl mb-4 animate-bounce">🌌</div>
            <h3 className="text-2xl font-extrabold text-transparent bg-gradient-to-r from-yellow-400 via-emerald-400 to-cyan-400 bg-clip-text drop-shadow-lg mb-2">
              No Broadcasts Currently Live
            </h3>
            <p className="text-slate-200 max-w-md mx-auto font-mono">
              Our elite performers are preparing their next show.<br />Check back soon for exclusive live experiences.
            </p>
          </div>
        </div>
      )}
      {/* Floating Add Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed z-30 bottom-8 right-8 bg-gradient-to-tr from-cyan-400 via-emerald-400 to-yellow-400 text-white p-0.5 rounded-full shadow-2xl hover:scale-110 transition-transform duration-200 ring-2 ring-white/30 focus:outline-none"
        title="Add New Pinned Model"
        style={{ minWidth: 0 }}
      >
        <span className="flex items-center justify-center w-16 h-16 bg-slate-900 rounded-full text-4xl font-extrabold">
          +
        </span>
      </button>
      {/* Modal for adding a new model */}
// ...
      <AddModelModal
        show={showAddModal}
        onAdd={handleAddModel}
        onCancel={() => {
          setShowAddModal(false);
          setNewModelName("");
        }}
        newModelName={newModelName}
        setNewModelName={setNewModelName}
      />
    </div>
  );
};

export default OnlineTab;
