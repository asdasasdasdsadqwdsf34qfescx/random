"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import handler from "./request";
import DetailsSection from "./Details";
import { videoDetails, VideoModel } from "./ids";

const calculateAverage = (video: any): number => {
  const numericValues = Object.values(video).filter(
    (value) => typeof value === "number"
  ) as number[];

  return numericValues.length > 0
    ? numericValues.reduce((sum, value) => sum + value, 0) /
        numericValues.length
    : 0;
};

const VimeoGrid = () => {
  const router = useRouter();
  const [videos, setVideos] = useState<VideoModel[]>([]);
  const [onlineModels, setOnlineModels] = useState<VideoModel[]>([]);
  const [currentVideo, setCurrentVideo] = useState<string>(
    videoDetails[Math.floor(Math.random() * videoDetails.length)].id
  );
  const [activeTab, setActiveTab] = useState("ratings");
  const [showVideo, setShowVideo] = useState(false);

  // Fetch and update online status for all models
  useEffect(() => {
    const updateOnlineStatus = async () => {
      try {
        const updatedVideos = await Promise.all(
          videoDetails.map(async (video) => {
            const isOnline = await handler(video.name);
            return { ...video, isOnline };
          })
        );
        setVideos(updatedVideos);
        setOnlineModels(
          updatedVideos.filter((video: VideoModel) => video.isOnline)
        );
      } catch (error) {
        console.error("Error updating online status:", error);
      }
    };

    updateOnlineStatus();
    const intervalId = setInterval(updateOnlineStatus, 30000);
    return () => clearInterval(intervalId);
  }, []);

  const sortedVideos = useMemo(
    () => [...videos].sort((a, b) => calculateAverage(b) - calculateAverage(a)),
    [videos]
  );

  const currentVideoDetails: VideoModel | null =
    videos.find((video) => video.id === currentVideo) || null;

  const handleRandomVideo = () => {
    const randomIndex = Math.floor(Math.random() * videos.length);
    setCurrentVideo(videos[randomIndex].id);
  };

  // Ratings List with Styling (duplicates now filtered by id)
  const renderRatingsList = () => {
    const uniqueSortedVideos = sortedVideos.filter(
      (video, index, self) => index === self.findIndex((v) => v.name === video.name)
    );

    return (
      <ul className="space-y-2 overflow-auto h-96">
        {uniqueSortedVideos.map((video, index) => {
          let bgColor = "bg-gray-700";
          let textColor = "text-white";
          let borderStyle = "border border-gray-600";
          let badge = null;

          if (index < 3) {
            bgColor = "bg-gradient-to-r from-yellow-500 to-orange-500";
            textColor = "text-black font-semibold";
            borderStyle = "border border-yellow-400 shadow-md";
            badge = index === 0 ? "❤️" : index === 1 ? "🧡" : "💛";
          } else if (index < 6) {
            bgColor = "bg-gradient-to-r from-blue-600 to-indigo-600";
            borderStyle = "border border-blue-400";
          } else if (index < 10) {
            bgColor = "bg-gradient-to-r from-green-600 to-teal-600";
            borderStyle = "border border-green-400";
          }

          return (
            <li
              key={video.id}
              className={`p-3 ${bgColor} rounded-lg flex justify-between items-center cursor-pointer hover:scale-[1.03] transition-transform duration-300 ease-in-out ${borderStyle}`}
              onClick={() => setCurrentVideo(video.id)}
            >
              <div className="flex items-center gap-2">
                {badge && <span className="text-xl">{badge}</span>}
                <span className={`${textColor} font-medium`}>
                  {index + 1}. {video.name}
                </span>
              </div>
              <span className="text-yellow-300 font-semibold">
                {calculateAverage(video).toFixed(1)}/10
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "ratings":
        return renderRatingsList();
      case "online":
        return (
          <ul className="space-y-2 overflow-y-auto max-h-96">
            {onlineModels.length > 0 ? (
              onlineModels.map((model) => (
                <li
                  key={model.id}
                  className="p-3 bg-gray-700 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-600"
                  onClick={() => setCurrentVideo(model.id)}
                >
                  <span className="font-medium">{model.name}</span>
                  <span className="text-green-400">Online</span>
                </li>
              ))
            ) : (
              <p className="text-gray-400">No models are currently online.</p>
            )}
          </ul>
        );
      case "details":
        return (
          <DetailsSection
            currentVideoDetails={currentVideoDetails}
            calculateAverage={calculateAverage}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-1 shadow-md bg-gray-700/80 backdrop-blur-lg">
        <a href="/page1">
          <img
            src="https://static-cdn.strpst.com/panelImages/b/0/f/b0f197f48f6cc981166dcbf545ff3e0a-thumb"
            alt="Logo"
            className="h-11 w-auto object-contain"
          />
        </a>
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/page2")}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition"
          >
            Go to Page 2
          </button>
          <button
            onClick={handleRandomVideo}
            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 transition"
          >
            Random Video
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-wrap justify-center gap-8 p-6 h-[calc(100vh-72px)]">
        <section className="w-full max-w-md p-4 bg-gray-800 rounded-lg shadow-lg h-full overflow-hidden">
          <div className="flex justify-between items-center mb-4 border-b border-gray-700">
            <button
              onClick={() => setActiveTab("ratings")}
              className="py-2 px-4 text-yellow-400 border-b-2 border-yellow-400"
            >
              Ratings
            </button>
            <button
              onClick={() => setActiveTab("online")}
              className="py-2 px-4 text-green-400 border-b-2 border-green-400"
            >
              Online Models
            </button>
            <button
              onClick={() => setActiveTab("details")}
              className="py-2 px-4 text-blue-400 border-b-2 border-blue-400"
            >
              Details
            </button>
          </div>
          <div className="mt-4">{renderTabContent()}</div>
        </section>
        {/* Video Section */}
        <section className="flex-1">
          {currentVideoDetails?.isOnline && showVideo ? (
            <iframe
              id="cam-preview"
              src={`https://chaturbate.com/embed/${currentVideoDetails.name}/?join_overlay=1&campaign=GeOP2&embed_video_only=1&disable_sound=1&tour=9oGW&mobileRedirect=never`}
              width="80%"
              height="90%"
              frameBorder="0"
              className="w-full aspect-video rounded-lg shadow-xl border border-gray-700"
              scrolling="no"
              style={{
                backgroundImage: `url(https://thumb.live.mmcdn.com/ri/${currentVideoDetails.name}.jpg)`,
                backgroundSize: "cover",
                opacity: 1,
              }}
              allowFullScreen
              title="Chaturbate Model"
            ></iframe>
          ) : (
            <iframe
              src={`https://videos.sproutvideo.com/embed/${currentVideo}?autoplay=true&controls=true`}
              className="w-full h-64 md:h-96 rounded-md shadow-md"
              frameBorder="0"
              allowFullScreen
              title="Vimeo Video"
            ></iframe>
          )}

          {currentVideoDetails?.isOnline && (
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setShowVideo(true)}
                className={`px-4 py-2 rounded-md text-white text-sm font-semibold transition ${
                  showVideo
                    ? "bg-purple-700 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-500"
                }`}
                disabled={showVideo}
              >
                Switch to Chaturbate
              </button>
              <button
                onClick={() => setShowVideo(false)}
                className={`ml-4 px-4 py-2 rounded-md text-white text-sm font-semibold transition ${
                  !showVideo
                    ? "bg-green-700 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-500"
                }`}
                disabled={!showVideo}
              >
                Switch to Vimeo
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default VimeoGrid;
