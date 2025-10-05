import { NextResponse } from "next/server";
import { callRemote } from "@/lib/checkedModelsRemote";

export async function GET() {
  try {
    const remote = await callRemote(`/model-names`, { method: "GET" });
    if (!remote) return NextResponse.json({ statusCode: 502, message: "Upstream unavailable", error: "Bad Gateway" }, { status: 502 });
    const data = await remote.json();
    return NextResponse.json(data, { status: remote.status });
  } catch (e: any) {
    return NextResponse.json({ statusCode: 500, message: e?.message || "Internal Server Error", error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || typeof body.name !== "string" || !(typeof body.modelId === "number" || typeof body.modelId === "string")) {
      return NextResponse.json({ statusCode: 400, message: "Invalid body. Expect { name: string, modelId: number }", error: "Bad Request" }, { status: 400 });
    }
    const remote = await callRemote(`/model-names`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: body.name, modelId: Number(body.modelId) })
    });
    if (!remote) return NextResponse.json({ statusCode: 502, message: "Upstream unavailable", error: "Bad Gateway" }, { status: 502 });
    const data = await remote.json();
    return NextResponse.json(data, { status: remote.status });
  } catch (e: any) {
    return NextResponse.json({ statusCode: 500, message: e?.message || "Internal Server Error", error: "Internal Server Error" }, { status: 500 });
  }
}
