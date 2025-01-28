"use client";

import { useRouter } from "next/navigation";
import { useState,useMemo,  useEffect, SetStateAction } from "react";
import handler from "./request";
import DetailsSection from "./Details";


const videoDetails = [
  {
    name: "sweet_littleee",
    id: "7091d7b4191de4c0f9/6d7a5e130e1ff6ec",
    brest: 3,
    nipples: 5,
    legs: 8,
    ass: 8,
    face: 7,
    pussy: 7,
    fullbody: 8,
    voice: 8,
    content: 7,
    haire: 9,
    isOnline: false,
  },
  {
    name: "libbyshepard",
    id: "ea91d7b4191ce3c463/6b8a79417b492de8",
    brest: 9,
    nipples: 6,
    legs: 7,
    ass: 8,
    face: 7,
    pussy: 1,
    fullbody: 8,
    voice: 8,
    content: 8,
    hair: 9,
    isOnline: false
  },
  {
    name: "monica_liz",
    id: "1191d7b4191cedc598/4b2e1363e6b494c8",
    brest: 3,
    nipples: 7,
    legs: 7,
    ass: 9,
    face: 7,
    pussy: 7,
    fullbody: 7,
    voice: 1,
    content: 4,
    hair: 8,
    isOnline: false
  },
  {
    name: "golden_bag",
    id: "ea91d7b41f1becca63/4495d412b5147413",
    brest: 3,
    nipples: 6,
    legs: 5,
    ass: 5,
    face: 6,
    pussy: 7,
    fullbody: 7,
    voice: 6,
    content: 7,
    hair: 8,
    isOnline: false
  },
  {
    name: "pamelaryant",
    id: "4491d6b31815e9cecd/cb2ba90a7036daf9",
    brest: 7,
    nipples: 4,
    legs: 7,
    ass: 9,
    face: 10,
    pussy: 1,
    fullbody: 8,
    voice: 7,
    content: 8,
    hair: 8,
    isOnline: false
  },
  {
    name: "mellisa_nets",
    id: "a791d7b91b11e0c42e/67d1f95329f6fba9",
    brest: 7,
    nipples: 5,
    legs: 6,
    ass: 6,
    face: 7,
    pussy: 6,
    fullbody: 8,
    voice: 7,
    content: 8,
    hair: 9,
    isOnline: false
  },
  {
    name: "intrigueeme",
    id: "d391d7b91b11e3c35a/64af590df1ccd88c",
    brest: 3,
    nipples: 3,
    legs: 6,
    ass: 7,
    face: 8,
    pussy: 7,
    fullbody: 7,
    voice: 6,
    content: 8,
    hair: 8,
    isOnline: false
  },
  {
    name: "javvvana",
    id: "4d91d7b91b11e2c4c4/3263e2a9bd91db37",
    brest: 8,
    nipples: 8,
    legs: 8,
    ass: 8,
    face: 10,
    pussy: 7,
    fullbody: 10,
    voice: 6,
    content: 7,
    hair: 9,
    isOnline: false
  },
  {
    name: "javvvana",
    id: "0691d7b91b11e2c38f/e5aea07e92c3d656",
    brest: 8,
    nipples: 8,
    legs: 8,
    ass: 8,
    face: 10,
    pussy: 7,
    fullbody: 10,
    voice: 6,
    content: 7,
    hair: 9,
    isOnline: false
  },
  {
    name: "mollymurrrr",
    id: "ac91d7b51d1ee3c525/ac4e9fc87cdcd050",
    brest: 7,
    nipples: 6,
    legs: 8,
    ass: 8,
    face: 8,
    pussy: 7,
    fullbody: 9,
    voice: 6,
    content: 8,
    hair: 8,
    isOnline: false
  },
  {
    name: "r_o_s_y",
    id: "1191d7b41c1de0cc98/55350c2eaaef45cd",
    brest: 8,
    nipples: 8,
    legs: 6,
    ass: 7,
    face: 7,
    pussy: 6,
    fullbody: 7,
    voice: 6,
    content: 8,
    hair: 8,
    isOnline: false
  },
];

