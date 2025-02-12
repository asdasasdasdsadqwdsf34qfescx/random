import { getData } from "../ids";

export const updateOnlineList = async (
  setVideoDetails: (details: any[]) => void,
  setOnlineModels: (onlineModels: any[]) => void
) => {
  try {
    const details = await getData();
    if (details) {
      setVideoDetails(details);
      const onlineModels = details.filter((video) => video.isOnline);
      setOnlineModels(onlineModels);
    }
  } catch (error) {
    console.error("Error fetching video data:", error);
  }
};