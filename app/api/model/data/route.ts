import { NextResponse } from "next/server";
import { callRemote } from "@/lib/checkedModelsRemote";
import { getAll as getAllChecked } from "@/lib/checkedModelsStore";
import { getImagesFromCategory, getVideosFromModel } from "@/lib/imageUtils.js";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const parseList = (key: string): string[] => {
      const all = searchParams.getAll(key);
      const split = all.flatMap((v) => String(v).split(","));
      return Array.from(new Set(split.map((s) => s.trim()).filter(Boolean))).map((s) => s.toLowerCase());
    };
    const filterVideoTags = parseList("videoTags");
    const filterTags = parseList("tags");
    const isOnlineParam = searchParams.get("isOnline");
    const hasOnlineFilter = isOnlineParam === "true" || isOnlineParam === "false";
    const isOnlineFilter = isOnlineParam === "true";

    // Prefer upstream if available (fetch full data, filter locally for consistency)
    const remote = await callRemote("/model/data", { method: "GET" });
    if (remote) {
      const data = await remote.json().catch(() => ({}));
      const items: any[] = Array.isArray((data as any)?.items) ? (data as any).items : Array.isArray(data) ? (data as any) : [];
      const filtered = items.filter((it: any) => {
        const model = it?.modelData?.model || {};
        const vt: string[] = Array.isArray(model.videoTags) ? model.videoTags.map((x: any) => String(x).toLowerCase()) : [];
        const tg: string[] = Array.isArray(model.tags) ? model.tags.map((x: any) => String(x).toLowerCase()) : [];
        const online = typeof model.isOnline === "boolean" ? model.isOnline : Boolean(it?.modelData?.isOnline);

        if (filterVideoTags.length && !filterVideoTags.some((t) => vt.includes(t))) return false;
        if (filterTags.length && !filterTags.some((t) => tg.includes(t))) return false;
        if (hasOnlineFilter && online !== isOnlineFilter) return false;
        return true;
      });
      return NextResponse.json({ items: filtered }, { status: 200 });
    }

    // Local fallback: derive from public/photos and local checked models
    const photosRes = await getImagesFromCategory("photos");
    const photosJson = await photosRes.json().catch(() => ({ images: [] as string[] }));
    const images: string[] = Array.isArray(photosJson?.images) ? photosJson.images : [];
    const names = images
      .map((f) => f.replace(/\.[^.]+$/, ""))
      .filter((n) => typeof n === "string" && n.trim() !== "");

    const checked = getAllChecked();

    const items = await Promise.all(
      names.map(async (name) => {
        const lower = name.toLowerCase();
        const matchedChecked = checked.filter((c) => (c.name || "").toLowerCase() === lower);

        let totalVideoCount = 0;
        try {
          const vidsRes = await getVideosFromModel(name);
          const vidsJson = await vidsRes.json();
          const vids: string[] = Array.isArray(vidsJson?.videos) ? vidsJson.videos : [];
          totalVideoCount = vids.length;
        } catch {
          totalVideoCount = 0;
        }

        return {
          name,
          exists: true,
          modelData: {
            model: { id: null, name },
            modelNames: [] as any[],
            checkedModel: matchedChecked,
            totalVideoCount,
            isOnline: false,
          },
        };
      })
    );

    // Apply filters to local fallback (tags/videoTags unavailable, so only isOnline works)
    const filtered = items.filter((it) => {
      const model = (it as any)?.modelData?.model || {};
      const online = typeof model.isOnline === "boolean" ? model.isOnline : Boolean((it as any)?.modelData?.isOnline);
      if (hasOnlineFilter && online !== isOnlineFilter) return false;
      if (filterVideoTags.length || filterTags.length) return false; // no tags locally, exclude when tag filters requested
      return true;
    });

    return NextResponse.json({ items: filtered }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { statusCode: 500, message: e?.message || "Internal Server Error", error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
