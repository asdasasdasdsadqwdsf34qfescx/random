"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { motion } from "framer-motion";

import { fetchDataFromSupabase } from "./UseEffects/fetchData";
import { updateOnlineList } from "./UseEffects/updateOnlineModels";
import { ButtonsSection } from "./Sections/Buttons/Buttons";
import { defaultNewModel, VideoModel } from "./types";
import { RenderTabs } from "./Sections/Tabs/RenderTabs";
import { EditCurrentModel } from "./Sections/Buttons/EditCurrentModel/EditCurrentModel";
import { getOnlineRating, getVideoRating, updateVideoCount } from "./ids";

const VimeoGrid = () => {
  const router = useRouter();
  const [videoDetails, setVideoDetails] = useState<VideoModel[]>([]);
  const [randomTop, setRandomTop] = useState<VideoModel[]>([]);
  const [onlineTop, setOnlineTop] = useState<VideoModel[]>([]);
  const [previousRandomTop, setPreviousRandomTop] = useState<VideoModel[]>([]);
  const [previousOnlineTop, setPreviousOnlineTop] = useState<VideoModel[]>([]);
  const [currentVideo, setCurrentVideo] = useState<VideoModel | null>(null);
  const [activeTab, setActiveTab] = useState("ratings");
  const [onlineModels, setOnlineModels] = useState<VideoModel[]>([]);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number>(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [newModel, setNewModel] =
    useState<typeof defaultNewModel>(defaultNewModel);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedModel, setEditedModel] = useState<VideoModel | null>(null);
  const [loading, setLoading] = useState(true);

  // Animații pentru containerul principal
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.4 } },
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchDataFromSupabase({
        setVideoDetails,
        setPreviousRandomTop,
        setRandomTop,
        setPreviousOnlineTop,
        randomTop,
        setOnlineTop,
        setCurrentVideo,
        setSelectedVideoIndex,
        setOnlineModels,
      });
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    updateOnlineList(setVideoDetails, setOnlineModels);
    const intervalId = setInterval(
      () => updateOnlineList(setVideoDetails, setOnlineModels),
      60000
    );
    return () => clearInterval(intervalId);
  }, []);

  const handleRandomVideo = async () => {
    if (videoDetails.length === 0) return;

    const randomModel =
      videoDetails[Math.floor(Math.random() * videoDetails.length)];
    setCurrentVideo(randomModel);
    updateVideoCount(randomModel.id!);
    setSelectedVideoIndex(0);

    const [onlineTopData, randomTopData] = await Promise.all([
      getOnlineRating(),
      getVideoRating(),
    ]);

    setRandomTop(randomTopData!);
    setOnlineTop(onlineTopData!);
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700"
      >
        <ClipLoader color="#ffffff" size={80} loading={loading} />
      </motion.div>
    );
  }

  // Clasă uniformă pentru toate butoanele
  const buttonClass =
    "px-3 py-1 rounded-full bg-gray-800 text-white text-sm font-bold shadow-lg hover:bg-gray-700 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white"
    >
      <header className="flex items-center justify-between px-8 py-4 bg-gradient-to-r from-gray-900 via-gray-850 to-gray-900 shadow-2xl border-b border-gray-700/50 relative overflow-hidden">
        {/* Efect de strălucire dinamică */}
        <div className="absolute inset-0 opacity-20 animate-shine">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/20 to-transparent w-1/2 transform -skew-x-12" />
        </div>

        {/* Secțiunea stângă - Conținut principal */}
        <div className="flex flex-col space-y-1 z-10">
          <span className="from-amber-200 to-amber-400 font-playfair font-black text-xl tracking-tight">
            {currentVideo!.name}
          </span>
          <div className="flex space-x-4">
            <span className="text-gray-300/90 text-sm font-light font-mono">
              RANK: #
              {videoDetails.findIndex((video) => video.id === currentVideo?.id)}
            </span>
            <span className="text-gray-300/90 text-sm font-light flex items-center">
              <span className="inline-block w-1 h-1 bg-emerald-400 rounded-full mr-1 shadow-glow" />
              ONLINE: {currentVideo!.onlineCount}
            </span>
            <span className="text-gray-300/90 text-sm font-light font-mono">
              RAND: {currentVideo!.videoCount}
            </span>
          </div>
        </div>

        {/* Secțiunea dreaptă - Statistici */}
        <div className="flex flex-col items-end space-y-1 z-10">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-emerald-300/90 font-mono tracking-tighter">
              {onlineModels.length.toString().padStart(3, "0")}
            </span>
            <span className="text-gray-400/80 text-[0.7rem] uppercase tracking-widest">
              Active Nodes
            </span>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-600/30 to-transparent my-1" />
          <div className="flex items-center space-x-2">
            <span className="text-xs text-amber-300/90 font-mono tracking-tighter">
              {videoDetails.length.toString().padStart(4, "0")}
            </span>
            <span className="text-gray-400/80 text-[0.7rem] uppercase tracking-widest">
              Total Cores
            </span>
          </div>
        </div>
      </header>

      <main className="flex flex-wrap justify-start gap-8 p-8 h-[calc(100vh-80px)]">
        <RenderTabs
          setRandomTop={setRandomTop}
          setOnlineTop={setOnlineTop}
          setVideoDetails={setVideoDetails}
          setCurrentVideo={setCurrentVideo}
          setActiveTab={setActiveTab}
          setSelectedVideoIndex={setSelectedVideoIndex}
          setShowEditModal={setShowEditModal}
          setEditedModel={setEditedModel}
          videoDetails={videoDetails}
          onlineModels={onlineModels}
          currentVideo={currentVideo}
          showEditModal={showEditModal}
          activeTab={activeTab}
          editedModel={editedModel}
          randomTop={randomTop}
          previousRandomTop={previousRandomTop}
          onlineTop={onlineTop}
        />
        <section className="flex-1 flex flex-col items-start">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-full aspect-video rounded-xl shadow-2xl border border-gray-600 overflow-hidden bg-black"
          >
            {currentVideo?.isOnline && showVideo ? (
              <iframe
                id="cam-preview"
                src={`https://chaturbate.com/embed/${currentVideo.name}/?join_overlay=1&campaign=GeOP2&embed_video_only=1&disable_sound=1&tour=9oGW&mobileRedirect=never`}
                width="100%"
                height="100%"
                frameBorder="0"
                className="w-full h-full object-cover"
                scrolling="no"
                style={{
                  backgroundImage: `url(https://thumb.live.mmcdn.com/ri/${currentVideo.name}.jpg)`,
                  backgroundSize: "cover",
                }}
                allowFullScreen
                title="Chaturbate Model"
              ></iframe>
            ) : (
              <iframe
                src={`https://videos.sproutvideo.com/embed/${currentVideo?.videoId[selectedVideoIndex]}?autoplay=true&controls=true`}
                frameBorder="0"
                width="100%"
                height="100%"
                className="w-full h-full object-cover"
                allowFullScreen
                title="Vimeo Video"
              ></iframe>
            )}
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-6 flex flex-row flex-wrap items-start gap-3 justify-start pl-4"
          >
            {currentVideo && (
              <>
                <EditCurrentModel
                  showEditModal={showEditModal}
                  setVideoDetails={setVideoDetails}
                  setCurrentVideo={setCurrentVideo}
                  setShowEditModal={setShowEditModal}
                  setEditedModel={setEditedModel}
                  currentVideo={currentVideo}
                  editedModel={editedModel}
                />
                <a
                  href={`/profile/${currentVideo.name}?id=${currentVideo.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClass}
                >
                  Profile
                </a>
                <a
                  href={`/ranks`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClass}
                >
                  Ranks
                </a>
              </>
            )}

            <button
              onClick={() => setShowAddModal(true)}
              className={buttonClass}
            >
              Add Model
            </button>

            <button onClick={handleRandomVideo} className={buttonClass}>
              Randomize
            </button>

            {currentVideo?.isOnline && (
              <>
                <button
                  onClick={() => setShowVideo(true)}
                  className={buttonClass}
                  disabled={showVideo}
                >
                  Chaturbate
                </button>
                <button
                  onClick={() => setShowVideo(false)}
                  className={buttonClass}
                  disabled={!showVideo}
                >
                  Video
                </button>
              </>
            )}

            {currentVideo &&
              currentVideo.videoId.length > 1 &&
              currentVideo.videoId.map((id, index) => (
                <button
                  key={id}
                  onClick={() => setSelectedVideoIndex(index)}
                  className={buttonClass}
                >
                  Video {index + 1}
                </button>
              ))}
          </motion.div>
        </section>
      </main>
      
    </motion.div>
  );
};

export default VimeoGrid;
