import { useVideoContext } from "@/app/UseState/useStates";

export const OnlineTab = () => {
 const {
  onlineModels,
  setCurrentVideo,
  setSelectedVideoIndex
  } = useVideoContext();


  return (
    <ul className="space-y-2 overflow-y-auto max-h-96">
      {onlineModels.length ? (
        onlineModels.map((model) => (
          <li
            key={model.id}
            className="p-3 bg-gray-700 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-600"
            onClick={() => {
              setCurrentVideo(model);
              setSelectedVideoIndex(0);
            }}
          >
            <span className="font-medium">{model.name}</span>
            <span className="text-green-400">Online</span>
          </li>
        ))
      ) : (
        <p className="text-gray-400">No models are currently online.</p>
      )}
    </ul>
  );
};