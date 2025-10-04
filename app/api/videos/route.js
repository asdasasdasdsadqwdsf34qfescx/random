import { getVideosFromModel } from "../../../lib/imageUtils.js";

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");
  
  if (!name) {
    return new Response(JSON.stringify({ error: "Missing name param" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  
  const filter = searchParams.get("filter");
  return await getVideosFromModel(name, filter);
};
