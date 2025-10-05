import { NextResponse } from "next/server";
import { callRemote } from "@/lib/checkedModelsRemote";

export async function GET(_req: Request, { params }: { params: { checkedModelId: string } }) {
  try {
    const id = Number(params.checkedModelId);
    if (!Number.isFinite(id)) return NextResponse.json({ statusCode: 400, message: "Invalid checkedModelId", error: "Bad Request" }, { status: 400 });
    const remote = await callRemote(`/model-names/by-checked-model/${id}`, { method: "GET" });
    if (!remote) return NextResponse.json({ statusCode: 502, message: "Upstream unavailable", error: "Bad Gateway" }, { status: 502 });
    const data = await remote.json();
    return NextResponse.json(data, { status: remote.status });
  } catch (e: any) {
    return NextResponse.json({ statusCode: 500, message: e?.message || "Internal Server Error", error: "Internal Server Error" }, { status: 500 });
  }
}
