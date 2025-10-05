export const CHECKED_MODELS_BASE = process.env.CHECKED_MODELS_BASE || "http://localhost:3001";

export async function callRemote(path: string, init?: RequestInit): Promise<Response | null> {
  try {
    const url = new URL(CHECKED_MODELS_BASE.replace(/\/$/, "") + path);
    const res = await fetch(url.toString(), init);
    return res;
  } catch (_e) {
    return null;
  }
}
