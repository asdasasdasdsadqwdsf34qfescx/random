"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import { useSidebar } from "@/app/components/ui/SidebarContext";
import { ModelCard } from "@/app/components/shared/ModelCard";
import { LoadingSpinner } from "@/app/components/shared/LoadingSpinner";
import { EmptyState } from "@/app/components/shared/EmptyState";

const ModelsPage = () => {
  const router = useRouter();
  const { isOpen } = useSidebar();

  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [tagsByName, setTagsByName] = useState<Record<string, string[]>>({});
  const [checkedByName, setCheckedByName] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/images/photos");
        if (!res.ok) throw new Error("Could not load photos");
        const data = await res.json();
        setPhotos(Array.isArray(data.images) ? data.images : []);
      } catch (_) {
        setPhotos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, []);

  useEffect(() => {
    const fetchCheckedAndTags = async () => {
      try {
        // Prefer batch data for efficiency
        const r = await fetch("/api/model/data");
        if (r.ok) {
          const j = await r.json();
          const items: any[] = Array.isArray(j?.items) ? j.items : [];
          const nextChecked: Record<string, boolean> = {};
          const nextTags: Record<string, string[]> = {};
          for (const it of items) {
            const name: string = String(it?.name || it?.modelData?.model?.name || "");
            if (!name) continue;
            const lower = name.toLowerCase();
            const cm = Array.isArray(it?.modelData?.checkedModel) ? it.modelData.checkedModel : [];
            nextChecked[name] = cm.length > 0;
            const tags: string[] = [
              ...((it?.modelData?.model?.tags || []) as string[]),
              ...((it?.modelData?.model?.videoTags || []) as string[]),
            ].filter((s) => typeof s === "string");
            if (tags.length) nextTags[name] = Array.from(new Set(tags));
          }
          setCheckedByName(nextChecked);
          setTagsByName(nextTags);
          return;
        }
      } catch {}

      // Fallback: minimal checked flag via /api/checked-models
      try {
        const r2 = await fetch("/api/checked-models");
        if (!r2.ok) return;
        const j2 = await r2.json();
        const next: Record<string, boolean> = {};
        (Array.isArray(j2) ? j2 : []).forEach((it: any) => {
          if (it?.name) next[String(it.name).replace(/\.[^.]+$/, "")] = true;
        });
        setCheckedByName(next);
      } catch {}
    };
    fetchCheckedAndTags();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const arr = photos.slice().sort((a, b) => a.localeCompare(b));
    if (!q) return arr;
    return arr.filter((p) => p.replace(/\.[^.]+$/, "").toLowerCase().includes(q));
  }, [photos, search]);


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <main className={`py-6 transition-[margin] duration-300 ${isOpen ? "md:ml-64" : "ml-0"}`}>
        <div className="w-full px-4 md:px-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Models</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Choose a model to see all videos.</p>
            </div>
            <div className="w-full sm:w-72">
              <label htmlFor="model-search" className="sr-only">Search model</label>
              <input
                id="model-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search model..."
                className="w-full bg-white/70 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-md px-3 py-2 text-sm placeholder:text-slate-400 dark:placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="mt-6">
            {loading ? (
              <LoadingSpinner />
            ) : filtered.length === 0 ? (
              <EmptyState message="No models found" />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
                {filtered.map((photo) => {
                  const name = photo.replace(/\.[^.]+$/, "");
                  const tags = tagsByName[name] || [];
                  const checked = !!checkedByName[name];
                  return (
                    <ModelCard
                      key={photo}
                      photo={photo}
                      basePath="photos"
                      tags={tags}
                      checked={checked}
                      onPhotoClick={() => router.push(`/model/${encodeURIComponent(name)}`)}
                      onMiddleClick={() => window.open(`/model/${encodeURIComponent(name)}`, "_blank")}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ModelsPage;
