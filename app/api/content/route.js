import { getImagesFromCategory, getVideosFromModel, getAllVideos } from "../../../lib/imageUtils.js";

export const GET = async (request) => {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const type = searchParams.get("type") || "images";
  const filter = searchParams.get("filter");
  
  // Handle allvideos special case
  if (type === "allvideos") {
    return await getAllVideos();
  }
  
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
        return await getVideosFromModel(category, filter);
      
      default:
        return new Response(
          JSON.stringify({ error: "Invalid type. Use 'images' or 'videos'" }),
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
