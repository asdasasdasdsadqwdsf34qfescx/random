import { NextResponse } from "next/server";
import { callRemote } from "@/lib/checkedModelsRemote";
import { getModels as getLocalModels } from "@/lib/clientApi";

export async function GET() {
  try {
    const remote = await callRemote("/checked-models/available-models", { method: "GET" });
    if (remote) {
      const data = await remote.json();
      const normalized = Array.isArray(data)
        ? data.filter((m: any) => typeof m?.id === "number" && typeof m?.name === "string").map((m: any) => ({ id: m.id, name: m.name }))
        : [];
      return NextResponse.json(normalized, { status: 200 });
    }

    const local = await getLocalModels().catch(() => [] as any[]);
    const normalized = Array.isArray(local)
      ? local
          .filter((m: any) => typeof m?.id === "number" && typeof m?.name === "string")
          .map((m: any) => ({ id: m.id, name: m.name }))
      : [];
    return NextResponse.json(normalized, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ statusCode: 500, message: e?.message || "Internal Server Error", error: "Internal Server Error" }, { status: 500 });
  }
}
