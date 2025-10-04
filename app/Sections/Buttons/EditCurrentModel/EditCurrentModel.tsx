import { deleteModel } from "@/app/api";
import { updateRanks } from "@/app/ids";
import { VideoModel } from "@/app/types";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export const EditCurrentModel = ({
  setShowEditModal,
  showEditModal,
  currentModel,
}: {
  showEditModal: boolean;
  setShowEditModal: (value: any) => void;
  currentModel: VideoModel | null;
  setCurrentModel: (value: any) => void;
}) => {
  const [modalPosition, setModalPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [editedModel, setEditedModel] = useState<VideoModel | null>(null);
  const [newName , setNewName]= useState<string | null>(null);

  // Initialize editedModel when modal opens
  useEffect(() => {
    if (showEditModal && currentModel) {
      setEditedModel(currentModel);
    }
  }, [showEditModal, currentModel]);

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

  const deleteM = () => {
    deleteModel(Number(currentModel!.id))
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
  }, [isDragging, dragStart]);

  // Uniform class for buttons
  const buttonClass =
    "px-3 py-1 rounded-full bg-gray-800 text-white text-sm font-bold shadow-lg hover:bg-gray-700 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div>
      <button
        onClick={() => {
          setShowEditModal(true);
        }}
        className={buttonClass}
      >
        <span className="flex items-center gap-2">Edit Model</span>
      </button>
      <button
        onClick={() => {
          deleteM()
        }}
        className={buttonClass}
      >
        <span className="flex items-center gap-2">Delete</span>
      </button>
      {showEditModal && editedModel && (
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
                <XMarkIcon className="h-5 w-5 text-white" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await updateRanks(editedModel);
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
                      value={editedModel.name}
                      onChange={(e) =>
                        setEditedModel({
                          ...editedModel,
                          name: e.target.value,
                        })
                      }
                    />
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
