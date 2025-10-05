"use client";

import { useEffect, useMemo, useState } from "react";
import useSWR, { mutate } from "swr";
import Sidebar from "../components/Sidebar";
import { useSidebar } from "../components/ui/SidebarContext";

interface CheckedModel {
  id: number;
  name: string;
  created_at: string;
  hasContent: boolean;
  modelId: number;
}

type HasContentFilter = "all" | "true" | "false";

const fetcher = (url: string) => fetch(url).then((r) => {
  if (!r.ok) throw new Error("Request failed");
  return r.json();
});

export default function CheckedModelsPage() {
  const { isOpen } = useSidebar();
  const [filter, setFilter] = useState<HasContentFilter>("all");
  const [search, setSearch] = useState("");
  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (filter === "true") params.set("hasContent", "true");
    if (filter === "false") params.set("hasContent", "false");
    return params.toString();
  }, [filter]);
  const { data, error, isLoading } = useSWR<CheckedModel[]>(`/api/checked-models${query ? `?${query}` : ""}`, fetcher, { revalidateOnFocus: false });

  const items = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return data || [];
    return (data || []).filter((i) =>
      i.name.toLowerCase().includes(term) ||
      String(i.id) === term ||
      String(i.modelId) === term
    );
  }, [data, search]);

  const [modal, setModal] = useState<null | { mode: "create" } | { mode: "edit"; item: CheckedModel }>(null);

  return (
    <div className="relative">
      <Sidebar />
      <section className={`${isOpen ? "md:ml-64" : "md:ml-0"} ml-0 py-4 md:py-8 transition-[margin] duration-300 px-4 md:px-6`}>
        <div className="mb-6 flex flex-col md:flex-row md:items-center gap-3 justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Checked Models</h1>
            <p className="text-white/60 text-sm">Monitorizează modelele verificate și gestionează-le rapid.</p>
          </div>
          <button
            onClick={() => setModal({ mode: "create" })}
            className="inline-flex items-center gap-2 rounded-md bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-sm font-medium shadow focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Add Model
          </button>
        </div>

        <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="col-span-2">
            <div className="relative">
              <input
                type="search"
                placeholder="Caută după nume sau ID..."
                className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div>
            <select
              className="w-full bg-white text-slate-900 border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-800 dark:text-white dark:border-slate-600"
              value={filter}
              onChange={(e) => setFilter(e.target.value as HasContentFilter)}
            >
              <option value="all">Toate</option>
              <option value="true">Cu conținut</option>
              <option value="false">Fără conținut</option>
            </select>
          </div>
        </div>

        {error && (
          <div role="alert" className="mb-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">Nu s-au putut încărca modelele.</div>
        )}

        <div className="bg-gray-900/40 rounded-xl border border-white/10 overflow-hidden">
          <div className="grid grid-cols-12 px-4 py-3 text-xs uppercase tracking-wider text-white/60">
            <div className="col-span-4">Nume</div>
            <div className="col-span-2">Model ID</div>
            <div className="col-span-2">Conținut</div>
            <div className="col-span-2">Creat</div>
            <div className="col-span-2 text-right">Acțiuni</div>
          </div>
          <div className="divide-y divide-white/10">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-14 animate-pulse bg-white/5" />
              ))
            ) : items.length === 0 ? (
              <div className="px-4 py-8 text-center text-white/70">Niciun rezultat.</div>
            ) : (
              items.map((item) => (
                <Row key={item.id} item={item} onEdit={() => setModal({ mode: "edit", item })} />
              ))
            )}
          </div>
        </div>

        {modal && (
          <EditModal
            mode={modal.mode}
            item={(modal as any).item}
            onClose={() => setModal(null)}
            onSaved={() => {
              mutate(`/api/checked-models${query ? `?${query}` : ""}`);
              setModal(null);
            }}
          />
        )}
      </section>
    </div>
  );
}

function Row({ item, onEdit }: { item: CheckedModel; onEdit: () => void }) {
  const [busy, setBusy] = useState(false);
  const deleteItem = async () => {
    if (!confirm(`Ștergi modelul #${item.id}?`)) return;
    try {
      setBusy(true);
      const r = await fetch(`/api/checked-models/${item.id}`, { method: "DELETE" });
      if (!r.ok) throw new Error("Fail");
    } finally {
      setBusy(false);
    }
  };
  useEffect(() => {
    if (!busy) return;
  }, [busy]);
  return (
    <div className="grid grid-cols-12 items-center px-4 py-3">
      <div className="col-span-4">
        <div className="font-medium">{item.name}</div>
        <div className="text-xs text-white/50">#{item.id}</div>
      </div>
      <div className="col-span-2">{item.modelId}</div>
      <div className="col-span-2">
        <span className={`px-2 py-1 rounded text-xs ${item.hasContent ? "bg-green-500/20 text-green-300" : "bg-yellow-500/20 text-yellow-300"}`}>
          {item.hasContent ? "Da" : "Nu"}
        </span>
      </div>
      <div className="col-span-2 text-sm text-white/70">{new Date(item.created_at).toLocaleString()}</div>
      <div className="col-span-2 text-right flex items-center justify-end gap-2">
        <button onClick={onEdit} className="px-2 py-1 text-xs rounded bg-white/10 hover:bg-white/15">Editează</button>
        <button onClick={deleteItem} className="px-2 py-1 text-xs rounded bg-red-500/20 hover:bg-red-500/30" disabled={busy}>{busy ? "..." : "Șterge"}</button>
      </div>
    </div>
  );
}

function EditModal({ mode, item, onClose, onSaved }: { mode: "create" | "edit"; item?: CheckedModel; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(item?.name || "");
  const [modelId, setModelId] = useState(item?.modelId?.toString() || "");
  const [hasContent, setHasContent] = useState(item?.hasContent || false);
  const [saving, setSaving] = useState(false);
  const valid = name.trim().length > 0 && /^(?:0|[1-9]\d*)$/.test(modelId);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    try {
      setSaving(true);
      const payload = { name: name.trim(), hasContent, modelId: Number(modelId) };
      const r = await fetch(mode === "create" ? "/api/checked-models" : `/api/checked-models/${item!.id}` , {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!r.ok) throw new Error("save failed");
      onSaved();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md bg-gray-900 rounded-lg border border-white/10 p-4">
        <h2 className="text-lg font-semibold mb-3">{mode === "create" ? "Adaugă model" : "Editează model"}</h2>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Nume</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm mb-1">Model ID</label>
            <input value={modelId} onChange={(e) => setModelId(e.target.value)} inputMode="numeric" className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="flex items-center gap-2">
            <input id="hasContent" type="checkbox" checked={hasContent} onChange={(e) => setHasContent(e.target.checked)} />
            <label htmlFor="hasContent" className="text-sm">Are conținut</label>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-3 py-2 text-sm rounded bg-white/10 hover:bg-white/15">Anulează</button>
            <button disabled={!valid || saving} className="px-3 py-2 text-sm rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50">{saving ? "Se salvează..." : "Salvează"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
