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
const cheekLink = "https://check-one-ruby.vercel.app";
const defaultNewModel: Omit<VideoModel, "id" | "isOnline" | "averageRating"> = {
  videoId: [],
  name: "",
  brest: 0,
  nipples: 0,
  legs: 0,
  ass: 0,
  face: 0,
  pussy: 0,
  overall: 0,
  voice: 0,
  content: 0,
  eyes: 0,
  lips: 0,
  waist: 0,
  wife: 0,
  haire: 0,
  nails: 0,
  nose: 0,
  skin: 0,
  hands: 0,
  rear: 0,
  front: 0,
  ears: 0,
  height: 0,
  weight: 0,
  instagram: null,
  tiktok: null,
  onlineCount: 0,
  videoCount: 0,
};

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

  const handleRandomVideo = () => {
    if (videoDetails.length > 0) {
      const randomModel =
        videoDetails[Math.floor(Math.random() * videoDetails.length)];

      setCurrentVideo(randomModel);
      updateVideoCount(randomModel.id!);
      setSelectedVideoIndex(0);

      const fetchData = async () => {
        const onlineTop = await getOnlineRating();
        const randomeTop = await getVideoRating();
        setRandomTop(randomeTop!);
        setOnlineTop(onlineTop!);
      };
      fetchData();
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const ratingFields = [
        newModel.brest,
        newModel.nipples,
        newModel.legs,
        newModel.ass,
        newModel.face,
        newModel.pussy,
        newModel.overall,
        newModel.voice,
        newModel.content,
        newModel.eyes,
        newModel.lips,
        newModel.waist,
        newModel.wife,
        newModel.haire,
        newModel.nails,
        newModel.skin,
        newModel.hands,
        newModel.rear,
        newModel.front,
        newModel.ears,
        newModel.height,
        newModel.weight,
        newModel.nose,
      ];

      const averageRating =
        ratingFields.reduce((a, b) => a + b, 0) / ratingFields.length;

      const modelToAdd: VideoModel = {
        ...newModel,
        isOnline: false,
        averageRating,
      };

      add(modelToAdd);

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

  const renderTabContent = () => {
    switch (activeTab) {
      case "ratings":
        return (
          <ul className="space-y-2 overflow-auto h-[750px] scrollbar-hide">
            {videoDetails.length ? (
              videoDetails.map((video, index) => (
                <li
                  key={video.id}
                  className="p-3 bg-gray-700 rounded-lg flex justify-between items-center cursor-pointer hover:scale-[1.03] transition-transform duration-300 ease-in-out border border-gray-600"
                  onClick={() => {
                    setCurrentVideo(video);
                    setSelectedVideoIndex(0);
                  }}
                >
                  <span className="text-white font-medium">
                    {index + 1}. {video.name || "Unknown Video"}
                  </span>
                  <span className="text-yellow-300 font-semibold">
                    {video.averageRating.toFixed(1)}/10
                  </span>
                </li>
              ))
            ) : (
              <p>No videos available.</p>
            )}
          </ul>
        );
      case "online":
        return (
          <ul className="space-y-2 overflow-y-auto max-h-96">
            {onlineModels.length ? (
              onlineModels.map((model) => (
                <li
                  key={model.id}
                  className="p-3 bg-gray-700 rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-600"
                  onClick={() => {
                    setCurrentVideo(model);
                    setSelectedVideoIndex(0);
                  }}
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
        );
      case "random":
        return (
          <ul className="space-y-2 overflow-auto h-[750px] scrollbar-hide">
            {randomTop.length ? (
              randomTop.map((video, index) => {
                const positionChange = previousRandomTop.find(
                  (prevVideo) => prevVideo.id === video.id
                );
                const change = positionChange?.videoCount ?? 0;
                return (
                  <li
                    key={video.id}
                    className="p-3 bg-gray-700 rounded-lg flex justify-between items-center cursor-pointer hover:scale-[1.03] transition-transform duration-300 ease-in-out border border-gray-600"
                  >
                    <span className="text-white font-medium">
                      {index + 1}. {video.name || "Unknown Video"}
                    </span>
                    <span className="text-yellow-300 font-semibold flex items-center">
                      {video.videoCount}
                      {change > 0 && (
                        <span className="text-green-500 ml-2">
                          ↑ {Math.abs(change)}
                        </span>
                      )}
                      {change < 0 && (
                        <span className="text-red-500 ml-2">
                          ↓ {Math.abs(change)}
                        </span>
                      )}
                    </span>
                  </li>
                );
              })
            ) : (
              <p>No videos available.</p>
            )}
          </ul>
        );
      case "top":
        return (
          <ul className="space-y-2 overflow-auto h-[750px] scrollbar-hide">
            {onlineTop.length ? (
              onlineTop.map((video, index) => {
                const positionChange = previousRandomTop.find(
                  (prevVideo) => prevVideo.id === video.id
                );
                const change = positionChange?.onlineCount ?? 0;
                return (
                  <li
                    key={video.id}
                    className="p-3 bg-gray-700 rounded-lg flex justify-between items-center cursor-pointer hover:scale-[1.03] transition-transform duration-300 ease-in-out border border-gray-600"
                  >
                    <span className="text-white font-medium">
                      {index + 1}. {video.name || "Unknown Video"}
                    </span>
                    <span className="text-yellow-300 font-semibold flex items-center">
                      {video.onlineCount}
                      {change > 0 && (
                        <span className="text-green-500 ml-2">
                          ↑ {Math.abs(change)}
                        </span>
                      )}
                      {change < 0 && (
                        <span className="text-red-500 ml-2">
                          ↓ {Math.abs(change)}
                        </span>
                      )}
                    </span>
                  </li>
                );
              })
            ) : (
              <p>No videos available.</p>
            )}
          </ul>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 text-white">
    <header className="flex items-center justify-between px-6 py-1 shadow-md bg-gray-700/80 backdrop-blur-lg">
      <a href="/page1">
        <img
          src="https://static-cdn.strpst.com/panelImages/b/0/f/b0f197f48f6cc981166dcbf545ff3e0a-thumb"
          alt="Logo"
          className="h-11 w-auto object-contain"
        />
      </a>
      <div className="flex gap-4">
        <ButtonsSection
          setVideoDetails={setVideoDetails}
          setPreviousRandomTop={setPreviousRandomTop}
          setRandomTop={setRandomTop}
          setPreviousOnlineTop={setPreviousOnlineTop}
          randomTop={randomTop}
          setOnlineTop={setOnlineTop}
          setCurrentVideo={setCurrentVideo}
          setSelectedVideoIndex={setSelectedVideoIndex}
          setOnlineModels={setOnlineModels}
          videoDetails={videoDetails}
          setShowAddModal={setShowAddModal}
          router={router}
        />
      </div>
    </header>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-2xl mx-4 shadow-xl">
            <h2 className="text-xl mb-4 font-bold">Add New Model</h2>

            <form
              onSubmit={handleAddSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Left Column - Basic Information */}
              <div className="space-y-3">
                <h3 className="font-medium text-lg mb-2">Basic Information</h3>

                <div className="flex flex-col">
                  <label className="text-sm mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    className="p-2 bg-gray-700 rounded-md text-sm"
                    value={newModel.name}
                    onChange={(e) =>
                      setNewModel({ ...newModel, name: e.target.value })
                    }
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm mb-1">
                    Video IDs (comma separated) *
                  </label>
                  <input
                    type="text"
                    required
                    className="p-2 bg-gray-700 rounded-md text-sm"
                    value={newModel.videoId.join(", ")}
                    onChange={(e) =>
                      setNewModel({
                        ...newModel,
                        videoId: e.target.value
                          .split(",")
                          .map((id) => id.trim()),
                      })
                    }
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm mb-1">Instagram</label>
                  <input
                    type="text"
                    className="p-2 bg-gray-700 rounded-md text-sm"
                    value={newModel.instagram || ""}
                    onChange={(e) =>
                      setNewModel({
                        ...newModel,
                        instagram: e.target.value || null,
                      })
                    }
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-sm mb-1">TikTok</label>
                  <input
                    type="text"
                    className="p-2 bg-gray-700 rounded-md text-sm"
                    value={newModel.tiktok || ""}
                    onChange={(e) =>
                      setNewModel({
                        ...newModel,
                        tiktok: e.target.value || null,
                      })
                    }
                  />
                </div>
              </div>

              {/* Right Column - Ratings */}
              <div className="space-y-3">
                <h3 className="font-medium text-lg mb-2">Ratings (0-10)</h3>
                <div className="grid grid-cols-2 gap-1">
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
                        required
                        className="p-2 bg-gray-700 rounded-md text-sm"
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

              {/* Buttons */}
              <div className="md:col-span-2 mt-4 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 transition text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 transition text-sm"
                >
                  Add Model
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <main className="flex flex-wrap justify-center gap-8 p-6 h-[calc(100vh-72px)]">
        <section className="w-full max-w-md p-4 bg-gray-800 rounded-lg shadow-lg h-full overflow-hidden">
          <div className="flex justify-between items-center mb-4 border-b border-gray-700">
            {["ratings", "online", "details", "random", "top"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-4 text-white ${
                  activeTab === tab ? "border-b-2 border-purple-500" : ""
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div className="mt-4">{renderTabContent()}</div>
        </section>

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
