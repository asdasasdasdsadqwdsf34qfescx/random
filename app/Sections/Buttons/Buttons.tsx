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

  return (
    <div>
      {/* Toggle Button */}
    

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
        

          
        </div>
      )}

      {showAddModal && (
        <AddModelButton
          setShowAddModal={setShowAddModal}
        />
      )}
    </div>
  );
};
