import { NextResponse } from "next/server";
import { callRemote } from "@/lib/checkedModelsRemote";

export async function GET(_req: Request, ctx: { params: Promise<{ name: string }> }) {
  try {
    const { name } = await ctx.params;
    if (!name || typeof name !== "string") {
      return NextResponse.json({ statusCode: 400, message: "Invalid name", error: "Bad Request" }, { status: 400 });
    }
    const remote = await callRemote(`/model/data/${encodeURIComponent(name)}`, { method: "GET" });
    if (!remote) return NextResponse.json({ statusCode: 502, message: "Upstream unavailable", error: "Bad Gateway" }, { status: 502 });
    const data = await remote.json();
    return NextResponse.json(data, { status: remote.status });
  } catch (e: any) {
    return NextResponse.json({ statusCode: 500, message: e?.message || "Internal Server Error", error: "Internal Server Error" }, { status: 500 });
  }
}
