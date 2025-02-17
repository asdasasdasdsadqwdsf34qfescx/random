import { VideoModel } from "@/app/types";


export const OnlineTab = ({
  setCurrentVideo,
  setSelectedVideoIndex,
  onlineModels,
}: {
  setCurrentVideo: (value: any) => void;
  setSelectedVideoIndex: (value: any) => void;
  onlineModels: VideoModel[];
}) => {
  return (
    <ul className="scrollbar-hide space-y-4 overflow-y-auto h-[750px] p-4 bg-gradient-to-b from-gray-800 to-black rounded-xl shadow-2xl border border-gray-700">
      {onlineModels.length ? (
        onlineModels.map((model) => (
          <li
            key={model.id}
            className="p-4 bg-gray-800 rounded-lg flex justify-between items-center cursor-pointer transition-transform duration-300 hover:scale-105 hover:bg-gray-700 shadow-lg hover:shadow-xl border border-gray-600"
            onClick={() => {
              setCurrentVideo(model);
              setSelectedVideoIndex(0);
            }}
          >
            <span className="font-semibold text-lg text-white">{model.name}</span>
            <span className="text-green-400 font-medium text-sm bg-green-800 bg-opacity-20 px-3 py-1 rounded-full shadow-inner">
              Online
            </span>
          </li>
        ))
      ) : (
        <p className="text-gray-400 text-center text-lg font-light">
          No models are currently online.
        </p>
      )}
    </ul>
  );
};
