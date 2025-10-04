"use client";

import { useState, useEffect } from "react";
import { TabButton } from "./TabButton";
import { LoadingSpinner } from "./LoadingSpinner";
import { EmptyState } from "./EmptyState";
import { ModelCard } from "./ModelCard";
import { VideoPlayer } from "./VideoPlayer";

type TabType = 'models' | 'videos';

interface MediaGalleryProps {
  apiEndpoint: string;
  videoFilter: string;
  basePath: string;
  title: string;
}

export const MediaGallery = ({ apiEndpoint, videoFilter, basePath, title }: MediaGalleryProps) => {
  const [activeTab, setActiveTab] = useState<TabType>('models');
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [videos, setVideos] = useState<string[]>([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [randomVideo, setRandomVideo] = useState<{ photo: string; video: string } | null>(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoadingPhotos(true);
      try {
        const res = await fetch(apiEndpoint);
        if (!res.ok) throw new Error("Nu s-au putut încărca pozele");
        const data = await res.json();
        setPhotos(data.images ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingPhotos(false);
      }
    };
    fetchPhotos();
  }, [apiEndpoint]);

  const handlePhotoClick = async (photo: string) => {
    setSelectedPhoto(photo);
    setActiveTab('videos');
    setLoadingVideos(true);
    try {
      const name = photo.replace(/\.[^.]+$/, "");
      const res = await fetch(`/api/videos?name=${encodeURIComponent(name)}&filter=${videoFilter}`);
      if (!res.ok) throw new Error("Nu s-au putut încărca videourile");
      const data = await res.json();
      setVideos((data.videos ?? []).filter((v: string) => v.toLowerCase().includes(videoFilter)));
    } catch (err) {
      console.error(err);
      setVideos([]);
    } finally {
      setLoadingVideos(false);
    }
  };

  const generateRandomVideo = async () => {
    if (photos.length === 0) return;
    const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
    const name = randomPhoto.replace(/\.[^.]+$/, "");
    try {
      const res = await fetch(`/api/videos?name=${encodeURIComponent(name)}&filter=${videoFilter}`);
      if (!res.ok) return setRandomVideo(null);
      const data = await res.json();
      if (!data.videos || data.videos.length === 0) return setRandomVideo(null);
      const filteredVideos = data.videos.filter((v: string) => v.toLowerCase().includes(videoFilter));
      if (filteredVideos.length === 0) return setRandomVideo(null);
      const randomVid = filteredVideos[Math.floor(Math.random() * filteredVideos.length)];
      setRandomVideo({ photo: randomPhoto, video: randomVid });
      setActiveTab('videos');
      setSelectedPhoto(null);
    } catch (err) {
      console.error(err);
      setRandomVideo(null);
    }
  };

  const handleMiddleClick = (photo: string) => {
    const name = photo.replace(/\.[^.]+$/, "");
    window.open(`/videos/${name}`, '_blank');
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
          
          {/* Tab Navigation */}
          <div className="flex space-x-0 border-b">
            <TabButton
              label="Modele"
              isActive={activeTab === 'models'}
              onClick={() => {
                setActiveTab('models');
                setSelectedPhoto(null);
                setRandomVideo(null);
              }}
            />
            <TabButton
              label="Videoclipuri"
              isActive={activeTab === 'videos'}
              onClick={() => setActiveTab('videos')}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {activeTab === 'models' && (
          <div className="space-y-6">
            {/* Action Button */}
            <div className="flex justify-center">
              <button
                onClick={generateRandomVideo}
                disabled={photos.length === 0}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
              >
                🎲 Generează Video Aleatoriu
              </button>
            </div>

            {/* Models Grid */}
            {loadingPhotos ? (
              <LoadingSpinner />
            ) : photos.length === 0 ? (
              <EmptyState message="Nu au fost găsite modele" />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {photos.map((photo) => (
                  <ModelCard
                    key={photo}
                    photo={photo}
                    basePath={basePath}
                    onPhotoClick={handlePhotoClick}
                    onMiddleClick={handleMiddleClick}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="space-y-6">
            {/* Back Button */}
            {selectedPhoto && (
              <button
                onClick={() => {
                  setSelectedPhoto(null);
                  setActiveTab('models');
                }}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Înapoi la Modele</span>
              </button>
            )}

            {/* Random Video Display */}
            {randomVideo && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {randomVideo.photo.replace(/\.[^.]+$/, "")}
                  </h3>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    🎲 Video Aleatoriu
                  </span>
                </div>
                <div className="flex justify-center">
                  <VideoPlayer
                    src={`/videos/${randomVideo.photo.replace(/\.[^.]+$/, "")}/${randomVideo.video}`}
                    className="max-w-full h-auto"
                    style={{ maxHeight: '400px', maxWidth: '700px' }}
                  />
                </div>
              </div>
            )}

            {/* Selected Photo Videos */}
            {selectedPhoto && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Videoclipuri pentru: {selectedPhoto.replace(/\.[^.]+$/, "")}
                </h3>
                
                {loadingVideos ? (
                  <LoadingSpinner />
                ) : videos.length === 0 ? (
                  <EmptyState message="Nu au fost găsite videoclipuri pentru acest model" />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {videos.map((video) => (
                      <div key={video}>
                        <VideoPlayer
                          src={`/videos/${selectedPhoto.replace(/\.[^.]+$/, "")}/${video}`}
                          className="w-full"
                          style={{ height: '200px' }}
                        />
                        <p className="mt-2 text-sm text-gray-600 truncate">{video}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Empty state when no content */}
            {!randomVideo && !selectedPhoto && (
              <EmptyState message="Selectează un model pentru a vedea videoclipurile sau generează un video aleatoriu" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
