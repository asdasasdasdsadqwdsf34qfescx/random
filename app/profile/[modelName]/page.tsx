"use client";

import Sidebar from "@/app/components/Sidebar";
import { getById, getData, update } from "@/app/ids";
import ModelRankingKanbanSearch from "@/app/ranks/[modelName]/KanbanBoard";
import { EditCurrentModel } from "@/app/Sections/Buttons/EditCurrentModel/EditCurrentModel";
import { VideoModel } from "@/app/types";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FiVideo, FiStar, FiUsers, FiTrash2, FiPlus, FiPlay } from "react-icons/fi";
import Draggable from "react-draggable";

const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-gray-700 ${className}`} />
);

const ModelProfile = () => {
  const { modelName } = useParams();
  const router = useRouter();
  const [currentModel, setCurrentModel] = useState<VideoModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [newVideoLink, setNewVideoLink] = useState("");
  const [showAddInput, setShowAddInput] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentIndexModel, setCurrentIndexModel] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // Stări pentru modalul video
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [modalVideoLink, setModalVideoLink] = useState("");

  useEffect(() => {
    const getModel = async () => {
      try {
        const model = await getById(modelName as string);
        setCurrentModel({ ...model, links: model.links || [] });

        const details = await getData();
        if (details) {
          const currentIndexModel = details.findIndex((model) => model.name === modelName);
          setCurrentIndexModel(currentIndexModel + 1);
        }
      } catch (error) {
        console.error("Error fetching model:", error);
      } finally {
        setLoading(false);
      }
    };

    getModel();
  }, [modelName]);

  const handleBangAddVideo = async () => {
    if (!newVideoLink.trim()) {
      alert("Please enter a valid video link.");
      return;
    }
    if (!currentModel) return;

    const updatedModel = { ...currentModel };

    try {
      await update(updatedModel);
      setCurrentModel(updatedModel);
    } catch (error) {
      console.error("Error adding video:", error);
    }
  };

  const handleRemovelink = async (index: number) => {
    if (!currentModel) return;

    const updatedLinks = currentModel.videoId.filter((_, i) => i !== index);
    const updatedModel = { ...currentModel, videoId: updatedLinks };

    try {
      await update(updatedModel);
      setCurrentModel(updatedModel);
    } catch (error) {
      console.error("Error removing video:", error);
    }
  };

  // Funcție pentru a deschide modalul video
  const handlePlayVideo = (link: string) => {
    setModalVideoLink(link);
    setShowVideoModal(true);
  };

  // Funcție pentru search
  const handleSearch = () => {
    if (searchTerm.trim()) {
      router.push(`/profile/${searchTerm.trim()}`);
    }
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-8">
        <Sidebar />
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
      <div className="flex items-center justify-center text-white">
        <p className="text-lg">Model not found or failed to load.</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Profile Header cu Search Bar pe partea dreaptă */}
        <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-bold from-cyan-400 to-blue-500 bg-clip-text">
                {modelName}
              </h1>
              <div
                className={`px-4 py-1 rounded-full backdrop-blur-sm ${
                  currentModel.isOnline
                    ? "bg-green-500/20 border border-green-500/30"
                    : "bg-gray-500/20"
                }`}
              >
                <span
                  className={`flex items-center ${
                    currentModel.isOnline ? "text-green-400" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${
                      currentModel.isOnline ? "bg-green-400 animate-pulse" : "bg-gray-400"
                    }`}
                  />
                  {currentModel.isOnline ? "Live Now" : "Offline"}
                </span>
              </div>
              
              <EditCurrentModel
                showEditModal={showEditModal}
                setShowEditModal={setShowEditModal}
                currentModel={currentModel}
                setCurrentModel={setCurrentModel}
              />
                  <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 rounded-lg bg-gray-800 text-white"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Caută
            </button>
          </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatCard
                icon={<FiStar className="w-6 h-6" />}
                value={currentIndexModel}
                label="Rank"
                gradient="from-amber-400 to-yellow-500"
              />
              <StatCard
                icon={<FiUsers className="w-6 h-6" />}
                value={currentModel.onlineCount}
                label="Online"
                gradient="from-purple-400 to-indigo-500"
              />
              <StatCard
                icon={<FiVideo className="w-6 h-6" />}
                value={currentModel.videoCount}
                label="Randomed"
                gradient="from-cyan-400 to-blue-500"
              />
            </div>
          </div>

        </div>

        {/* Kanban Board */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold from-cyan-400 to-blue-500 bg-clip-text">
            Performance Rankings
          </h2>
          <ModelRankingKanbanSearch
            modelName={modelName}
            setCurrentModel={setCurrentModel}
            setCurrentIndexModel={setCurrentIndexModel}
          />
        </div>

        {/* Video Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold from-purple-400 to-indigo-500 bg-clip-text">
              Exclusive Content
            </h2>
            <button
              onClick={() => setShowAddInput(!showAddInput)}
              className="flex items-center gap-2 px-4 py-2 from-purple-600 to-indigo-500 rounded-lg hover:scale-105 transition-transform"
            >
              <FiPlus className="w-5 h-5" />
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
                onClick={handleBangAddVideo}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Save
              </button>
            </div>
          )}

          {currentModel.videoId && currentModel.videoId.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentModel.videoId.map((link, index) => (
                <div key={index} className="relative group">
                  <div className="relative overflow-hidden rounded-2xl">
                    <iframe
                      src={link}
                      width="100%"
                      height="280"
                      scrolling="no"
                      allowFullScreen
                      className="pointer-events-none"
                    ></iframe>
                    {/* Butonul de play peste video */}
                    <button
                      onClick={() => handlePlayVideo(link)}
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiPlay className="w-10 h-10" />
                    </button>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemovelink(index);
                    }}
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

      {/* Fereastra draggable fără overlay care blochează fundalul */}
      {showVideoModal && (
        <Draggable>
          <div className="fixed z-50 top-20 left-20 bg-gray-900 p-4 rounded-lg">
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute top-2 right-2 text-white"
            >
              Close
            </button>
            <iframe
              src={modalVideoLink}
              width="560"
              height="315"
              scrolling="no"
              allowFullScreen
              className="rounded"
            ></iframe>
          </div>
        </Draggable>
      )}
    </div>
  );
};

const StatCard = ({
  icon,
  value,
  label,
  gradient,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  gradient: string;
}) => (
  <div className="bg-gray-800/40 backdrop-blur-sm p-4 rounded-xl border border-gray-700/50 hover:border-cyan-400/30 transition-all">
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-lg ${gradient}`}>{icon}</div>
      <div>
        <div className="text-2xl font-bold bg-clip-text">{value}</div>
        <div className="text-sm text-gray-400">{label}</div>
      </div>
    </div>
  </div>
);

export default ModelProfile;
