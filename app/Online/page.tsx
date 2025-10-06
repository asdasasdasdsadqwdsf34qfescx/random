"use client";

import { useState, useEffect, useMemo, useRef, memo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "../components/Sidebar";
import { useSidebar } from "../components/ui/SidebarContext";
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

  const handleOpen = () => {
    try {
      const snapshot = {
        id: (model as any)?.id,
        created_at: (model as any)?.created_at ?? (model as any)?.createdAt,
        name: model.name,
        isOnline: (model as any)?.isOnline,
        imageUrl: (model as any)?.imageUrl,
        startedAt: (model as any)?.startedAt,
        videoTags: (model as any)?.videoTags ?? null,
        tags: (model as any)?.tags ?? null,
        ts: Date.now()
      };
      localStorage.setItem(`modelSnapshot:${model.name}`, JSON.stringify(snapshot));
    } catch {}
  };

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
      </div>
      <div className="p-3 flex items-center justify-between gap-2">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate" title={model.name}>{model.name}</h3>
        <Link
          href={`/Online/${encodeURIComponent(model.name)}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleOpen}
          className="shrink-0 px-2 py-1 rounded-md text-sm bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
          aria-label={`Open ${model.name} in new tab`}
        >
          Open
        </Link>
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
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { isOpen } = useSidebar();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newModelName, setNewModelName] = useState("");
  const [onlyPinned, setOnlyPinned] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  useEffect(() => {
    const initialPinned = searchParams?.get?.("pinned");
    if (initialPinned !== null) {
      const p = initialPinned === "true" || initialPinned === "1";
      setOnlyPinned(p);
    }
    const s = searchParams?.get?.("status");
    setStatus(s || undefined);
    const pStr = searchParams?.get?.("page");
    const lStr = searchParams?.get?.("limit");
    const pNum = pStr ? parseInt(pStr, 10) : NaN;
    const lNum = lStr ? parseInt(lStr, 10) : NaN;
    if (!Number.isNaN(pNum) && pNum > 0) setPage(pNum);
    if (!Number.isNaN(lNum) && lNum > 0) setLimit(lNum);
  }, [searchParams]);

  const fetchData = async () => {
    try {
      setError(null);
      const onlineModels = await getOnlineModels({ pinned: onlyPinned, status, page, limit });
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
  }, [onlyPinned, status, page, limit]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = online;
    if (q) list = list.filter((m) => m.name.toLowerCase().includes(q));
    return list;
  }, [online, query]);

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
      <main className={`py-6 transition-[margin] duration-300 ${isOpen ? "md:ml-64" : "ml-0"}`}>
        <div className="w-full px-[5px]">
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
              <label className="flex items-center gap-2 text-sm px-2 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800">
                <input
                  type="checkbox"
                  checked={onlyPinned}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setOnlyPinned(checked);
                    const params = new URLSearchParams(searchParams?.toString?.() || "");
                    if (checked) params.set("pinned", "true"); else params.delete("pinned");
                    const qs = params.toString();
                    router.replace(qs ? `?${qs}` : "?", { scroll: false });
                  }}
                />
                Favorite
              </label>
              <select
                value={status ?? ""}
                onChange={(e) => {
                  const v = e.target.value || undefined;
                  setStatus(v);
                  const params = new URLSearchParams(searchParams?.toString?.() || "");
                  if (v) params.set("status", v); else params.delete("status");
                  const qs = params.toString();
                  router.replace(qs ? `?${qs}` : "?", { scroll: false });
                }}
                className="px-2 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              >
                <option value="">All</option>
                <option value="approved">approved</option>
                <option value="rejected">rejected</option>
                <option value="pending">pending</option>
                <option value="waiting">waiting</option>
              </select>
              <select
                value={String(limit)}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  const nextLimit = Number.isNaN(v) || v <= 0 ? 20 : v;
                  setLimit(nextLimit);
                  setPage(1);
                  const params = new URLSearchParams(searchParams?.toString?.() || "");
                  params.set("limit", String(nextLimit));
                  params.set("page", "1");
                  const qs = params.toString();
                  router.replace(qs ? `?${qs}` : "?", { scroll: false });
                }}
                className="px-2 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="50">50</option>
              </select>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-3 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-500"
              >
                Add model
              </button>
            </div>
          </div>
        </header>

        {error && (
          <div className="mb-4 p-3 rounded-md border border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/40">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-video rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <section aria-label="Online models grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((model) => (
              <OnlineModelCard key={model.name} model={model} />
            ))}
          </section>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-500">No live broadcasts right now. Please check back soon.</p>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => {
              if (page <= 1) return;
              const next = page - 1;
              setPage(next);
              const params = new URLSearchParams(searchParams?.toString?.() || "");
              params.set("page", String(next));
              const qs = params.toString();
              router.replace(qs ? `?${qs}` : "?", { scroll: false });
            }}
            disabled={page <= 1}
            className="px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 disabled:opacity-50"
          >
            Previous
          </button>
          <div className="text-sm text-slate-500">Page {page}</div>
          <button
            onClick={() => {
              if (online.length < limit) return;
              const next = page + 1;
              setPage(next);
              const params = new URLSearchParams(searchParams?.toString?.() || "");
              params.set("page", String(next));
              const qs = params.toString();
              router.replace(qs ? `?${qs}` : "?", { scroll: false });
            }}
            disabled={online.length < limit}
            className="px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        </div>
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
