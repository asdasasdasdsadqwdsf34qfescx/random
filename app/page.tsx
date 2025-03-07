"use client";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import { getData } from "./ids";
import { VideoModel } from "./types";
import DetailsSection from "./Details";
import { AddModelButton } from "./Sections/Buttons/AddModelButton/AddModelButton";

const buttonClass =
  "px-7 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 transform-gpu disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2";

export default function RandomizePage() {
  const [currentVideo, setCurrentVideo] = useState<VideoModel | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [videos, setVideos] = useState<VideoModel[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const details = await getData();
        if (details) {
          setVideos(details);
          setCurrentVideo(details[Math.floor(Math.random() * details.length)]);
        }
      } catch (error) {
        console.error("Error fetching video data:", error);
      }
    };
    fetchData();
    setMounted(true);
  }, []);

  const handleRandomize = () => {
    const randomIndex = Math.floor(Math.random() * videos.length);
    setCurrentVideo(videos[randomIndex]);
  };

  if (!mounted || !currentVideo) return null;

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
      <Sidebar />

      {/* Main Content Container */}
      <div className="ml-24 h-full flex flex-col justify-between p-8">
        {/* Video Container */}
        <div className="flex-1 relative group">
          <div className="relative h-full w-full bg-gray-800 rounded-3xl overflow-hidden shadow-2xl">
            <iframe
              className="w-full h-full scale-100 group-hover:scale-100 transition-transform"
              src={`${currentVideo?.videoId[0]}\!3s1a?controls=1`}
              allow="autoplay; fullscreen"
              frameBorder="0"
            />
          </div>
        </div>

        {/* Control Panel */}
        <div className="h-24 flex items-center justify-between px-8">
          <div className="flex items-center gap-6">
            <button onClick={handleRandomize} className={buttonClass}>
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Randomize Model
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className={buttonClass}
            >
              Add Model
            </button>

            <a
              href={`/profile/${currentVideo?.name}?id=${currentVideo?.id}`}
              className={`${buttonClass} from-pink-500 to-orange-400`}
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Model Profile
            </a>
          </div>

          {/* Info Badge */}
          <div
            className="relative group"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center cursor-pointer transform transition hover:rotate-12 shadow-lg">
              <span className="text-white font-bold text-xl">ℹ</span>
            </div>

            {/* Premium Tooltip */}
            {showTooltip && (
              <div className="absolute right-0 bottom-full mb-4 w-96 bg-gray-800 backdrop-blur-lg rounded-2xl p-2 shadow-2xl border border-white/10 animate-fade-in">
                <h3 className={buttonClass}>{currentVideo.name}</h3>
                <DetailsSection currentVideoDetails={currentVideo!} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ambient Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-blue-500/20 rounded-full blur-2xl animate-float-delayed"></div>
      </div>

      {showAddModal && <AddModelButton setShowAddModal={setShowAddModal} />}
    </div>
  );
}
