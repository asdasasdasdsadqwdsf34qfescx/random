import { getVideosFromModel } from "../../../../lib/imageUtils.js";

export async function GET(request, context) {
  const { model } = await context.params;
  const { searchParams } = new URL(request.url);

  const filter = searchParams.get("filter");
  return await getVideosFromModel(model, filter);
}
