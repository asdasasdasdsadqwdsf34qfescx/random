import { NextResponse } from "next/server";
import { callRemote } from "@/lib/checkedModelsRemote";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const idNum = Number(id);
  if (!Number.isFinite(idNum)) return NextResponse.json({ statusCode: 400, message: "Invalid id", error: "Bad Request" }, { status: 400 });
  const remote = await callRemote(`/models/${idNum}`, { method: "GET" });
  if (!remote) return NextResponse.json({ statusCode: 502, message: "Upstream unavailable", error: "Bad Gateway" }, { status: 502 });
  const data = await remote.json();
  return NextResponse.json(data, { status: remote.status });
}

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    const idNum = Number(id);
    if (!Number.isFinite(idNum)) return NextResponse.json({ statusCode: 400, message: "Invalid id", error: "Bad Request" }, { status: 400 });
    const body = await req.json().catch(() => ({}));
    const remote = await callRemote(`/models/${idNum}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (!remote) return NextResponse.json({ statusCode: 502, message: "Upstream unavailable", error: "Bad Gateway" }, { status: 502 });
    const data = await remote.json().catch(() => ({}));
    return NextResponse.json(data, { status: remote.status });
  } catch (e: any) {
    return NextResponse.json({ statusCode: 500, message: e?.message || "Internal Server Error", error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const idNum = Number(id);
  if (!Number.isFinite(idNum)) return NextResponse.json({ statusCode: 400, message: "Invalid id", error: "Bad Request" }, { status: 400 });
  const remote = await callRemote(`/models/${idNum}`, { method: "DELETE" });
  if (!remote) return NextResponse.json({ statusCode: 502, message: "Upstream unavailable", error: "Bad Gateway" }, { status: 502 });
  const data = await remote.json().catch(() => ({}));
  return NextResponse.json(data, { status: remote.status });
}
