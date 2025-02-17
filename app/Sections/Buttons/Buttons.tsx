import {
  getOnlineRating,
  getVideoRating,
  updateVideoCount,
} from "@/app/ids";
import { useState } from "react";
import { EditCurrentModel } from "./EditCurrentModel/EditCurrentModel";
import { AddModelButton } from "./AddModelButton/AddModelButton";
import { VideoModel } from "@/app/types";

export const ButtonsSection = ({
  setRandomTop,
  setOnlineTop,
  setNewModel,
  onlineModels,
  setCurrentVideo,
  setVideoDetails,
  setShowEditModal,
  setEditedModel,
  setSelectedVideoIndex,
  videoDetails,
  setShowAddModal,
  showEditModal,
  router,
  currentVideo,
  editedModel,
  showAddModal,
  newModel,
}: {
  setOnlineTop: (value: any) => void;
  setRandomTop: (value: any) => void;
  setEditedModel: (value: any) => void;
  setNewModel: (value: any) => void;
  onlineModels: any;
  setVideoDetails: (value: any) => void;
  setCurrentVideo: (value: any) => void;
  setShowEditModal: (value: any) => void;
  showEditModal: boolean;
  setSelectedVideoIndex: (value: number) => void;
  videoDetails: VideoModel[];
  currentVideo: VideoModel | null;
  editedModel: VideoModel | null;
  setShowAddModal: (value: boolean) => void;
  router: any;
  showAddModal: boolean;
  newModel: any;
}) => {
  const [showButtons, setShowButtons] = useState(false);

  const handleRandomVideo = async () => {
    if (videoDetails.length === 0) return;

    const randomModel =
      videoDetails[Math.floor(Math.random() * videoDetails.length)];
    setCurrentVideo(randomModel);
    updateVideoCount(randomModel.id!);
    setSelectedVideoIndex(0);

    const [onlineTop, randomTop] = await Promise.all([
      getOnlineRating(),
      getVideoRating(),
    ]);

    setRandomTop(randomTop!);
    setOnlineTop(onlineTop!);
  };

  return (
    <div>
      {/* Toggle Button */}
      <button
        onClick={() => setShowButtons(!showButtons)}
        className="fixed top-4 left-4 p-2 bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 text-white font-medium rounded-full shadow hover:scale-105 transition-transform flex items-center justify-center w-10 h-10 z-10"
      >
        {showButtons ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        )}
      </button>

      {/* Buttons Section */}
      {showButtons && (
        <div className="flex gap-2">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl shadow-lg w-56">
            <p className="text-sm">
              Total models:{" "}
              <span className="font-bold">{videoDetails.length}</span>
            </p>
            <p className="text-sm">
              Total online:{" "}
              <span className="font-bold">{onlineModels.length}</span>
            </p>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-1 rounded-xl shadow-lg w-56">
            <p className="text-sm">
              Name: <span className="font-bold">{currentVideo?.name}</span>
            </p>
            <p className="text-sm">
              Rate:{" "}
              <span className="font-bold">{currentVideo?.averageRating} </span>
              <span>  Place </span>
              <span className="font-bold">{videoDetails.indexOf(currentVideo!) + 1}</span>
            </p>
            <p className="text-sm">
              Randome:{" "}
              <span className="font-bold">{currentVideo?.videoCount}</span>
            </p>
            <p className="text-sm">
              Online:{" "}
              <span className="font-bold">{currentVideo?.onlineCount}</span>
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-4 text-sm rounded-lg bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-800 text-white font-bold border-2 border-emerald-500/30 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-emerald-100"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add Model
            </span>
          </button>

          <button
            onClick={handleRandomVideo}
            className="px-4 py-4 text-sm rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 text-white font-bold border-2 border-emerald-500/30 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg
                className="w-4 h-4 text-emerald-100"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Random Model
            </span>
          </button>
        </div>
      )}

      {showAddModal && (
        <AddModelButton
          setVideoDetails={setVideoDetails}
          setCurrentVideo={setCurrentVideo}
          setShowAddModal={setShowAddModal}
          setNewModel={setNewModel}
          newModel={newModel}
        />
      )}
    </div>
  );
};
