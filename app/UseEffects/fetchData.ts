import { getData, getVideoRating } from "../ids";

export const fetchDataFromSupabase = async ({
  setVideoDetails,
  setCurrentVideo,
  setSelectedVideoIndex,
  setOnlineModels,
  setPreviousRandomTop,
}: {
  setVideoDetails: any;
  setPreviousRandomTop: any;
  setRandomTop: any;
  setPreviousOnlineTop: any;
  randomTop: any;
  setOnlineTop: any;
  setCurrentVideo: any;
  setSelectedVideoIndex: any;
  setOnlineModels: any;
}) => {
  try {
    const details = await getData();
    if (details) {
      setVideoDetails(details);

      const id = Math.floor(Math.random() * details.length);
      setCurrentVideo(details[id]);
      setSelectedVideoIndex(0);
      const topRandom = await getVideoRating();
      const onlineModels = details.filter((video) => {
        return video.isOnline;
      });
      setOnlineModels(onlineModels);
      setPreviousRandomTop(topRandom);
    }
  } catch (error) {
    console.error("Error fetching video data:", error);
  }
};
