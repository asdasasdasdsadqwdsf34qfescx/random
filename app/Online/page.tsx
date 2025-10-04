"use client";

import { useState, useEffect, useMemo, useRef, memo } from "react";
import Sidebar from "../components/Sidebar";
import { VideoModel } from "@/app/types";
import { add, getOnlineModels } from "../ids";

// Add model modal
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
    if (show && inputRef.current) inputRef.current.focus();
  }, [show]);
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold mb-4">Add pinned model</h2>
        <div className="space-y-4">
          <input
            ref={inputRef}
            type="text"
            placeholder="Model name"
            value={newModelName}
            onChange={(e) => setNewModelName(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          />
          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={onAdd}
              disabled={!newModelName.trim()}
              className="px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const OnlineModelCard = memo(({ model }: { model: VideoModel }) => {
  const [showVideo, setShowVideo] = useState(false);
  return (
    <article
      className="group relative rounded-xl overflow-hidden bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all"
      onMouseEnter={() => setShowVideo(true)}
      onMouseLeave={() => setShowVideo(false)}
    >
      <div className="aspect-video relative">
        {showVideo ? (
          <iframe
            src={`https://chaturbate.com/embed/${model.name}/?join_overlay=1&campaign=GeOP2&embed_video_only=1&disable_sound=1&tour=9oGW&mobileRedirect=never&disable_autoplay=1`}
            className="w-full h-full"
            frameBorder="0"
            scrolling="no"
            allowFullScreen
            title={`${model.name} Live Cam`}
            loading="lazy"
          />
        ) : (
          <img
            src={model.imageUrl || "/vercel.svg"}
            alt={model.name}
            className="w-full h-full object-cover"
          />
        )}
        <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-green-600 text-white">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Live
        </span>
      </div>
      <div className="p-3 flex items-center justify-between gap-3">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate" title={model.name}>{model.name}</h3>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
            ⭐ {Math.round((model.averageRating ?? 0) * 10) / 10}
          </span>
          {typeof model.onlineCount === "number" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
              👤 {model.onlineCount}
            </span>
          )}
        </div>
      </div>
    </article>
  );
});
OnlineModelCard.displayName = "OnlineModelCard";

const OnlinePage = () => {
  const [online, setOnline] = useState<VideoModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name-asc" | "name-desc" | "rating-desc" | "rating-asc">("rating-desc");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newModelName, setNewModelName] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      const onlineModels = await getOnlineModels();
      if (Array.isArray(onlineModels)) {
        setOnline(onlineModels);
        setLastUpdated(new Date());
      } else {
        setOnline([]);
      }
    } catch (e: any) {
      setError(e?.message || "Failed to load online models");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      if (!mounted) return;
      await fetchData();
    };
    run();
    const id = setInterval(run, 5000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = online;
    if (q) list = list.filter((m) => m.name.toLowerCase().includes(q));
    switch (sortBy) {
      case "name-asc":
        return [...list].sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return [...list].sort((a, b) => b.name.localeCompare(a.name));
      case "rating-asc":
        return [...list].sort((a, b) => (a.averageRating ?? 0) - (b.averageRating ?? 0));
      case "rating-desc":
      default:
        return [...list].sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0));
    }
  }, [online, query, sortBy]);

  const handleAddModel = async () => {
    if (!newModelName.trim()) return;
    try {
      await add(newModelName.trim());
      setNewModelName("");
      setShowAddModal(false);
    } catch {
      alert("Failed to add model");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <main className="px-4 sm:px-6 lg:px-8 py-6 md:ml-64">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Online Models</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {isLoading ? "Loading…" : `${filtered.length} online`} {lastUpdated && `• Updated ${lastUpdated.toLocaleTimeString()}`}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <div className="flex items-center gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name…"
                className="w-56 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                aria-label="Sort by"
              >
                <option value="rating-desc">Top rated</option>
                <option value="rating-asc">Lowest rated</option>
                <option value="name-asc">Name A–Z</option>
                <option value="name-desc">Name Z–A</option>
              </select>
              <button
                onClick={fetchData}
                className="px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                aria-label="Refresh"
                title="Refresh"
              >
                Refresh
              </button>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-500"
            >
              Add pinned
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-4 p-3 rounded-md border border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/40">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-video rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <section aria-label="Online models grid" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((model) => (
              <OnlineModelCard key={model.name} model={model} />
            ))}
          </section>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-500">No live broadcasts right now. Please check back soon.</p>
          </div>
        )}
      </main>

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

export default OnlinePage;
