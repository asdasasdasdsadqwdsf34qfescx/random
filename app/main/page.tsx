"use client";
import { useState } from 'react';

// Sample model data
const videos = [
  {
    id: 1,
    video: '/videos/model1.mp4',
    modelInfo: {
      name: 'Model 1',
      age: 24,
      height: '175cm',
      hireRate: 85,
      location: 'New York'
    }
  },
  {
    id: 2,
    video: '/videos/model2.mp4',
    modelInfo: {
      name: 'Model 2',
      age: 26,
      height: '180cm',
      hireRate: 92,
      location: 'Paris'
    }
  },
  // Add more models as needed
];

export default function RandomizePage() {
  const [currentVideo, setCurrentVideo] = useState(videos[0]);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleRandomize = () => {
    const randomIndex = Math.floor(Math.random() * videos.length);
    setCurrentVideo(videos[randomIndex]);
  };

  return (
    <div className="w-full h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Random Model Video</h1>
      
      {/* Video Container */}
      <div className="w-full h-[70vh] mb-8 relative">
        <video 
          key={currentVideo.id}
          controls 
          className="w-full h-full object-cover rounded-lg shadow-lg"
          autoPlay
          muted
        >
          <source src={currentVideo.video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Button with Tooltip */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleRandomize}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-all relative"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          Randomize Model
        </button>

        <div className="relative group">
          <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center cursor-help">
            <span className="text-white font-bold">!</span>
          </div>
          
          {showTooltip && (
            <div className="absolute left-0 -top-48 w-64 bg-black bg-opacity-90 text-white p-4 rounded-lg space-y-2 text-sm">
              <h3 className="font-bold text-lg">{currentVideo.modelInfo.name}</h3>
              <p>Age: {currentVideo.modelInfo.age}</p>
              <p>Height: {currentVideo.modelInfo.height}</p>
              <p>Hire Rate: {currentVideo.modelInfo.hireRate}/100</p>
              <p>Location: {currentVideo.modelInfo.location}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}