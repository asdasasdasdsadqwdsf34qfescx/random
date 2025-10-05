"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import { useSidebar } from "@/app/components/ui/SidebarContext";
import { ModelCard } from "@/app/components/shared/ModelCard";
import { LoadingSpinner } from "@/app/components/shared/LoadingSpinner";
import { EmptyState } from "@/app/components/shared/EmptyState";
import { ALLOWED_TAGS, ALLOWED_VIDEO_TAGS } from "@/app/constants/tags";

const ModelsPage = () => {
  const router = useRouter();
  const { isOpen } = useSidebar();

  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>("");
  const [tagsByName, setTagsByName] = useState<Record<string, string[]>>({});
  const [checkedByName, setCheckedByName] = useState<Record<string, boolean>>({});

  // filters
  const [selectedVideoTags, setSelectedVideoTags] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [onlineOnly, setOnlineOnly] = useState<boolean>(false);
  const [selectVideoTag, setSelectVideoTag] = useState<string>("");
  const [selectTag, setSelectTag] = useState<string>("");
  const [itemsByName, setItemsByName] = useState<Record<string, any>>({});

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
        const qs = new URLSearchParams();
        if (selectedVideoTags.length) qs.set("videoTags", selectedVideoTags.join(","));
        if (selectedTags.length) qs.set("tags", selectedTags.join(","));
        if (onlineOnly) qs.set("isOnline", "true");
        const r = await fetch(`/api/model/data${qs.toString() ? `?${qs.toString()}` : ""}`);
        if (r.ok) {
          const j = await r.json();
          const items: any[] = Array.isArray(j?.items) ? j.items : [];
          const nextChecked: Record<string, boolean> = {};
          const nextTags: Record<string, string[]> = {};
          const nextItems: Record<string, any> = {};
          for (const it of items) {
            const name: string = String(it?.name || it?.modelData?.model?.name || "");
            if (!name) continue;
            const cm = Array.isArray(it?.modelData?.checkedModel) ? it.modelData.checkedModel : [];
            nextChecked[name] = cm.length > 0;
            const model = it?.modelData?.model || {};
            const tagsArr: string[] = [
              ...((model?.tags || []) as string[]),
              ...((model?.videoTags || []) as string[]),
            ].filter((s) => typeof s === "string");
            if (tagsArr.length) nextTags[name] = Array.from(new Set(tagsArr));
            nextItems[name] = model;
          }
          setCheckedByName(nextChecked);
          setTagsByName(nextTags);
          setItemsByName(nextItems);
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
  }, [selectedVideoTags, selectedTags, onlineOnly]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const namesAllowed = new Set(Object.keys(itemsByName));
    const arr = photos
      .filter((p) => {
        const name = p.replace(/\.[^.]+$/, "");
        if (selectedVideoTags.length || selectedTags.length || onlineOnly) {
          return namesAllowed.has(name);
        }
        return true;
      })
      .slice()
      .sort((a, b) => a.localeCompare(b));
    if (!q) return arr;
    return arr.filter((p) => p.replace(/\.[^.]+$/, "").toLowerCase().includes(q));
  }, [photos, search, itemsByName, selectedVideoTags, selectedTags, onlineOnly]);


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

          { (selectedVideoTags.length > 0 || selectedTags.length > 0 || onlineOnly) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {selectedVideoTags.map((t) => (
                <span key={`vt-${t}`} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 text-xs">
                  video:{t}
                  <button className="opacity-60 hover:opacity-100" onClick={() => setSelectedVideoTags(selectedVideoTags.filter((x) => x !== t))}>×</button>
                </span>
              ))}
              {selectedTags.map((t) => (
                <span key={`tg-${t}`} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 text-xs">
                  tag:{t}
                  <button className="opacity-60 hover:opacity-100" onClick={() => setSelectedTags(selectedTags.filter((x) => x !== t))}>×</button>
                </span>
              ))}
              {onlineOnly && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-900/40 text-xs text-emerald-700 dark:text-emerald-300">
                  Online only
                  <button className="opacity-60 hover:opacity-100" onClick={() => setOnlineOnly(false)}>×</button>
                </span>
              )}
              {(selectedVideoTags.length > 0 || selectedTags.length > 0 || onlineOnly) && (
                <button className="text-xs underline" onClick={() => { setSelectedVideoTags([]); setSelectedTags([]); setOnlineOnly(false); }}>Clear all</button>
              )}
            </div>
          )}
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
