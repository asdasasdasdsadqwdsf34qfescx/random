import { getImagesFromCategory } from "../../../../lib/imageUtils.js";

export const GET = async (request, { params }) => {
  const { category } = params;
  return await getImagesFromCategory(category);
};
