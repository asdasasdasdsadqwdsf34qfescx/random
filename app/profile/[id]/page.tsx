"use client";

import Sidebar from "@/app/components/Sidebar";
import { getModelById,  } from "@/app/ids";
import { EditCurrentModel } from "@/app/Sections/Buttons/EditCurrentModel/EditCurrentModel";
import { VideoModel } from "@/app/types";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import {
  FiVideo,
  FiStar,
  FiUsers,
  FiTrash2,
  FiPlus,
  FiPlay,
  FiChevronDown,
} from "react-icons/fi";
import Draggable from "react-draggable";
import Link from "next/link";

const getTailwindBgClassForScore = (score: number) => {
  if (score <= 20) return "bg-gray-700";
  if (score <= 30) return "bg-gray-700";
  if (score <= 40) return "bg-gray-600";
  if (score <= 50) return "bg-gray-500";
  if (score <= 60) return "bg-gray-400";
  if (score <= 70) return "bg-red-300"; // Using bg-green-700 for the middle range.
  if (score <= 80) return "bg-red-400";
  if (score <= 90) return "bg-red-500";
  if (score <= 100) return "bg-red-700";
  return "bg-green-500";
};

const CATEGORIES = [
  { name: "100", pts: 100 },
  { name: "90", pts: 90 },
  { name: "80", pts: 80 },
  { name: "70", pts: 70 },
  { name: "60", pts: 60 },
  { name: "50", pts: 50 },
  { name: "40", pts: 40 },
  { name: "30", pts: 30 },
  { name: "20", pts: 20 },
  { name: "0", pts: 0 },
];

const RANKING_KEYS: (keyof VideoModel)[] = [
  "brest",
  "ass",
  "face",
  "wife",
  "height",
  "overall",
  "content",
  "hair",
  "body",
  "nipples",
  "legs",
  "pussy",
];

