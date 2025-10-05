import fs from "fs";
import path from "path";

export interface CheckedModel {
  id: number;
  name: string;
  created_at: string;
  hasContent: boolean;
  modelId?: number;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "checked-models.json");

function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ lastId: 0, items: [] }, null, 2), "utf8");
  }
}

function readRaw(): { lastId: number; items: CheckedModel[] } {
  ensureStore();
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.items)) {
      throw new Error("Invalid data format");
    }
    return { lastId: parsed.lastId ?? 0, items: parsed.items as CheckedModel[] };
  } catch (e) {
    // Attempt to recover by reinitializing
    const fresh = { lastId: 0, items: [] as CheckedModel[] };
    fs.writeFileSync(DATA_FILE, JSON.stringify(fresh, null, 2), "utf8");
    return fresh;
  }
}

function writeRaw(data: { lastId: number; items: CheckedModel[] }) {
  ensureStore();
  const tmp = DATA_FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "utf8");
  fs.renameSync(tmp, DATA_FILE);
}

export function getAll(hasContent?: boolean): CheckedModel[] {
  const { items } = readRaw();
  if (typeof hasContent === "boolean") {
    return items.filter((i) => i.hasContent === hasContent);
  }
  return items;
}

export function getById(id: number): CheckedModel | undefined {
  const { items } = readRaw();
  return items.find((i) => i.id === id);
}

export function getByModelId(modelId: number): CheckedModel[] {
  const { items } = readRaw();
  return items.filter((i) => i.modelId === modelId);
}

export function create(input: { name: string; hasContent: boolean; modelId?: number }): CheckedModel {
  const data = readRaw();
  const id = (data.lastId || 0) + 1;
  const now = new Date().toISOString();
  const base: CheckedModel = { id, name: String(input.name), hasContent: Boolean(input.hasContent), created_at: now };
  const item: CheckedModel = input.modelId !== undefined
    ? { ...base, modelId: Number(input.modelId) }
    : base;
  data.items.push(item);
  data.lastId = id;
  writeRaw(data);
  return item;
}

export function update(id: number, patch: Partial<Pick<CheckedModel, "name" | "hasContent" | "modelId">>): CheckedModel | undefined {
  const data = readRaw();
  const idx = data.items.findIndex((i) => i.id === id);
  if (idx === -1) return undefined;
  const current = data.items[idx];
  const updated: CheckedModel = {
    ...current,
    ...(patch.name !== undefined ? { name: String(patch.name) } : {}),
    ...(patch.hasContent !== undefined ? { hasContent: Boolean(patch.hasContent) } : {}),
    ...(patch.modelId !== undefined ? { modelId: Number(patch.modelId) } : {}),
  };
  data.items[idx] = updated;
  writeRaw(data);
  return updated;
}

export function remove(id: number): boolean {
  const data = readRaw();
  const before = data.items.length;
  data.items = data.items.filter((i) => i.id !== id);
  const changed = data.items.length !== before;
  if (changed) writeRaw(data);
  return changed;
}
