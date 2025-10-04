import { getImagesFromCategory } from "../../../../lib/imageUtils.js";

export async function GET(request, context) {
  const { category } = await context.params;
  return await getImagesFromCategory(category);
}
