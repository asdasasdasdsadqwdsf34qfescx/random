import { VideoModel } from "@/app/types";

interface OnlineTabProps {
  setCurrentVideo: (value: any) => void;
  setSelectedVideoIndex: (value: any) => void;
  onlineModels: VideoModel[];
}

export const OnlineTab: React.FC<OnlineTabProps> = ({
  setCurrentVideo,
  setSelectedVideoIndex,
  onlineModels,
}) => {
  return (
    <ul className="scrollbar-hide max-h-[calc(100vh-200px)] space-y-4 overflow-y-auto p-6 bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-xl shadow-2xl border border-[#D4AF37]">
      {onlineModels.length ? (
        onlineModels.map((model) => (
          <li
            key={model.id}
            className="p-5 bg-gray-800 rounded-xl flex justify-between items-center cursor-pointer transition-all duration-300 transform hover:scale-105 hover:bg-gray-700 shadow-lg hover:shadow-2xl border border-gray-600 hover:border-[#D4AF37]"
            onClick={() => {
              setCurrentVideo(model);
              setSelectedVideoIndex(0);
            }}
          >
            <span className="font-bold text-xl text-white">{model.name}</span>
            <span className="text-green-400 font-medium text-sm bg-green-800 bg-opacity-20 px-4 py-1 rounded-full shadow-inner">
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
