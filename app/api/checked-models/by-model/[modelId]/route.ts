import { NextResponse } from "next/server";
import { getByModelId } from "@/lib/checkedModelsStore";

export async function GET(_req: Request, { params }: { params: { modelId: string } }) {
  try {
    const modelIdNum = Number(params.modelId);
    if (!Number.isFinite(modelIdNum)) return NextResponse.json({ statusCode: 400, message: "Invalid modelId", error: "Bad Request" }, { status: 400 });
    const items = getByModelId(modelIdNum);
    return NextResponse.json(items, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ statusCode: 500, message: e?.message || "Internal Server Error", error: "Internal Server Error" }, { status: 500 });
  }
}
