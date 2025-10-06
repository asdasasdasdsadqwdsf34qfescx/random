"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import { useSidebar } from "../../components/ui/SidebarContext";
import { VideoModel } from "@/app/types";
import { getModelById } from "@/app/ids";

const OnlineModelPage = () => {
  const params = useParams();
  const modelParam = useMemo(() => {
    const raw = (params as Record<string, string | string[]> | null)?.model;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params]);

  const { isOpen } = useSidebar();
  const [data, setData] = useState<VideoModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const hydrateFromSnapshot = () => {
      if (!modelParam) return;
      try {
        const key = `modelSnapshot:${decodeURIComponent(modelParam)}`;
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<VideoModel> & { ts?: number };
          setData((prev) => ({ ...(prev || {}), ...(parsed as VideoModel) }));
        }
      } catch {}
    };

    const run = async () => {
      if (!modelParam) return;
      setLoading(true);
      setError(null);
      try {
        const res = await getModelById({ name: decodeURIComponent(modelParam) });
        if (!active) return;
        setData(res ?? null);
      } catch (e: any) {
        if (!active) return;
        setError(e?.message || "Failed to load model");
      } finally {
        if (active) setLoading(false);
      }
    };

    hydrateFromSnapshot();
    run();
    return () => {
      active = false;
    };
  }, [modelParam]);

  const name = useMemo(() => (modelParam ? decodeURIComponent(modelParam) : ""), [modelParam]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <main className={`py-6 transition-[margin] duration-300 ${isOpen ? "md:ml-64" : "ml-0"}`}>
        <div className="w-full px-[5px]">
          <header className="mb-4">
            <h1 className="text-2xl font-semibold truncate" title={name}>{name}</h1>
            {data && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {data.videoCount ?? 0} videos • Rating {Number(data.averageRating ?? 0).toFixed(2)} • Online {data.onlineCount ?? 0}
              </p>
            )}
          </header>

          {error && (
            <div className="mb-4 p-3 rounded-md border border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/40">{error}</div>
          )}

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
            <div className="lg:col-span-2">
              <div className="relative w-full bg-black rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <iframe
                  src={`https://chaturbate.com/embed/${encodeURIComponent(name)}/?join_overlay=1&campaign=GeOP2&embed_video_only=1&tour=9oGW&mobileRedirect=never&disable_autoplay=1`}
                  className="w-full aspect-video md:h-[70vh]"
                  frameBorder="0"
                  scrolling="no"
                  allowFullScreen
                  title={`${name} Live Cam`}
                  loading="lazy"
                />
              </div>
            </div>

            <aside className="lg:col-span-1 space-y-3">
              {loading ? (
                <div className="h-40 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
              ) : data ? (
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
                  <h2 className="font-semibold mb-3">Details</h2>
                  <ul className="space-y-1 text-sm">
                    <li><span className="text-slate-500">Average rating:</span> {Number(data.averageRating ?? 0).toFixed(2)}</li>
                    <li><span className="text-slate-500">Videos:</span> {data.videoCount ?? 0}</li>
                    <li><span className="text-slate-500">Online count:</span> {data.onlineCount ?? 0}</li>
                    <li><span className="text-slate-500">Body:</span> {data.body ?? 0}</li>
                    <li><span className="text-slate-500">Hair:</span> {data.hair ?? 0}</li>
                    <li><span className="text-slate-500">Legs:</span> {data.legs ?? 0}</li>
                    <li><span className="text-slate-500">Pussy:</span> {data.pussy ?? 0}</li>
                  </ul>
                </div>
              ) : (
                <div className="text-slate-500">No data available.</div>
              )}
            </aside>
          </section>
        </div>
      </main>
    </div>
  );
};

export default OnlineModelPage;
