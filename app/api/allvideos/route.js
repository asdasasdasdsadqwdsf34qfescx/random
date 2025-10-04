import { getAllVideos } from "../../../lib/imageUtils.js";

export const GET = async () => {
  return await getAllVideos();
};
