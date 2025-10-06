import { NextResponse } from "next/server";
import { getById, remove, update } from "@/lib/checkedModelsStore";
import { callRemote } from "@/lib/checkedModelsRemote";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const idNum = Number(params.id);
    if (!Number.isFinite(idNum)) return NextResponse.json({ statusCode: 400, message: "Invalid id", error: "Bad Request" }, { status: 400 });

    const remote = await callRemote(`/checked-models/${idNum}`, { method: "GET" });
    if (remote) {
      const data = await remote.json();
      return NextResponse.json(data, { status: remote.status });
    }

    const item = getById(idNum);
    if (!item) return NextResponse.json({ statusCode: 404, message: "Not Found", error: "Not Found" }, { status: 404 });
    return NextResponse.json(item, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ statusCode: 500, message: e?.message || "Internal Server Error", error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const idNum = Number(params.id);
    if (!Number.isFinite(idNum)) return NextResponse.json({ statusCode: 400, message: "Invalid id", error: "Bad Request" }, { status: 400 });
    const body = await req.json();
    const patch: any = {};
    if (body.name !== undefined && typeof body.name !== "string") return NextResponse.json({ statusCode: 400, message: "name must be string", error: "Bad Request" }, { status: 400 });
    if (body.hasContent !== undefined && typeof body.hasContent !== "boolean") return NextResponse.json({ statusCode: 400, message: "hasContent must be boolean", error: "Bad Request" }, { status: 400 });
    if (body.modelId !== undefined && !(typeof body.modelId === "number" || typeof body.modelId === "string")) return NextResponse.json({ statusCode: 400, message: "modelId must be number", error: "Bad Request" }, { status: 400 });
    if (body.status !== undefined && !["approved","rejected","pending","waiting"].includes(String(body.status))) return NextResponse.json({ statusCode: 400, message: "status invalid", error: "Bad Request" }, { status: 400 });

    const remote = await callRemote(`/checked-models/${idNum}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...(body.name !== undefined ? { name: body.name } : {}),
        ...(body.hasContent !== undefined ? { hasContent: body.hasContent } : {}),
        ...(body.modelId !== undefined ? { modelId: Number(body.modelId) } : {}),
        ...(body.status !== undefined ? { status: String(body.status) } : {}),
      })
    });
    if (remote) {
      const data = await remote.json();
      return NextResponse.json(data, { status: remote.status });
    }

    if (body.name !== undefined) patch.name = body.name;
    if (body.hasContent !== undefined) patch.hasContent = body.hasContent;
    if (body.modelId !== undefined) patch.modelId = Number(body.modelId);
    if (body.status !== undefined) patch.status = String(body.status);
    const item = update(idNum, patch);
    if (!item) return NextResponse.json({ statusCode: 404, message: "Not Found", error: "Not Found" }, { status: 404 });
    return NextResponse.json(item, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ statusCode: 500, message: e?.message || "Internal Server Error", error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const idNum = Number(params.id);
    if (!Number.isFinite(idNum)) return NextResponse.json({ statusCode: 400, message: "Invalid id", error: "Bad Request" }, { status: 400 });

    const remote = await callRemote(`/checked-models/${idNum}`, { method: "DELETE" });
    if (remote) {
      const data = await remote.json().catch(() => ({}));
      return NextResponse.json(data, { status: remote.status });
    }

    const ok = remove(idNum);
    if (!ok) return NextResponse.json({ statusCode: 404, message: "Not Found", error: "Not Found" }, { status: 404 });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ statusCode: 500, message: e?.message || "Internal Server Error", error: "Internal Server Error" }, { status: 500 });
  }
}
