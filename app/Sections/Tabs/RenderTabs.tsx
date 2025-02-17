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
        return (
          <DetailTab
            currentVideo={currentVideo}
          />
        );
        case "random":
          return (
            <ul className="space-y-2 overflow-auto h-[750px] scrollbar-hide">
              {randomTop.length ? (
                randomTop.map((video, index) => {
                  let oldScore = 0;
                   previousRandomTop.map(
                    (prevVideo) => {
                      if(prevVideo.id === video.id){
                        oldScore = prevVideo.videoCount
                      }
                    }
                  );
                  
                  const countChange = video.videoCount - oldScore 
                  return (
                    <li
                      key={video.id}
                      className="p-3 bg-gray-700 rounded-lg flex justify-between items-center cursor-pointer hover:scale-[1.03] transition-transform duration-300 ease-in-out border border-gray-600"
                    >
                      <span className="text-white font-medium">
                        {index + 1}. {video.name || "Unknown Video"}
                      </span>
                      <span className="text-yellow-300 font-semibold flex items-center">
                        {video.videoCount}
                        {countChange > 0 && (
                          <span className="text-green-500 ml-2">↑ {countChange}</span>
                        )}
                      </span>
                    </li>
                  );
                })
              ) : (
                <p>No videos available.</p>
              )}
            </ul>
          );
      case "top":
        return (
          <ul className="space-y-2 overflow-auto h-[750px] scrollbar-hide">
            {onlineTop.length ? (
              onlineTop.map((video, index) => {
                const positionChange = previousRandomTop.find(
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
        );
      default:
        return null;
    }
  };
  return (
    <section className="w-full max-w-md p-4 bg-gray-800 rounded-lg shadow-lg h-full overflow-hidden">
      <div className="flex justify-between items-center mb-4 border-b border-gray-700">
        {["ratings", "online", "details", "random", "top"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 text-white ${
              activeTab === tab ? "border-b-2 border-purple-500" : ""
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <div className="mt-4">{renderTabContent()}</div>
    </section>
  );
};
