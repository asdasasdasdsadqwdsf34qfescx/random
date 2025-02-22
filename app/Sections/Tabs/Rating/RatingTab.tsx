import { VideoModel } from "@/app/types";

export const RatingTab = ({
  setCurrentVideo,
  setSelectedVideoIndex,
  videoDetails,
}: {
  setCurrentVideo: (value: any) => void;
  setSelectedVideoIndex: (value: any) => void;
  videoDetails: VideoModel[];
}) => {
  const getRankStyle = (rank: number) => {
    const baseClasses =
      "p-4 rounded-lg flex justify-between items-center cursor-pointer transition transform hover:-translate-y-1 duration-300 ease-in-out border";
    
    switch (true) {
      case rank === 1:
        return {
          className: `${baseClasses} bg-white border-yellow-500 shadow-xl`,
          emoji: "👑",
          textColor: "text-yellow-600",
          ratingColor: "text-yellow-700",
        };
      case rank >= 2 && rank <= 4:
        return {
          className: `${baseClasses} bg-white border-gray-400 shadow-md`,
          emoji: "🥈",
          textColor: "text-gray-700",
          ratingColor: "text-gray-800",
        };
      case rank >= 5 && rank <= 10:
        return {
          className: `${baseClasses} bg-white border-amber-500 shadow`,
          emoji: "⭐",
          textColor: "text-amber-600",
          ratingColor: "text-amber-700",
        };
      default:
        return {
          className: `${baseClasses} bg-white border-gray-300 hover:bg-gray-50`,
          emoji: "🎬",
          textColor: "text-gray-600",
          ratingColor: "text-gray-700",
        };
    }
  };

  return (
    <ul className="scrollbar-hide space-y-4 max-h-[750px] overflow-y-auto pr-2">
      {videoDetails.length ? (
        videoDetails.map((video, index) => {
          const rank = index + 1;
          const { className, emoji, textColor, ratingColor } = getRankStyle(rank);
          return (
            <li
              key={video.id}
              className={className}
              onClick={() => {
                setCurrentVideo(video);
                setSelectedVideoIndex(0);
              }}
            >
              <div className="flex items-center gap-3">
                <span className={`text-2xl ${textColor}`}>{emoji}</span>
                <span className={`${textColor} font-medium truncate`}>
                  <span className="text-inherit">{rank}.</span> {video.name || "Unknown Video"}
                </span>
              </div>
              <span className={`${ratingColor} font-bold text-lg`}>
                {video.averageRating}
              </span>
            </li>
          );
        })
      ) : (
        <p className="text-gray-500 text-center py-8">No videos available</p>
      )}
    </ul>
  );
};
