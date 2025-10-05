import { NextResponse } from "next/server";
import { callRemote } from "@/lib/checkedModelsRemote";
import { getAll as getAllChecked } from "@/lib/checkedModelsStore";
import { getImagesFromCategory, getVideosFromModel } from "@/lib/imageUtils.js";

export async function GET() {
  try {
    // Prefer upstream if available
    const remote = await callRemote("/model/data", { method: "GET" });
    if (remote) {
      const data = await remote.json();
      return NextResponse.json(data, { status: remote.status });
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

    return NextResponse.json({ items }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { statusCode: 500, message: e?.message || "Internal Server Error", error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
