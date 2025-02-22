import DetailsSection from "@/app/Details";
import { SetStateAction } from "react";
import { RatingTab } from "./Rating/RatingTab";
import { OnlineTab } from "./Online/OnlineTab";
import { DetailTab } from "./Details/DetailTab";
import { VideoModel } from "@/app/types";

export const RenderTabs = ({
  setVideoDetails,
  setCurrentVideo,
  setActiveTab,
  setSelectedVideoIndex,
  setShowEditModal,
  setEditedModel,
  videoDetails,
  onlineModels,
  currentVideo,
  showEditModal,
  activeTab,
  editedModel,
  randomTop,
  previousRandomTop,
  onlineTop,
}: {
  showEditModal: boolean;
  setVideoDetails: (value: SetStateAction<VideoModel[]>) => void;
  setRandomTop: (value: any) => void;
  setOnlineTop: (value: any) => void;
  setCurrentVideo: (value: any) => void;
  setActiveTab: (value: any) => void;
  setSelectedVideoIndex: (value: any) => void;
  setShowEditModal: (value: any) => void;
  setEditedModel: (value: any) => void;
  activeTab: string;
  editedModel: VideoModel | null;
  currentVideo: VideoModel | null;
  videoDetails: VideoModel[];
  onlineModels: VideoModel[];
  randomTop: VideoModel[];
  previousRandomTop: VideoModel[];
  onlineTop: VideoModel[];
}) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case "ratings":
        return (
          <RatingTab
            setCurrentVideo={setCurrentVideo}
            setSelectedVideoIndex={setSelectedVideoIndex}
            videoDetails={videoDetails}
          />
        );
      case "online":
        return (
          <OnlineTab
            setCurrentVideo={setCurrentVideo}
            setSelectedVideoIndex={setSelectedVideoIndex}
            onlineModels={onlineModels}
          />
        );
      case "details":
        return <DetailTab currentVideo={currentVideo} />;
        case "random":
          return (
            <ul className="space-y-4 overflow-auto h-[750px] scrollbar-hide p-4 bg-gray-900 rounded-xl shadow-lg">
              {randomTop.length ? (
                randomTop.map((video, index) => {
                  let oldScore = 0;
                  previousRandomTop.forEach((prevVideo) => {
                    if (prevVideo.id === video.id) {
                      oldScore = prevVideo.videoCount;
                    }
                  });
                  const countChange = video.videoCount - oldScore;
                  // Stiluri premium pentru primele 3 locuri
                  const premiumStyle =
                    index === 0
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-700 shadow-2xl"
                      : index === 1
                      ? "bg-gradient-to-r from-gray-400 to-gray-600 shadow-xl"
                      : index === 2
                      ? "bg-gradient-to-r from-orange-500 to-orange-700 shadow-xl"
                      : "bg-gray-800";
                  return (
                    <li
                      key={video.id}
                      className={`p-4 ${premiumStyle} rounded-xl flex justify-between items-center cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out border border-gray-700`}
                    >
                      <span className="text-gray-200 font-semibold flex items-center">
                        {index + 1}. {video.name || "Unknown Video"}
                        {index === 0 && (
                          <span className="ml-2 text-yellow-300" title="Câștigător">
                            👑
                          </span>
                        )}
                      </span>
                      <span className="text-yellow-400 font-bold flex items-center">
                        {video.videoCount}
                        {countChange > 0 && (
                          <span className="text-green-400 ml-3">
                            ↑ {countChange}
                          </span>
                        )}
                      </span>
                    </li>
                  );
                })
              ) : (
                <p className="text-gray-400">No videos available.</p>
              )}
            </ul>
          );
        
        case "top":
          return (
            <ul className="space-y-4 overflow-auto h-[750px] scrollbar-hide p-4 bg-gray-900 rounded-xl shadow-lg">
              {onlineTop.length ? (
                onlineTop.map((video, index) => {
                  const positionChange = previousRandomTop.find(
                    (prevVideo) => prevVideo.id === video.id
                  );
                  const change = positionChange?.onlineCount ?? 0;
                  // Stiluri premium pentru primele 3 locuri
                  const premiumStyle =
                    index === 0
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-700 shadow-2xl"
                      : index === 1
                      ? "bg-gradient-to-r from-gray-400 to-gray-600 shadow-xl"
                      : index === 2
                      ? "bg-gradient-to-r from-orange-500 to-orange-700 shadow-xl"
                      : "bg-gray-800";
                  return (
                    <li
                      key={video.id}
                      className={`p-4 ${premiumStyle} rounded-xl flex justify-between items-center cursor-pointer hover:scale-105 transition-transform duration-300 ease-in-out border border-gray-700`}
                    >
                      <span className="text-gray-200 font-semibold flex items-center">
                        {index + 1}. {video.name || "Unknown Video"}
                        {index === 0 && (
                          <span className="ml-2 text-yellow-300" title="Câștigător">
                            👑
                          </span>
                        )}
                      </span>
                      <span className="text-yellow-400 font-bold flex items-center">
                        {video.onlineCount}
                        
                      </span>
                    </li>
                  );
                })
              ) : (
                <p className="text-gray-400">No videos available.</p>
              )}
            </ul>
          );
        
      default:
        return null;
    }
  };

  return (
    <section className="w-full max-w-lg p-6 bg-gray-900 rounded-2xl shadow-2xl h-full overflow-hidden">
      <div className="flex justify-around items-center mb-6 border-b border-gray-700 pb-3">
        {["ratings", "online", "details", "random", "top"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-5 text-lg font-medium text-gray-300 transition-colors duration-300 ${
              activeTab === tab
                ? "border-b-4 border-yellow-500 text-white"
                : "hover:text-white"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <div className="mt-6">{renderTabContent()}</div>
    </section>
  );
};
