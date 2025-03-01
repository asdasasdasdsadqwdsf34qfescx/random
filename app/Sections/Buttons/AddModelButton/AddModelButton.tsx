import { add, getData } from "@/app/ids";
import { defaultNewModel, VideoModel } from "@/app/types";

export const AddModelButton = ({
  newModel,
  setVideoDetails,
  setCurrentVideo,
  setShowAddModal,
  setNewModel,
}: {
  newModel: typeof defaultNewModel;
  setVideoDetails: (value: any) => void;
  setCurrentVideo: (value: any) => void;
  setShowAddModal: (value: any) => void;
  setNewModel: (value: any) => void;
}) => {
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Use newModel from state rather than a static constant
      await add(newModel);

      const details = await getData();
      if (details) {
        setVideoDetails(details);
        setCurrentVideo(details[0]);
      }

      setShowAddModal(false);
      setNewModel(defaultNewModel);
    } catch (error) {
      console.error("Error adding model:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900/95 to-purple-900/30 backdrop-blur-sm flex items-center justify-center p-4 ">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-xl w-full max-w-4xl max-h-[90vh] mx-auto shadow-2xl border border-gray-700/50 transform transition-all overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400  bg-clip-text rounded-lg">
            ✨ Add New Model
          </h2>
          <button
            onClick={() => setShowAddModal(false)}
            className="text-gray-400 hover:text-purple-400 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleAddSubmit} className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="bg-gray-800/30 p-5 rounded-xl border border-gray-700/50">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-purple-300">
                📝 Basic Information
              </h3>

              <div className="space-y-5">
                <div className="relative">
                  <label className="text-sm text-gray-300 mb-1 block">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2.5 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-900 transition-all"
                    value={newModel.name}
                    onChange={(e) =>
                      setNewModel({ ...newModel, name: e.target.value })
                    }
                  />
                </div>

                <div className="relative">
                  <label className="text-sm text-gray-300 mb-1 block">
                    Video IDs *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2.5 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-900 transition-all"
                    value={newModel.videoId.join(", ")}
                    onChange={(e) =>
                      setNewModel({
                        ...newModel,
                        videoId: e.target.value.split(",").map((id) => id.trim()),
                      })
                    }
                    placeholder="comma separated IDs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
        
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Face Features */}
            <div className="bg-gray-800/30 p-5 rounded-xl border border-gray-700/50">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-pink-300">
                👩 Face Features
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[["Face", "face"]].map(([label, key]) => (
                  <div key={key} className="relative">
                    <label className="text-sm text-gray-300 mb-1 block">
                      {label}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      required
                      className="w-full px-4 py-2.5 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-900 transition-all"
                      value={newModel[key as keyof typeof newModel]}
                      onChange={(e) =>
                        setNewModel({
                          ...newModel,
                          [key]: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Body Features */}
            <div className="bg-gray-800/30 p-5 rounded-xl border border-gray-700/50">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-300">
                💪 Body Features
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  ["Brest", "brest"],
                  ["Ass", "ass"],
                  ["Height", "height"],
                ].map(([label, key]) => (
                  <div key={key} className="relative">
                    <label className="text-sm text-gray-300 mb-1 block">
                      {label}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      required
                      className="w-full px-4 py-2.5 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-900 transition-all"
                      value={newModel[key as keyof typeof newModel]!}
                      onChange={(e) =>
                        setNewModel({
                          ...newModel,
                          [key]: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Features */}
            <div className="bg-gray-800/30 p-5 rounded-xl border border-gray-700/50">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-300">
                ✨ Additional Features
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  ["Content", "content"],
                  ["Overall", "overall"],
                ].map(([label, key]) => (
                  <div key={key} className="relative">
                    <label className="text-sm text-gray-300 mb-1 block">
                      {label}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      required
                      className="w-full px-4 py-2.5 bg-gray-800 rounded-lg border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-900 transition-all"
                      value={newModel[key as keyof typeof newModel]!}
                      onChange={(e) =>
                        setNewModel({
                          ...newModel,
                          [key]: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="lg:col-span-2 pt-6 border-t border-gray-700/50">
            <div className="flex justify-end gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg font-medium hover:scale-[1.02] transition-transform shadow-lg hover:shadow-purple-500/20"
              >
                Add Model 🌟
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
