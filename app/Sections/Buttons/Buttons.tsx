import { getOnlineRating, getVideoRating, updateVideoCount } from "@/app/ids";
const cheekLink = "https://check-one-ruby.vercel.app";

export const ButtonsSection = ({
  setRandomTop,
  setOnlineTop,
  setCurrentVideo,
  setSelectedVideoIndex,
  videoDetails,
  setShowAddModal,
  router,
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
  videoDetails: any;
  setShowAddModal: any;
  router: any;
}) => {
  const handleRandomVideo = () => {
    if (videoDetails.length > 0) {
      const randomModel =
        videoDetails[Math.floor(Math.random() * videoDetails.length)];

      setCurrentVideo(randomModel);
      updateVideoCount(randomModel.id!);
      setSelectedVideoIndex(0);

      const fetchData = async () => {
        const onlineTop = await getOnlineRating();
        const randomeTop = await getVideoRating();
        setRandomTop(randomeTop!);
        setOnlineTop(onlineTop!);
      };
      fetchData();
    }
  };

  return (
    <div className="flex justify-end px-6 py-4">
      <div className="flex gap-4">
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-transform"
        >
          Add Model
        </button>
        <button
          onClick={() => router.push("/page2")}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-transform"
        >
          Go to Page 2
        </button>
        <button
          onClick={handleRandomVideo}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-transform"
        >
          Random Video
        </button>
        <button
          onClick={() => window.open(cheekLink, "_blank")}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-transform"
        >
          Visit Site
        </button>
      </div>
    </div>
  );
};
