import { getData, getOnlineRating, getVideoRating } from "../ids";
import { calculatePositionChanges } from "../Tab/Randome/utils-randome";

export const fetchDataFromSupabase = async ({
  setVideoDetails,
  setPreviousRandomTop,
  setRandomTop,
  setPreviousOnlineTop,
  randomTop,
  setOnlineTop,
  setCurrentVideo,
  setSelectedVideoIndex,
  setOnlineModels,
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
    const onlineTop = await getOnlineRating();
    const randomeTop = await getVideoRating();

    if (details) {
      setVideoDetails(details);

      // Calculăm schimbările de poziții pentru "randomTop"
      const randomChanges = calculatePositionChanges(randomeTop!, randomTop);
      setPreviousRandomTop(randomeTop!);
      setRandomTop(randomeTop!);

      // Calculăm schimbările de poziții pentru "onlineTop"
      const onlineChanges = calculatePositionChanges(onlineTop!, onlineTop!);
      setPreviousOnlineTop(onlineTop!);
      setOnlineTop(onlineTop!);

      const id = Math.floor(Math.random() * details.length);
      setCurrentVideo(details[id]);
      setSelectedVideoIndex(0);

      const onlineModels = details.filter((video) => {
        return video.isOnline;
      });
      setOnlineModels(onlineModels);
    }
  } catch (error) {
    console.error("Error fetching video data:", error);
  }
};
