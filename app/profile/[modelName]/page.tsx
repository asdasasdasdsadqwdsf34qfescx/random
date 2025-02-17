"use client";

import { getById, update } from "@/app/ids";
import { VideoModel } from "@/app/types";
import { useParams, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { FiInstagram, FiVideo, FiStar, FiUsers, FiTrash2 } from "react-icons/fi";

const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-gray-700 ${className}`} />
);

const ModelProfile = () => {
  const { modelName } = useParams();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [currentModel, setCurrentModel] = useState<VideoModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [newVideoLink, setNewVideoLink] = useState("");
  const [showAddInput, setShowAddInput] = useState(false); // State to toggle input visibility

  useEffect(() => {
    const getModel = async () => {
      try {
        const model = await getById(Number(id));
        setCurrentModel({ ...model, links: model.links || [] }); // Ensure `links` is initialized as an array
      } catch (error) {
        console.error("Error fetching model:", error);
      } finally {
        setLoading(false);
      }
    };

    getModel();
  }, [id]);

  const handleAddVideo = async () => {
    if (!newVideoLink.trim()) {
      alert("Please enter a valid video link.");
      return;
    }
    if (!currentModel) return;

    const updatedLinks = [...currentModel.links, newVideoLink];
    const updatedModel = { ...currentModel, links: updatedLinks };

    try {
      await update(updatedModel);
      setCurrentModel(updatedModel);
      setNewVideoLink(""); // Clear the input
      setShowAddInput(false); // Hide input after adding
    } catch (error) {
      console.error("Error adding video:", error);
    }
  };

  const handleRemoveVideo = async (index: number) => {
    if (!currentModel) return;

    const updatedLinks = currentModel.links.filter((_, i) => i !== index);
    const updatedModel = { ...currentModel, links: updatedLinks };

    try {
      await update(updatedModel);
      setCurrentModel(updatedModel);
    } catch (error) {
      console.error("Error removing video:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-8 w-1/3 mb-6 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!currentModel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
        <p className="text-lg">Model not found or failed to load.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          {/* Profile Info */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-4">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400">{modelName}</h1>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  currentModel.isOnline ? "bg-green-500/20 text-green-400" : "bg-gray-500/20"
                }`}
              >
                {currentModel.isOnline ? "Online" : "Offline"}
              </span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <FiStar className="w-6 h-6 text-yellow-400" />
                  <div>
                    <p className="text-2xl font-bold">{currentModel.averageRating}</p>
                    <p className="text-sm text-white/60">Rating</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <FiUsers className="w-6 h-6 text-blue-400" />
                  <div>
                    <p className="text-2xl font-bold">{currentModel.onlineCount}</p>
                    <p className="text-sm text-white/60">Online count</p>
                  </div>
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-xl backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <FiVideo className="w-6 h-6 text-blue-400" />
                  <div>
                    <p className="text-2xl font-bold">{currentModel.videoCount}</p>
                    <p className="text-sm text-white/60">Random count</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Video Management */}
        <div className="space-y-6">
          <h2 className="rounded-xl text-3xl font-bold bg-clip-text bg-gradient-to-r from-blue-400">
            <span className="p-2">Manage Videos</span>
          </h2>

          <div>
            <button
              onClick={() => setShowAddInput(!showAddInput)}
              className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {showAddInput ? "Cancel" : "Add Video"}
            </button>
          </div>

          {showAddInput && (
            <div className="flex gap-4">
              <input
                type="text"
                value={newVideoLink}
                onChange={(e) => setNewVideoLink(e.target.value)}
                placeholder="Enter video link..."
                className="w-full p-2 rounded-lg bg-gray-800 text-white"
              />
              <button
                onClick={handleAddVideo}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Save
              </button>
            </div>
          )}

          {currentModel.links && currentModel.links.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentModel.links.map((link, index) => (
                <div key={index} className="relative group">
                  <a href={link} className="block overflow-hidden rounded-2xl">
                    <iframe
                      src={link}
                      frameBorder="0"
                      width="100%"
                      height="250"
                      className="w-full aspect-video rounded-lg shadow-xl border border-gray-700"
                      allowFullScreen
                      title={`Video ${index + 1}`}
                    ></iframe>
                  </a>
                  <button
                    onClick={() => handleRemoveVideo(index)}
                    className="absolute top-2 right-2 p-2 bg-red-500 rounded-full hover:bg-red-600"
                  >
                    <FiTrash2 className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-lg text-white/60">No videos available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelProfile;