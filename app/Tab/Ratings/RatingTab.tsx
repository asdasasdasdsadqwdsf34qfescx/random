import { useVideoContext } from "@/app/UseState/useStates";

export const RatingTab = () => {
 const {
  currentVideo,
  setShowVideo,
  showVideo
  } = useVideoContext();


  return (
    <div>
    {currentVideo?.isOnline && (
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => setShowVideo(true)}
          className={`px-4 py-2 rounded-md text-white text-sm font-semibold transition ${
            showVideo
              ? "bg-purple-700 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-500"
          }`}
          disabled={showVideo}
        >
          Switch to Chaturbate
        </button>
        <button
          onClick={() => setShowVideo(false)}
          className={`ml-1 px-4 py-2 rounded-md text-white text-sm font-semibold transition ${
            !showVideo
              ? "bg-green-700 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-500"
          }`}
          disabled={!showVideo}
        >
          Switch to Vimeo
        </button>
      </div>
    )}
    </div>
  );
};