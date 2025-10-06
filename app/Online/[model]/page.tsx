"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import { useSidebar } from "../../components/ui/SidebarContext";
import { useToast } from "../../components/ui/ToastContext";

const OnlineModelPage = () => {
  const params = useParams();
  const modelParam = useMemo(() => {
    const raw = (params as Record<string, string | string[]> | null)?.model;
    return Array.isArray(raw) ? raw[0] : raw;
  }, [params]);

  const { isOpen } = useSidebar();
  const { addToast } = useToast();

  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editMode, setEditMode] = useState(false);
  const [cmBusy, setCmBusy] = useState(false);
  const [cmName, setCmName] = useState("");
  const [cmModelId, setCmModelId] = useState("");
  const [cmHasContent, setCmHasContent] = useState(false);
  const [cmStatus, setCmStatus] = useState<"approved" | "rejected" | "pending" | "waiting">("pending");

  const name = useMemo(() => (modelParam ? decodeURIComponent(modelParam) : ""), [modelParam]);

  const reload = async () => {
    if (!name) return;
    try {
      const r = await fetch(`/api/model/data/${encodeURIComponent(name)}`);
      if (!r.ok) throw new Error("Failed to load model data");
      const j = await r.json();
      const modelData = j?.modelData || null;
      setData(modelData);
      const cm = Array.isArray(modelData?.checkedModel) ? modelData.checkedModel[0] : null;
      if (cm) {
        setCmName(cm.name || name);
        setCmModelId(cm.modelId != null ? String(cm.modelId) : "");
        setCmHasContent(Boolean(cm.hasContent));
        setCmStatus((cm.status as any) || "pending");
      } else {
        setCmName(name);
        setCmModelId("");
        setCmHasContent(false);
        setCmStatus("pending");
      }
    } catch (e: any) {
      setError(e?.message || "Failed to load model data");
    }
  };

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
        const cmArr = Array.isArray(modelData?.checkedModel) ? modelData.checkedModel : [];
        const cm = cmArr[0] || null;
        if (cm) {
          setCmName(cm.name || name);
          setCmModelId(cm.modelId != null ? String(cm.modelId) : "");
          setCmHasContent(Boolean(cm.hasContent));
          setCmStatus((cm.status as any) || "pending");
        } else {
          try {
            await fetch(`/api/checked-models`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: decodeURIComponent(modelParam), hasContent: false, status: "pending" })
            });
          } catch {}
          setCmName(name);
          setCmModelId("");
          setCmHasContent(false);
          setCmStatus("pending");
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
    return () => { active = false; };
  }, [modelParam, name]);

  const checks = useMemo(() => (Array.isArray((data as any)?.checkedModel) ? (data as any).checkedModel.length : 0), [data]);
  const checkedModel = useMemo(() => (Array.isArray((data as any)?.checkedModel) ? (data as any).checkedModel[0] : null), [data]);

  const saveCheckedModel = async () => {
    try {
      setCmBusy(true);
      const payload: any = { name: cmName.trim(), hasContent: cmHasContent, status: cmStatus };
      if (cmModelId.trim() !== "") payload.modelId = Number(cmModelId);
      const url = checkedModel ? `/api/checked-models/${checkedModel.id}` : "/api/checked-models";
      const method = checkedModel ? "PUT" : "POST";
      const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!r.ok) throw new Error("Save failed");
      addToast("Saved", "success");
      await reload();
      setEditMode(false);
    } catch (_e) {
      addToast("Save failed", "error");
    } finally {
      setCmBusy(false);
    }
  };

  const deleteCheckedModel = async () => {
    if (!checkedModel) return;
    if (!confirm("Delete this checked model?")) return;
    try {
      setCmBusy(true);
      const r = await fetch(`/api/checked-models/${checkedModel.id}`, { method: "DELETE" });
      if (!r.ok) throw new Error("delete failed");
      addToast("Deleted", "success");
      await reload();
      setEditMode(false);
    } catch (_e) {
      addToast("Delete failed", "error");
    } finally {
      setCmBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <main className={`py-6 transition-[margin] duration-300 ${isOpen ? "md:ml-64" : "ml-0"}`}>
        <div className="w-full px-[5px]">
          <header className="mb-4 flex items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold truncate" title={name}>{name}</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditMode((v) => !v)}
                className="px-3 py-2 text-sm rounded bg-indigo-600 hover:bg-indigo-500"
              >
                {checkedModel ? (editMode ? "Cancel" : "Edit CheckedModel") : (editMode ? "Cancel" : "Create CheckedModel")}
              </button>
            </div>
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
              ) : (
                <div className="space-y-3">
                  <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
                    <h2 className="font-semibold mb-3">Info</h2>
                    <ul className="space-y-1 text-sm">
                      <li><span className="text-slate-500">ID:</span> {(data as any)?.model?.id ?? "-"}</li>
                      <li><span className="text-slate-500">Checks:</span> {checks}</li>
                      <li><span className="text-slate-500">Status:</span> {checkedModel ? String(checkedModel.status ?? "pending") : "-"}</li>
                      <li><span className="text-slate-500">Created at:</span> {((data as any)?.model?.created_at ? new Date((data as any).model.created_at).toLocaleString() : "-")}</li>
                      <li><span className="text-slate-500">Started at:</span> {((data as any)?.model?.startedAt ? new Date((data as any).model.startedAt).toLocaleString() : "-")}</li>
                      <li><span className="text-slate-500">Online:</span> {((data as any)?.model?.isOnline === true ? "Yes" : ((data as any)?.model?.isOnline === false ? "No" : "-"))}</li>
                      <li><span className="text-slate-500">Tags:</span> {Array.isArray((data as any)?.model?.tags) ? (data as any).model.tags.join(", ") : ((data as any)?.model?.tags || "-")}</li>
                      <li><span className="text-slate-500">Video tags:</span> {Array.isArray((data as any)?.model?.videoTags) ? (data as any).model.videoTags.join(", ") : ((data as any)?.model?.videoTags || "-")}</li>
                    </ul>
                  </div>

                  {editMode && (
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="font-semibold">CheckedModel</h2>
                        <div className="flex items-center gap-2">
                          {checkedModel && (
                            <button onClick={deleteCheckedModel} disabled={cmBusy} className="px-3 py-1.5 text-sm rounded bg-red-500/20 hover:bg-red-500/30">Delete</button>
                          )}
                          <button onClick={saveCheckedModel} disabled={cmBusy} className="px-3 py-1.5 text-sm rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50">
                            {cmBusy ? "Saving..." : checkedModel ? "Save" : "Create"}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm mb-1">Name</label>
                          <input value={cmName} onChange={(e) => setCmName(e.target.value)} className="w-full bg-white/70 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-md px-3 py-2 text-sm" />
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Model ID</label>
                          <input value={cmModelId} onChange={(e) => setCmModelId(e.target.value)} inputMode="numeric" className="w-full bg-white/70 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-md px-3 py-2 text-sm" />
                        </div>
                        <div className="flex items-center gap-2 mt-6 md:mt-0">
                          <input id="cm-has" type="checkbox" checked={cmHasContent} onChange={(e) => setCmHasContent(e.target.checked)} />
                          <label htmlFor="cm-has" className="text-sm">Has content</label>
                        </div>
                        <div>
                          <label className="block text-sm mb-1">Status</label>
                          <select value={cmStatus} onChange={(e) => setCmStatus(e.target.value as any)} className="w-full bg-white/70 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-md px-3 py-2 text-sm text-slate-900 dark:text-white">
                            <option value="approved">approved</option>
                            <option value="rejected">rejected</option>
                            <option value="pending">pending</option>
                            <option value="waiting">waiting</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </aside>
          </section>
        </div>
      </main>
    </div>
  );
};

export default OnlineModelPage;
