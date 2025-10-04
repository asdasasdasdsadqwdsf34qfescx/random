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
  const [randomVideos, setRandomVideos] = useState<{ photo: string; video: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

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
    
    const generatedVideos: { photo: string; video: string }[] = [];
    const usedCombinations = new Set<string>();
    
    // Generate up to 4 different random videos
    for (let i = 0; i < 4; i++) {
      let attempts = 0;
      const maxAttempts = 20; // Prevent infinite loop
      
      while (attempts < maxAttempts) {
        const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
        const name = randomPhoto.replace(/\.[^.]+$/, "");
        
        try {
          const res = await fetch(`/api/videos?name=${encodeURIComponent(name)}&filter=${videoFilter}`);
          if (!res.ok) {
            attempts++;
            continue;
          }
          
          const data = await res.json();
          if (!data.videos || data.videos.length === 0) {
            attempts++;
            continue;
          }
          
          const filteredVideos = data.videos.filter((v: string) => v.toLowerCase().includes(videoFilter));
          if (filteredVideos.length === 0) {
            attempts++;
            continue;
          }
          
          const randomVid = filteredVideos[Math.floor(Math.random() * filteredVideos.length)];
          const combination = `${randomPhoto}-${randomVid}`;
          
          // Check if this combination is already used
          if (!usedCombinations.has(combination)) {
            generatedVideos.push({ photo: randomPhoto, video: randomVid });
            usedCombinations.add(combination);
            break;
          }
        } catch (err) {
          console.error(err);
        }
        
        attempts++;
      }
    }
    
    setRandomVideos(generatedVideos);
    setActiveTab('videos');
    setSelectedPhoto(null);
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
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            
            {/* Search Bar */}
            <div className="relative w-full max-w-md mx-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Caută modele..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Random Button */}
            <button
              onClick={generateRandomVideo}
              disabled={photos.length === 0}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed whitespace-nowrap"
            >
              🎲 Random Video
            </button>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex space-x-0 border-b">
            <TabButton
              label="Modele"
              isActive={activeTab === 'models'}
              onClick={() => {
                setActiveTab('models');
                setSelectedPhoto(null);
                setRandomVideos([]);
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

            {/* Models Grid */}
            {loadingPhotos ? (
              <LoadingSpinner />
            ) : photos.length === 0 ? (
              <EmptyState message="Nu au fost găsite modele" />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {photos
                  .filter((photo) => {
                    const photoName = photo.replace(/\.[^.]+$/, "").toLowerCase();
                    return photoName.includes(searchTerm.toLowerCase());
                  })
                  .map((photo) => (
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
              <div className="flex justify-center">
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
                  <span>Back to Models</span>
                </button>
              </div>
            )}

            {/* Random Videos Display */}
            {randomVideos.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-center mb-4">
                
                </div>
                <div className="grid grid-cols-2 gap-4 max-w-6xl mx-auto">
                  {randomVideos.map((randomVideo, index) => (
                    <div key={`${randomVideo.photo}-${randomVideo.video}-${index}`} className="text-center">
                      <VideoPlayer
                        src={`/videos/${randomVideo.photo.replace(/\.[^.]+$/, "")}/${randomVideo.video}`}
                        className="w-full h-auto"
                        style={{ maxHeight: '300px' }}
                      />
                      <p className="mt-2 text-sm text-gray-600 truncate">
                        {randomVideo.photo.replace(/\.[^.]+$/, "")}
                      </p>
                    </div>
                  ))}
                  {/* Fill empty slots if less than 4 videos */}
                  {Array.from({ length: 4 - randomVideos.length }).map((_, index) => (
                    <div key={`empty-${index}`} className="bg-gray-100 rounded-lg flex items-center justify-center" style={{ minHeight: '300px' }}>
                      <span className="text-gray-400">No video</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Photo Videos */}
            {selectedPhoto && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Videos for: {selectedPhoto.replace(/\.[^.]+$/, "")}
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
            {randomVideos.length === 0 && !selectedPhoto && (
              <EmptyState message="Select a model to see videos or generate a random video" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
