"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import { useSidebar } from "@/app/components/ui/SidebarContext";
import { useToast } from "@/app/components/ui/ToastContext";
import { VideoPlayer } from "@/app/components/shared/VideoPlayer";

type Model = {
  id: number;
  created_at?: string;
  name: string;
  isOnline?: boolean;
  imageUrl?: string | null;
  startedAt?: string | null;
  videoTags?: string[] | null;
  tags?: string[] | null;
};

type ModelName = { id: number; created_at?: string; name: string; modelId: number };

type CheckedModel = { id: number; created_at?: string; name: string; hasContent: boolean; modelId?: number };

type ModelDataResponse = {
  exists: boolean;
  modelData?: {
    model: Model;
    modelNames: ModelName[];
    checkedModel: CheckedModel[];
    modelNamesData?: ModelName[];
    totalVideoCount?: number;
    isOnline?: boolean;
  };
};

const arrayFrom = (v: any): string[] => Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];

export default function ModelDetailPage() {
  const { isOpen } = useSidebar();
  const { addToast } = useToast();
  const router = useRouter();
  const params = useParams();
  const name = (params?.name as string) || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ModelDataResponse | null>(null);

  const [videos, setVideos] = useState<string[]>([]);
  const [vidLoading, setVidLoading] = useState(true);

  const [savingModel, setSavingModel] = useState(false);

  // Editable model fields
  const model: Model | undefined = data?.modelData?.model;
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [startedAt, setStartedAt] = useState<string>("");
  const [videoTags, setVideoTags] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [newVideoTag, setNewVideoTag] = useState("");
  const [newTag, setNewTag] = useState("");

  const modelNames: ModelName[] = useMemo(() => data?.modelData?.modelNames || data?.modelData?.modelNamesData || [], [data]);
  const checkedModel: CheckedModel | undefined = useMemo(() => (data?.modelData?.checkedModel || [])[0], [data]);

  useEffect(() => {
    const run = async () => {
      if (!name) return;
      setLoading(true);
      setError(null);
      try {
        const r = await fetch(`/api/model/data/${encodeURIComponent(name)}`);
        if (!r.ok) throw new Error("Failed to load model data");
        const j = (await r.json()) as ModelDataResponse;
        setData(j);
        const m = j?.modelData?.model;
        setIsOnline(!!m?.isOnline);
        setImageUrl((m?.imageUrl as any) || "");
        setStartedAt(m?.startedAt ? toLocalDateTime(m.startedAt) : "");
        setVideoTags(arrayFrom(m?.videoTags));
        setTags(arrayFrom(m?.tags));
      } catch (e: any) {
        setError(e?.message || "Error");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [name]);

  useEffect(() => {
    const run = async () => {
      if (!name) return;
      setVidLoading(true);
      try {
        const r = await fetch(`/api/videos?name=${encodeURIComponent(name)}`);
        if (!r.ok) throw new Error("Failed to load videos");
        const j = await r.json();
        setVideos(j?.videos || []);
      } catch (_e) {
        setVideos([]);
      } finally {
        setVidLoading(false);
      }
    };
    run();
  }, [name]);

  const saveModel = async () => {
    if (!model?.id) return;
    try {
      setSavingModel(true);
      const payload: any = {
        isOnline,
        imageUrl: imageUrl.trim() || null,
        startedAt: startedAt ? new Date(startedAt).toISOString() : null,
        videoTags,
        tags,
      };
      const r = await fetch(`/api/models/${model.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!r.ok) throw new Error("Save failed");
      addToast("Model updated", "success");
    } catch (_e) {
      addToast("Could not save model", "error");
    } finally {
      setSavingModel(false);
    }
  };

  // Names CRUD
  const [newName, setNewName] = useState("");
  const [editNameId, setEditNameId] = useState<number | null>(null);
  const [editNameVal, setEditNameVal] = useState("");
  const [nameBusy, setNameBusy] = useState<Record<string, boolean>>({});

  const addModelName = async () => {
    const val = newName.trim();
    if (!val || !checkedModel?.id) return;
    try {
      setNameBusy((b) => ({ ...b, add: true }));
      const r = await fetch(`/api/model-names`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: val, modelId: checkedModel.id }) });
      if (!r.ok) throw new Error("add failed");
      setNewName("");
      // Reload data
      await reload();
    } catch (_e) {
      addToast("Could not add name", "error");
    } finally {
      setNameBusy((b) => ({ ...b, add: false }));
    }
  };
  const startEditModelName = (n: ModelName) => { setEditNameId(n.id); setEditNameVal(n.name); };
  const cancelEditModelName = () => { setEditNameId(null); setEditNameVal(""); };
  const saveModelName = async (id: number) => {
    try {
      setNameBusy((b) => ({ ...b, [id]: true }));
      const r = await fetch(`/api/model-names/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: editNameVal.trim() }) });
      if (!r.ok) throw new Error("edit failed");
      setEditNameId(null);
      setEditNameVal("");
      await reload();
    } catch (_e) {
      addToast("Could not save name", "error");
    } finally {
      setNameBusy((b) => ({ ...b, [id]: false }));
    }
  };
  const deleteModelName = async (id: number) => {
    if (!confirm("Delete this name?")) return;
    try {
      setNameBusy((b) => ({ ...b, [id]: true }));
      const r = await fetch(`/api/model-names/${id}`, { method: "DELETE" });
      if (!r.ok) throw new Error("delete failed");
      await reload();
    } catch (_e) {
      addToast("Could not delete name", "error");
    } finally {
      setNameBusy((b) => ({ ...b, [id]: false }));
    }
  };

  // Checked model CRUD
  const [cmBusy, setCmBusy] = useState(false);
  const [cmName, setCmName] = useState<string>("");
  const [cmHasContent, setCmHasContent] = useState<boolean>(false);
  const [cmModelId, setCmModelId] = useState<string>("");

  useEffect(() => {
    if (checkedModel) {
      setCmName(checkedModel.name || "");
      setCmHasContent(!!checkedModel.hasContent);
      setCmModelId(checkedModel.modelId != null ? String(checkedModel.modelId) : "");
    } else {
      setCmName(name);
      setCmHasContent(false);
      setCmModelId("");
    }
  }, [checkedModel, name]);

  const saveCheckedModel = async () => {
    try {
      setCmBusy(true);
      const payload: any = { name: cmName.trim(), hasContent: cmHasContent };
      if (cmModelId.trim() !== "") payload.modelId = Number(cmModelId);
      const url = checkedModel ? `/api/checked-models/${checkedModel.id}` : "/api/checked-models";
      const method = checkedModel ? "PUT" : "POST";
      const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!r.ok) throw new Error("save failed");
      addToast("Saved", "success");
      await reload();
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
    } catch (_e) {
      addToast("Delete failed", "error");
    } finally {
      setCmBusy(false);
    }
  };

  const reload = async () => {
    try {
      const [d, v] = await Promise.all([
        fetch(`/api/model/data/${encodeURIComponent(name)}`).then((r) => r.json()),
        fetch(`/api/videos?name=${encodeURIComponent(name)}`).then((r) => r.json())
      ]);
      setData(d);
      const m = d?.modelData?.model as Model | undefined;
      setIsOnline(!!m?.isOnline);
      setImageUrl((m?.imageUrl as any) || "");
      setStartedAt(m?.startedAt ? toLocalDateTime(m.startedAt) : "");
      setVideoTags(arrayFrom(m?.videoTags));
      setTags(arrayFrom(m?.tags));
      setVideos(v?.videos || []);
    } catch (_e) {}
  };

  const addArrayItem = (val: string, list: string[], setList: (v: string[]) => void) => {
    const v = val.trim();
    if (!v) return;
    if (list.includes(v)) return;
    setList([...list, v]);
  };
  const removeArrayItem = (idx: number, list: string[], setList: (v: string[]) => void) => {
    const next = [...list];
    next.splice(idx, 1);
    setList(next);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <main className={`py-6 transition-[margin] duration-300 ${isOpen ? "md:ml-64" : "ml-0"}`}>
        <div className="w-full px-4 md:px-6">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Model: {name}</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">View and manage model data, names, checked model and videos.</p>
            </div>
            <button onClick={() => router.push(`/models`)} className="px-3 py-2 text-sm rounded bg-white/10 hover:bg-white/15">Back to Models</button>
          </div>

          {loading ? (
            <div className="text-sm text-slate-500">Loading...</div>
          ) : error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : !data?.exists ? (
            <div className="text-sm text-slate-600">Model not found.</div>
          ) : (
            <div className="space-y-6">
              {/* Model data */}
              <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold">Model data</h2>
                  <button onClick={saveModel} disabled={savingModel || !model?.id} className="px-3 py-1.5 text-sm rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50">{savingModel ? "Saving..." : "Save"}</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-slate-500">ID</div>
                    <div className="text-sm">{model?.id}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Name</div>
                    <div className="text-sm">{model?.name}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input id="m-online" type="checkbox" checked={isOnline} onChange={(e) => setIsOnline(e.target.checked)} />
                    <label htmlFor="m-online" className="text-sm">Is online</label>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Image URL</label>
                    <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full bg-white/70 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-md px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Started at</label>
                    <input type="datetime-local" value={startedAt} onChange={(e) => setStartedAt(e.target.value)} className="w-full bg-white/70 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-md px-3 py-2 text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <div className="text-sm font-medium mb-2">Video tags</div>
                    <div className="flex items-center gap-2 mb-2">
                      <input value={newVideoTag} onChange={(e) => setNewVideoTag(e.target.value)} placeholder="Add tag" className="flex-1 bg-white/70 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-md px-3 py-2 text-sm" />
                      <button type="button" onClick={() => { addArrayItem(newVideoTag, videoTags, setVideoTags); setNewVideoTag(""); }} className="px-3 py-2 text-sm rounded bg-indigo-600 hover:bg-indigo-500">Add</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {videoTags.map((t, i) => (
                        <span key={`${t}-${i}`} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 text-xs">
                          {t}
                          <button type="button" onClick={() => removeArrayItem(i, videoTags, setVideoTags)} className="text-slate-500 hover:text-slate-800">×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-2">Tags</div>
                    <div className="flex items-center gap-2 mb-2">
                      <input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Add tag" className="flex-1 bg-white/70 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-md px-3 py-2 text-sm" />
                      <button type="button" onClick={() => { addArrayItem(newTag, tags, setTags); setNewTag(""); }} className="px-3 py-2 text-sm rounded bg-indigo-600 hover:bg-indigo-500">Add</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((t, i) => (
                        <span key={`${t}-${i}`} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 text-xs">
                          {t}
                          <button type="button" onClick={() => removeArrayItem(i, tags, setTags)} className="text-slate-500 hover:text-slate-800">×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Checked model */}
              <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold">Checked model</h2>
                  <div className="flex items-center gap-2">
                    {checkedModel && (
                      <button onClick={deleteCheckedModel} disabled={cmBusy} className="px-3 py-1.5 text-sm rounded bg-red-500/20 hover:bg-red-500/30">Delete</button>
                    )}
                    <button onClick={saveCheckedModel} disabled={cmBusy} className="px-3 py-1.5 text-sm rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50">{cmBusy ? "Saving..." : checkedModel ? "Save" : "Create"}</button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                </div>
              </section>

              {/* Model names */}
              <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold">Model names</h2>
                  <div className="flex items-center gap-2">
                    <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Add new name" className="bg-white/70 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-md px-3 py-2 text-sm" />
                    <button onClick={addModelName} disabled={!newName.trim() || !checkedModel} className="px-3 py-2 text-sm rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50">Add</button>
                  </div>
                </div>
                {(modelNames || []).length === 0 ? (
                  <div className="text-sm text-slate-600">No names.</div>
                ) : (
                  <div className="space-y-2">
                    {modelNames.map((n) => (
                      <div key={n.id} className="flex items-center gap-2">
                        {editNameId === n.id ? (
                          <>
                            <input value={editNameVal} onChange={(e) => setEditNameVal(e.target.value)} className="flex-1 bg-white/70 dark:bg-white/10 border border-slate-200 dark:border-white/10 rounded-md px-2 py-1 text-sm" />
                            <button type="button" onClick={() => saveModelName(n.id)} disabled={!!nameBusy[n.id]} className="px-2 py-1 text-xs rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50">Save</button>
                            <button type="button" onClick={cancelEditModelName} className="px-2 py-1 text-xs rounded bg-white/10 hover:bg-white/15">Cancel</button>
                          </>
                        ) : (
                          <>
                            <div className="flex-1 text-sm">{n.name}</div>
                            <button type="button" onClick={() => startEditModelName(n)} className="px-2 py-1 text-xs rounded bg-white/10 hover:bg-white/15">Edit</button>
                            <button type="button" onClick={() => deleteModelName(n.id)} disabled={!!nameBusy[n.id]} className="px-2 py-1 text-xs rounded bg-red-500/20 hover:bg-red-500/30">Delete</button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Videos */}
              <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold">Videos ({videos.length})</h2>
                </div>
                {vidLoading ? (
                  <div className="text-sm text-slate-500">Loading...</div>
                ) : videos.length === 0 ? (
                  <div className="text-sm text-slate-600">No videos for this model.</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video, idx) => (
                      <div key={`${video}-${idx}`} className="rounded shadow bg-black/80 p-2 flex flex-col items-center">
                        <VideoPlayer className="w-full max-w-full bg-black/80" style={{ height: "300px", width: "100%" }} src={`/videos/${encodeURIComponent(name)}/${video}`} />
                        <div className="text-xs text-gray-400 mt-2 break-all">{video}</div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function toLocalDateTime(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const mi = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
}
