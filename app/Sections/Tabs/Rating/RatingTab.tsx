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
    const baseClasses = "p-3 rounded-lg flex justify-between items-center cursor-pointer hover:scale-[1.03] transition-all duration-300 ease-in-out border";

    switch(true) {
      case rank === 1:
        return {
          className: `${baseClasses} bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 border-yellow-600 shadow-lg shadow-yellow-500/40`,
          emoji: "👑",
          textColor: "text-yellow-900",
          ratingColor: "text-yellow-800"
        }
      case rank >= 2 && rank <= 4:
        return {
          className: `${baseClasses} bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 border-gray-600 shadow-md shadow-gray-500/30`,
          emoji: "🥈",
          textColor: "text-gray-100",
          ratingColor: "text-gray-200"
        }
      case rank >= 5 && rank <= 10:
        return {
          className: `${baseClasses} bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 border-amber-900 shadow-sm shadow-amber-500/20`,
          emoji: "⭐",
          textColor: "text-amber-100",
          ratingColor: "text-amber-300"
        }
      default:
        return {
          className: `${baseClasses} bg-gray-700 border-gray-600 hover:bg-gray-600`,
          emoji: "🎬",
          textColor: "text-gray-300",
          ratingColor: "text-yellow-400"
        }
    }
  }

  return (
    <ul className="space-y-2 overflow-auto h-[750px] scrollbar-hide pr-2">
      {videoDetails.length ? (
        videoDetails.map((video, index) => {
          const rank = index + 1
          const { className, emoji, textColor, ratingColor } = getRankStyle(rank)

          return (
            <li
              key={video.id}
              className={className}
              onClick={() => {
                setCurrentVideo(video)
                setSelectedVideoIndex(0)
              }}
            >
              <div className="flex items-center gap-3">
                <span className={`text-2xl ${textColor}`}>{emoji}</span>
                <span className={`${textColor} font-medium truncate`}>
                  <span className="text-inherit">{rank}.</span>{" "}
                  {video.name || "Unknown Video"}
                </span>
              </div>
              <span className={`${ratingColor} font-bold text-lg`}>
                {video.averageRating.toFixed(1)}
                <span className="text-sm ml-1 opacity-75">/10</span>
              </span>
            </li>
          )
        })
      ) : (
        <p className="text-gray-400 text-center py-8">No videos available 📭</p>
      )}
    </ul>
  )
}
