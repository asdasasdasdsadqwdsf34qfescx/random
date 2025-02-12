import DetailsSection from "@/app/Details";
import { update } from "@/app/ids";
import { useVideoContext } from "@/app/UseState/useStates";
import { ReactNode } from "react";

export const DetailsTab = () => {
 const {
    setEditedModel,
    setVideoDetails,
    setShowEditModal,
    currentVideo,
    showEditModal,
    editedModel,
    setOnlineTop,
    setCurrentVideo,
    setSelectedVideoIndex,
    setOnlineModels,
  } = useVideoContext();


  return (
    <div>
      <DetailsSection currentVideoDetails={currentVideo!} />
      <button
        onClick={() => {
          setEditedModel(currentVideo);
          setShowEditModal(true);
        }}
        className="mt-4 px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 transition"
      >
        Edit Model Details
      </button>
      {showEditModal && currentVideo && (
        <div className="fixed inset-10 bg-black bg-opacity-20 flex items-start justify-start p-4 z-50 overflow-y-auto">
          <div className="bg-gray-800 p-1 rounded-lg max-w-2xl mx-4">
            <form
              onSubmit={async (e) => {
                e.preventDefault();

                // Update the model
                await update(editedModel!);

                // Find and update the modified model in the current state without re-fetching all data
                setVideoDetails((prev) =>
                  prev.map((video) =>
                    video.id === editedModel?.id
                      ? { ...video, ...editedModel }
                      : video
                  )
                );

                // Also update the current video if applicable
                if (currentVideo?.id === editedModel?.id) {
                  setCurrentVideo({ ...currentVideo, ...editedModel });
                }

                setShowEditModal(false);
              }}
              className="grid grid-cols-1 md:grid-cols-2 gap-1"
            >
              <div className="flex flex-col">
                <label className="text-sm mb-1">Name *</label>
                <input
                  type="text"
                  className="p-2 bg-gray-700 rounded-md "
                  value={editedModel!.name}
                  onChange={(e) =>
                    setEditedModel({
                      ...editedModel!,
                      name: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm mb-1">
                  Video IDs (comma separated) *
                </label>
                <input
                  type="text"
                  className="bg-gray-700 rounded-md text-sm"
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
                <div key={key} className="flex flex-col">
                  <label className="text-sm mb-1">{label}</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    className="p-2 bg-gray-700 rounded-md text-sm"
                    value={editedModel![key as keyof typeof editedModel]}
                    onChange={(e) =>
                      setEditedModel({
                        ...editedModel!,
                        [key]: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              ))}

              <div className="md:col-span-2 mt-4 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 transition text-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
};