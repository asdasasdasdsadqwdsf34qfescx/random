import { getImagesFromCategory } from "../../../../lib/imageUtils.js";

export const GET = async (request, { params }) => {
  const { category } = await params;
  return await getImagesFromCategory(category);
};
