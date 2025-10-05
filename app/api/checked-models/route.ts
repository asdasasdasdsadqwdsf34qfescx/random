import { NextResponse } from "next/server";
import { create, getAll } from "@/lib/checkedModelsStore";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const hasContentParam = searchParams.get("hasContent");
    const hasContent = hasContentParam === null ? undefined : hasContentParam === "true" ? true : hasContentParam === "false" ? false : undefined;
    const items = getAll(hasContent);
    return NextResponse.json(items, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ statusCode: 500, message: e?.message || "Internal Server Error", error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body || typeof body.name !== "string" || typeof body.hasContent !== "boolean" || (typeof body.modelId !== "number" && typeof body.modelId !== "string")) {
      return NextResponse.json({ statusCode: 400, message: "Invalid body. Expect { name: string, hasContent: boolean, modelId: number }", error: "Bad Request" }, { status: 400 });
    }
    const item = create({ name: body.name, hasContent: Boolean(body.hasContent), modelId: Number(body.modelId) });
    return NextResponse.json(item, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ statusCode: 500, message: e?.message || "Internal Server Error", error: "Internal Server Error" }, { status: 500 });
  }
}
