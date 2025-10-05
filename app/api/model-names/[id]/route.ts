import { NextResponse } from "next/server";
import { callRemote } from "@/lib/checkedModelsRemote";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) return NextResponse.json({ statusCode: 400, message: "Invalid id", error: "Bad Request" }, { status: 400 });
    const remote = await callRemote(`/model-names/${id}`, { method: "GET" });
    if (!remote) return NextResponse.json({ statusCode: 502, message: "Upstream unavailable", error: "Bad Gateway" }, { status: 502 });
    const data = await remote.json();
    return NextResponse.json(data, { status: remote.status });
  } catch (e: any) {
    return NextResponse.json({ statusCode: 500, message: e?.message || "Internal Server Error", error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) return NextResponse.json({ statusCode: 400, message: "Invalid id", error: "Bad Request" }, { status: 400 });
    const body = await req.json();
    if (body.name !== undefined && typeof body.name !== "string") return NextResponse.json({ statusCode: 400, message: "name must be string", error: "Bad Request" }, { status: 400 });
    if (body.modelId !== undefined && !(typeof body.modelId === "number" || typeof body.modelId === "string")) return NextResponse.json({ statusCode: 400, message: "modelId must be number", error: "Bad Request" }, { status: 400 });
    const remote = await callRemote(`/model-names/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...(body.name !== undefined ? { name: body.name } : {}), ...(body.modelId !== undefined ? { modelId: Number(body.modelId) } : {}) })
    });
    if (!remote) return NextResponse.json({ statusCode: 502, message: "Upstream unavailable", error: "Bad Gateway" }, { status: 502 });
    const data = await remote.json();
    return NextResponse.json(data, { status: remote.status });
  } catch (e: any) {
    return NextResponse.json({ statusCode: 500, message: e?.message || "Internal Server Error", error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) return NextResponse.json({ statusCode: 400, message: "Invalid id", error: "Bad Request" }, { status: 400 });
    const remote = await callRemote(`/model-names/${id}`, { method: "DELETE" });
    if (!remote) return NextResponse.json({ statusCode: 502, message: "Upstream unavailable", error: "Bad Gateway" }, { status: 502 });
    const data = await remote.json().catch(() => ({}));
    return NextResponse.json(data, { status: remote.status });
  } catch (e: any) {
    return NextResponse.json({ statusCode: 500, message: e?.message || "Internal Server Error", error: "Internal Server Error" }, { status: 500 });
  }
}
