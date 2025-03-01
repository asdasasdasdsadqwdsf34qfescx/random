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

  const extractSrcFromIframe = (input: string): string => {
    const regex = /src\s*=\s*"([^"]+)"/i;
    const match = input.match(regex);
    return match ? match[1] : input;
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

  // Clasă uniformă pentru toate butoanele
  const buttonClass =
    "px-3 py-1 rounded-full bg-gray-800 text-white text-sm font-bold shadow-lg hover:bg-gray-700 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div>
      <button
        onClick={() => {
          setEditedModel(currentVideo);
          setShowEditModal(true);
        }}
        className={buttonClass}
      >
        <span className="flex items-center gap-2">Edit Model</span>
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
              ></button>
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
                      Instagram
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50 outline-none transition"
                      value={editedModel!.instagram ?? ""}
                      onChange={(e) =>
                        setEditedModel({
                          ...editedModel!,
                          instagram: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-amber-100">
                      Video IDs *
                    </label>
                    {editedModel?.videoId.map((id, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <input
                          type="text"
                          className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50 outline-none transition"
                          value={id}
                          onChange={(e) => {
                            let value = e.target.value;
                            // Pentru modificări normale pe un singur link
                            if (value.includes("mega.nz/file/")) {
                              value = value.replace(
                                "mega.nz/file/",
                                "mega.nz/embed/"
                              );
                            }
                            const newVideoIds = [...editedModel.videoId];
                            newVideoIds[index] = value;
                            setEditedModel({
                              ...editedModel,
                              videoId: newVideoIds,
                            });
                          }}
                          onPaste={(e) => {
                            // Interceptăm evenimentul de paste
                            e.preventDefault();
                            const pastedData = e.clipboardData.getData("text");
                            // Împărțim textul pe linii și filtrăm eventualele linii goale
                            let links = pastedData
                              .split(/\r?\n/)
                              .map((link) => link.trim())
                              .filter((link) => link !== "");

                            // Convertim fiecare link din formatul "file" în "embed" dacă este cazul
                            links = links.map((link) =>
                              link.includes("mega.nz/file/")
                                ? link.replace(
                                    "mega.nz/file/",
                                    "mega.nz/embed/"
                                  )
                                : link
                            );

                            // Înlocuim elementul curent și inserăm linkurile rezultate
                            const newVideoIds = [...editedModel.videoId];
                            newVideoIds.splice(index, 1, ...links);
                            setEditedModel({
                              ...editedModel,
                              videoId: newVideoIds,
                            });
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            // Elimină Video ID-ul de la indexul curent
                            const newVideoIds = editedModel.videoId.filter(
                              (_, i) => i !== index
                            );
                            setEditedModel({
                              ...editedModel,
                              videoId: newVideoIds,
                            });
                          }}
                          className="p-1 hover:bg-gray-700 rounded-full transition-colors"
                        >
                          <XMarkIcon className="h-5 w-5 text-red-500" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setEditedModel({
                          ...editedModel,
                          videoId: [...editedModel!.videoId, ""],
                        })
                      }
                      className="px-3 py-1 rounded-full bg-gray-800 text-white text-sm font-bold shadow-lg hover:bg-gray-700 transition transform hover:scale-105"
                    >
                      <PencilSquareIcon className="h-5 w-5 inline-block mr-1" />
                      Adaugă Video ID
                    </button>
                  </div>
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