const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-gray-700 ${className}`} />
);

const fetchModel = (id: string) => getModelById({ id });

const ModelProfile = () => {
  const { id } = useParams();
  const router = useRouter();
  const [newVideoLink, setNewVideoLink] = useState("");
  const [showAddInput, setShowAddInput] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [modalVideoLink, setModalVideoLink] = useState("");

  // Use SWR to fetch model data and enable revalidation after updates.
  const { data: currentModel, mutate } = useSWR<VideoModel>(
    id ? `http://localhost:3001/model/by-id?id=${id}` : null,
    () => fetchModel(id as string),
    {
      revalidateOnFocus: false, // Disables refetching when window regains focus
      refreshInterval: 0, // Disables polling
    }
  );

  const handleBangAddVideo = async () => {
    if (!newVideoLink.trim() || !currentModel) {
      alert("Please enter a valid video link.");
      return;
    }

    try {
      // Split the input by newlines (or any delimiter you prefer) to support multiple links.
      const linksArray = newVideoLink
        .split(/\s+/) // splits by any whitespace (spaces, newlines, etc.)
        .map((link) => link.trim())
        .filter((link) => link.length > 0)
        .map((link) => {
          // If the link is a Mega file link, convert it to an embed link.
          if (link.includes("mega.nz/file/")) {
            return link.replace("mega.nz/file/", "mega.nz/embed/");
          }
          return link;
        });

      // Pass the array of converted links to updateLinks.
      await updateLinks(linksArray, Number(id));
      await mutate(); // refresh the model data
      setNewVideoLink("");
      setShowAddInput(false);
    } catch (error) {
      console.error("Error adding video:", error);
    }
  };

  const handleRemovelink = async (index: string) => {
    if (!currentModel) return;
    try {
      await mutate(); // refresh the model data
    } catch (error) {
      console.error("Error removing video:", error);
    }
  };

  const handlePlayVideo = (link: string) => {
    setModalVideoLink(link);
    setShowVideoModal(true);
  };

  const getCategoryForValue = (value: number) => {
    return CATEGORIES.find((c) => c.pts === value)?.name || "Novice 🌟";
  };

  // Handle a change in ranking selection.
  const handleCategoryChange = async (key: keyof VideoModel, value: string) => {
    if (!currentModel) return;
    const newPts = CATEGORIES.find((c) => c.name === value)?.pts || 0;
    const updatedModel = { ...currentModel, [key]: newPts };
    try {
      await updateRanks(updatedModel);
      mutate(); // refresh parent data after update
    } catch (error) {
      console.error("Error updating ranking:", error);
    }
  };

  // If data isn’t loaded yet, show a loading skeleton.
  if (!currentModel) {
    return (
      <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-8">
        <Sidebar />
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-8 w-1/3 mb-6 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
      <Sidebar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header Section */}
        <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center mb-12">
          {/* Avatar Section */}
          <div className="relative group w-full lg:w-auto">
            <div className="w-[400px] h-[350px] rounded-2xl overflow-hidden border-4 border-purple-500/30 shadow-xl">
          
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {currentModel.name}
              </h1>
              <div className="flex items-center gap-4">
                <div
                  className={`px-3 py-1 rounded-full ${
                    currentModel.isOnline ? "bg-green-500/20" : "bg-gray-500/20"
                  }`}
                >
                  <span
                    className={`flex items-center ${
                      currentModel.isOnline ? "text-green-400" : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`w-2 h-2 rounded-full mr-2 ${
                        currentModel.isOnline
                          ? "bg-green-400 animate-pulse"
                          : "bg-gray-400"
                      }`}
                    />
                    {currentModel.isOnline ? "Live Now" : "Offline"}
                  </span>
                </div>
                {/* <EditCurrentModel
                  currentModel={currentModel}
                  showEditModal={showEditModal}
                  setShowEditModal={setShowEditModal}
                /> */}
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl">
              <StatCard
                icon={<FiStar className="w-5 h-5" />}
                value={currentModel.place + 1}
                label="Global Rank"
                gradient="from-amber-400 to-yellow-500"
              />
              <StatCard
                icon={<FiVideo className="w-5 h-5" />}
                value={currentModel.videoCount}
                label="Videos"
                gradient="from-cyan-400 to-blue-500"
              />
            </div>

            <Link
              href={`/stats/${currentModel.id}`}
              className="inline-flex items-center px-4 py-2 bg-purple-600/30 hover:bg-purple-600/40 rounded-lg transition-colors border border-purple-500/30"
            >
              <span className="bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent">
                View Full Statistics →
              </span>
            </Link>
          </div>
        </div>

        {/* Performance Ranking Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-6">
            Performance Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {RANKING_KEYS.map((key) => {
              const score = currentModel[key] as number;
              return (
                <div
                  key={key}
                  className={`p-4 rounded-xl ${getTailwindBgClassForScore(
                    score
                  )}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="capitalize font-medium">{key}</span>
                    </div>
                    <select
                      value={getCategoryForValue(score)}
                      onChange={(e) =>
                        handleCategoryChange(key, e.target.value)
                      }
                      className="bg-gray-800/40 backdrop-blur-sm px-3 py-1 rounded-lg border border-gray-600 hover:border-purple-400 transition-colors"
                    >
                      {CATEGORIES.map((c) => (
                        <option
                          key={c.name}
                          value={c.name}
                          className="bg-gray-800"
                        >
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Video Section */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
              Content Library
            </h2>
            <div className="flex gap-4 w-full sm:w-auto">
              <button
                onClick={() => setShowAddInput(!showAddInput)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600/30 hover:bg-purple-600/40 rounded-lg transition-colors border border-purple-500/30 w-full sm:w-auto"
              >
                <FiPlus className="w-5 h-5" />
                {showAddInput ? "Cancel" : "Add Content"}
              </button>
            </div>
          </div>

          {showAddInput && (
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <input
                type="text"
                value={newVideoLink}
                onChange={(e) => setNewVideoLink(e.target.value)}
                placeholder="Paste video URL..."
                className="flex-1 p-3 rounded-lg bg-gray-800/40 backdrop-blur-sm border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
              />
              <button
                onClick={handleBangAddVideo}
                className="px-6 py-3 bg-green-600/30 hover:bg-green-600/40 rounded-lg border border-green-500/30 transition-colors"
              >
                Add Video
              </button>
            </div>
          )}
        </div>

        {/* ... (keep video modal code) */}
      </div>
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
  <div className="bg-gray-800/40 backdrop-blur-sm p-4 rounded-xl border border-gray-700 hover:border-cyan-400/30 transition-all">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-lg bg-gradient-to-r ${gradient}`}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold bg-clip-text bg-gradient-to-r from-white to-gray-300">
          {value}
        </div>
        <div className="text-sm text-gray-400">{label}</div>
      </div>
    </div>
  </div>
);

export default ModelProfile;
