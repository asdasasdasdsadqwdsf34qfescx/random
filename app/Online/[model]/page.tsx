"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import { useSidebar } from "../../components/ui/SidebarContext";

const OnlineModelPage = () => {
  const params = useParams();
  const modelParam = useMemo(() => {
    const raw = (params as Record<string, string | string[]> | null)?.model;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params]);

  const { isOpen } = useSidebar();
  const [data, setData] = useState<any | null>(null);
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
          const parsed = JSON.parse(raw) as any & { ts?: number };
          setData((prev) => ({ ...(prev || {}), ...(parsed as any) }));
        }
      } catch {}
    };

    const run = async () => {
      if (!modelParam) return;
      setLoading(true);
      setError(null);
      try {
        const r = await fetch(`/api/model/data/${encodeURIComponent(decodeURIComponent(modelParam))}`);
        if (!active) return;
        if (!r.ok) throw new Error("Failed to load model data");
        const j = await r.json();
        const modelData = j?.modelData || null;
        setData(modelData);
        const cm = Array.isArray(modelData?.checkedModel) ? modelData.checkedModel : [];
        if (!cm || cm.length === 0) {
          try {
            await fetch(`/api/checked-models`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: decodeURIComponent(modelParam), hasContent: false, status: "pending" })
            });
          } catch {}
        }
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
  const checks = useMemo(() => (Array.isArray((data as any)?.checkedModel) ? (data as any).checkedModel.length : 0), [data]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <main className={`py-6 transition-[margin] duration-300 ${isOpen ? "md:ml-64" : "ml-0"}`}>
        <div className="w-full px-[5px]">
          <header className="mb-4">
            <h1 className="text-2xl font-semibold truncate" title={name}>{name}</h1>
          </header>

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
              ) : error ? (
                <div className="text-sm text-red-600">{error}</div>
              ) : data ? (
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
                  <h2 className="font-semibold mb-3">Info</h2>
                  <ul className="space-y-1 text-sm">
                    <li><span className="text-slate-500">ID:</span> {(data as any)?.model?.id ?? "-"}</li>
                    <li><span className="text-slate-500">Checks:</span> {checks}</li>
                    <li><span className="text-slate-500">Created at:</span> {((data as any)?.model?.created_at ? new Date((data as any).model.created_at).toLocaleString() : "-")}</li>
                    <li><span className="text-slate-500">Started at:</span> {((data as any)?.model?.startedAt ? new Date((data as any).model.startedAt).toLocaleString() : "-")}</li>
                    <li><span className="text-slate-500">Online:</span> {((data as any)?.model?.isOnline === true ? "Yes" : ((data as any)?.model?.isOnline === false ? "No" : "-"))}</li>
                    <li><span className="text-slate-500">Tags:</span> {Array.isArray((data as any)?.model?.tags) ? (data as any).model.tags.join(", ") : ((data as any)?.model?.tags || "-")}</li>
                    <li><span className="text-slate-500">Video tags:</span> {Array.isArray((data as any)?.model?.videoTags) ? (data as any).model.videoTags.join(", ") : ((data as any)?.model?.videoTags || "-")}</li>
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
