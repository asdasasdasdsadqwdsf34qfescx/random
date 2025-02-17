import { update } from "@/app/ids";
import { VideoModel } from "@/app/types";
import { XMarkIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { SetStateAction, useEffect, useState } from "react";

export const EditCurrentModel = ({
  setVideoDetails,
  setCurrentVideo,
  setShowEditModal,
  setEditedModel,
  currentVideo,
  showEditModal,
  editedModel,
}: {
  showEditModal: boolean;
  setVideoDetails: (value: SetStateAction<VideoModel[]>) => void;
  setCurrentVideo: (value: any) => void;
  setShowEditModal: (value: any) => void;
  setEditedModel: (value: any) => void;
  currentVideo: VideoModel | null;
  editedModel: VideoModel | null;
}) => {
  const [modalPosition, setModalPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - modalPosition.x,
      y: e.clientY - modalPosition.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setModalPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div>
      <button
        onClick={() => {
          setEditedModel(currentVideo);
          setShowEditModal(true);
        }}
        className="px-4 py-4 text-sm rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 text-white font-bold border-2 border-emerald-500/30 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group"
      >
        <span className="relative z-10 flex items-center gap-2">
          <PencilSquareIcon className="w-5 h-5" />
          Edit Model
        </span>
      </button>
      {showEditModal && currentVideo && (
        <div
          className="fixed z-50 rounded-xl shadow-2xl"
          style={{
            left: `${modalPosition.x}px`,
            top: `${modalPosition.y}px`,
            transform: "translate(0, 0)",
          }}
        >
          <div className="bg-gray-800 rounded-xl w-full max-w-2xl border border-gray-700">
            <div
              className="flex items-center justify-between p-4 border-b border-gray-700 cursor-move"
              onMouseDown={handleMouseDown}
            >
              <h2 className="text-xl font-bold text-amber-400">
                Edit Model Details
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 hover:bg-gray-700 rounded-full transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await update(editedModel!);
                setVideoDetails((prev) =>
                  prev.map((video) =>
                    video.id === editedModel?.id
                      ? { ...video, ...editedModel }
                      : video
                  )
                );
                if (currentVideo?.id === editedModel?.id) {
                  setCurrentVideo({ ...currentVideo, ...editedModel });
                }
                setShowEditModal(false);
              }}
              className="max-h-[70vh] overflow-y-auto p-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-amber-100">
                      Name *
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50 outline-none transition"
                      value={editedModel!.name}
                      onChange={(e) =>
                        setEditedModel({
                          ...editedModel!,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-amber-100">
                      Video IDs (comma separated) *
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50 outline-none transition"
                      value={editedModel!.videoId.join(", ")}
                      onChange={(e) =>
                        setEditedModel({
                          ...editedModel!,
                          videoId: e.target.value
                            .split(",")
                            .map((id) => id.trim()),
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    ["Brest", "brest"],
                    ["Nipples", "nipples"],
                    ["Legs", "legs"],
                    ["Ass", "ass"],
                    ["Face", "face"],
                    ["Pussy", "pussy"],
                    ["Overall", "overall"],
                    ["Voice", "voice"],
                    ["Content", "content"],
                    ["Eyes", "eyes"],
                    ["Lips", "lips"],
                    ["Waist", "waist"],
                    ["Wife", "wife"],
                    ["Hair", "haire"],
                    ["Nails", "nails"],
                    ["Skin", "skin"],
                    ["Hands", "hands"],
                    ["Rear", "rear"],
                    ["Front", "front"],
                    ["Ears", "ears"],
                    ["Height", "height"],
                    ["Weight", "weight"],
                    ["Nose", "nose"],
                  ].map(([label, key]) => (
                    <div key={key} className="space-y-1">
                      <label className="text-sm text-amber-100">{label}</label>
                      <select
                        className="w-full p-2 bg-gray-700 rounded-md border border-gray-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 outline-none transition"
                        value={editedModel![key as keyof typeof editedModel]}
                        onChange={(e) =>
                          setEditedModel({
                            ...editedModel!,
                            [key]: parseInt(e.target.value),
                          })
                        }
                      >
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(
                          (value) => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
