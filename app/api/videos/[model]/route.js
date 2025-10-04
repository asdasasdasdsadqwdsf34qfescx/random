import { getVideosFromModel } from "../../../../lib/imageUtils.js";

export const GET = async (request, { params }) => {
  const { model } = params;
  const { searchParams } = new URL(request.url);
  
  const filter = searchParams.get("filter");
  return await getVideosFromModel(model, filter);
};
