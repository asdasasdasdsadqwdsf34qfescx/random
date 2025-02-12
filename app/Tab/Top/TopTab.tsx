import { useVideoContext } from "@/app/UseState/useStates";

export const TopTab = () => {
 const {
  onlineTop,
  previousOnlineTop,
  } = useVideoContext();


  return (
    <ul className="space-y-2 overflow-auto h-[750px] scrollbar-hide">
      {onlineTop.length ? (
        onlineTop.map((video, index) => {
          const positionChange = previousOnlineTop.find(
            (prevVideo) => prevVideo.id === video.id
          );
          const change = positionChange?.onlineCount ?? 0;
          return (
            <li
              key={video.id}
              className="p-3 bg-gray-700 rounded-lg flex justify-between items-center cursor-pointer hover:scale-[1.03] transition-transform duration-300 ease-in-out border border-gray-600"
            >
              <span className="text-white font-medium">
                {index + 1}. {video.name || "Unknown Video"}
              </span>
              <span className="text-yellow-300 font-semibold flex items-center">
                {video.onlineCount}
                {change > 0 && (
                  <span className="text-green-500 ml-2">
                    ↑ {Math.abs(change)}
                  </span>
                )}
                {change < 0 && (
                  <span className="text-red-500 ml-2">
                    ↓ {Math.abs(change)}
                  </span>
                )}
              </span>
            </li>
          );
        })
      ) : (
        <p>No videos available.</p>
      )}
    </ul>
  )
};