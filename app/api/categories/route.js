import { getImagesFromCategory, getVideosFromModel, getAllVideos } from "../../../lib/imageUtils.js";

export const GET = async (request) => {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const type = searchParams.get("type") || "images";
  
  if (!category) {
    return new Response(
      JSON.stringify({ error: "Missing category parameter" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    switch (type) {
      case "images":
        return await getImagesFromCategory(category);
      
      case "videos":
        const filter = searchParams.get("filter");
        return await getVideosFromModel(category, filter);
      
      case "allvideos":
        return await getAllVideos();
      
      default:
        return new Response(
          JSON.stringify({ error: "Invalid type. Use 'images', 'videos', or 'allvideos'" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
