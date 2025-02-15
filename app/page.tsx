"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import DetailsSection from "./Details";
import {
  add,
  getData,
  updateVideoCount,
  update,
  VideoModel,
  getOnlineRating,
  getVideoRating,
} from "./ids";
import { fetchDataFromSupabase } from "./UseEffects/fetchData";
import { updateOnlineList } from "./UseEffects/updateOnlineModels";
import { ButtonsSection } from "./Sections/Buttons/Buttons";
import { AddModelButton } from "./Sections/Buttons/AddModelButton/AddModelButton";
import { defaultNewModel } from "./types";
import { RenderTabs } from "./Sections/Tabs/RenderTabs";
const cheekLink = "https://check-one-ruby.vercel.app";

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

  useEffect(() => {
    fetchDataFromSupabase({
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
  }, []);

  useEffect(() => {
    updateOnlineList(setVideoDetails, setOnlineModels);
    const intervalId = setInterval(updateOnlineList, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const calculatePositionChanges = (
    currentList: VideoModel[],
    previousList: VideoModel[]
  ): { id: number; change: number }[] => {
    const positionChanges: { id: number; change: number }[] = [];
    currentList.forEach((video, currentIndex) => {
      const previousIndex = previousList.findIndex((v) => v.id === video.id);
      if (previousIndex !== -1) {
        positionChanges.push({
          id: video.id!,
          change: previousIndex - currentIndex, // Calculăm diferența de poziții
        });
      } else {
        positionChanges.push({ id: video.id!, change: 0 }); // Dacă nu există în lista anterioară, schimbarea e 0
      }
    });
    return positionChanges;
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 text-white">
      <header className="flex items-center justify-between px-1 py-2 shadow-md bg-gray-700/80 backdrop-blur-lg">
        <a href="/page1">{/* Add your logo or header content here */}</a>
        <ButtonsSection
          setRandomTop={setRandomTop}
          setOnlineTop={setOnlineTop}
          setCurrentVideo={setCurrentVideo}
          setSelectedVideoIndex={setSelectedVideoIndex}
          videoDetails={videoDetails}
          setShowAddModal={setShowAddModal}
          router={router}
          currentVideo={currentVideo}
          setEditedModel={setEditedModel}
          setVideoDetails={setVideoDetails}
          setShowEditModal={setShowEditModal}
          showEditModal={showEditModal}
          editedModel={editedModel}
          newModel={newModel}
          setNewModel={setNewModel}
          showAddModal={showAddModal}
        />
      </header>


      <main className="flex flex-wrap justify-center gap-8 p-6 h-[calc(100vh-72px)]">
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

        <section className="flex-1">
          {currentVideo?.isOnline && showVideo ? (
            <iframe
              id="cam-preview"
              src={`https://chaturbate.com/embed/${currentVideo.name}/?join_overlay=1&campaign=GeOP2&embed_video_only=1&disable_sound=1&tour=9oGW&mobileRedirect=never`}
              width="80%"
              height="90%"
              frameBorder="0"
              className="w-full aspect-video rounded-lg shadow-xl border border-gray-700"
              scrolling="no"
              style={{
                backgroundImage: `url(https://thumb.live.mmcdn.com/ri/${currentVideo.name}.jpg)`,
                backgroundSize: "cover",
                opacity: 1,
              }}
              allowFullScreen
              title="Chaturbate Model"
            ></iframe>
          ) : (
            <iframe
              src={`https://videos.sproutvideo.com/embed/${currentVideo?.videoId[selectedVideoIndex]}?autoplay=true&controls=true`}
              frameBorder="0"
              width="80%"
              height="90%"
              className="w-full aspect-video rounded-lg shadow-xl border border-gray-700"
              allowFullScreen
              title="Vimeo Video"
            ></iframe>
          )}

          {currentVideo?.isOnline && (
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
                className={`ml-1 px-4 py-2 rounded-md text-white text-sm font-semibold transition ${
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
          {/* Video Selection Buttons */}
          {currentVideo && currentVideo?.videoId.length > 1 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {currentVideo?.videoId.map((id, index) => (
                <button
                  key={id}
                  onClick={() => setSelectedVideoIndex(index)}
                  className={`px-3 py-1 rounded-md text-white text-sm font-semibold transition ${
                    selectedVideoIndex === index
                      ? "bg-purple-700"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  Video {index + 1}
                </button>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default VimeoGrid;