const calculateAverage = (video) => {
  const numericValues = Object.values(video).filter(
    (value) => typeof value === "number"
  );
  return (
    numericValues.reduce((sum, value) => sum + value, 0) / numericValues.length
  ).toFixed(1);
};

const VimeoGrid = () => {
  const router = useRouter();
  const [videos, setVideos] = useState(videoDetails); // Manage video state
  const [currentVideo, setCurrentVideo] = useState(
    videoDetails[Math.floor(Math.random() * videoDetails.length)].id
  );
  const [activeTab, setActiveTab] = useState("ratings"); // Manage active tab state
  const [showDetails, setShowDetails] = useState(false); // Toggle for details section

  // Check and update online status for all models
  useEffect(() => {
    const updateOnlineStatus = async () => {
      const updatedVideos = await Promise.all(
        videos.map(async (video) => {
          const isOnline = await handler(video.name); // Check if the model is online
          return { ...video, isOnline }; // Update the video object with online status
        })
      );
      setVideos(updatedVideos);
    };

    updateOnlineStatus();
  }, []);

  const sortedVideos = useMemo(
    () =>
      [...videos].sort((a, b) => calculateAverage(b) - calculateAverage(a)),
    [videos]
  );

  const onlineModels = useMemo(
    () => videos.filter((video) => video.isOnline),
    [videos]
  );

  const currentVideoDetails = videos.find((video) => video.id === currentVideo);

  const handleRandomVideo = () => {
    const randomIndex = Math.floor(Math.random() * videos.length);
    setCurrentVideo(videos[randomIndex].id);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "ratings":
        return (
          <ul className="space-y-2">
            {sortedVideos.map((video, index) => (
              <li
                key={video.id}
                className="p-3 bg-gray-700 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-600"
                onClick={() => setCurrentVideo(video.id)}
              >
                <span className="font-medium">
                  {index + 1}. {video.name}
                </span>
                <span className="text-yellow-400">
                  {calculateAverage(video)}/10
                </span>
              </li>
            ))}
          </ul>
        );
      case "online":
        return (
          <ul className="space-y-2">
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
            showDetails={showDetails}
            setShowDetails={setShowDetails}
            calculateAverage={calculateAverage}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 shadow-md bg-gray-700/80 backdrop-blur-lg">
        <h1 className="text-xl font-bold">Video Grid</h1>
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
      <main className="flex flex-wrap justify-center gap-8 p-6">
        {/* Tab Section */}
        <section className="w-full max-w-md p-4 bg-gray-800 rounded-lg shadow-lg">
          {/* Tabs */}
          <div className="flex justify-between items-center mb-4 border-b border-gray-700">
            <button
              onClick={() => setActiveTab("ratings")}
              className={`py-2 px-4 ${
                activeTab === "ratings"
                  ? "text-yellow-400 border-b-2 border-yellow-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Ratings
            </button>
            <button
              onClick={() => setActiveTab("online")}
              className={`py-2 px-4 ${
                activeTab === "online"
                  ? "text-green-400 border-b-2 border-green-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Online Models
            </button>
            <button
              onClick={() => setActiveTab("details")}
              className={`py-2 px-4 ${
                activeTab === "details"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Details
            </button>
          </div>

          {/* Tab Content */}
          <div className="mt-4">{renderTabContent()}</div>
        </section>

        {/* Video Section */}
        <section className="flex-1">
          <iframe
            src={`https://videos.sproutvideo.com/embed/${currentVideo}?autoplay=true&controls=true`}
            className="w-full aspect-video rounded-lg shadow-lg"
            frameBorder="0"
            allowFullScreen
            title="Vimeo Video"
          ></iframe>
        </section>
      </main>
    </div>
  );
};

export default VimeoGrid;