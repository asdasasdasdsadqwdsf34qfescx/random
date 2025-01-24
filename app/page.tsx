"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { videoIds } from "./ids";

const VimeoGrid = () => {
  const [currentVideo, setCurrentVideo] = useState(videoIds[Math.floor(Math.random() * videoIds.length)]);
  const router = useRouter();

  const handleRandomVideo = () => {
    const randomIndex = Math.floor(Math.random() * videoIds.length);
    setCurrentVideo(videoIds[randomIndex]);
  };

  const navigateToPage2 = () => {
    router.push("/page2");
  };

  return (
    <div className="relative h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <iframe
        src={`https://videos.sproutvideo.com/embed/${currentVideo}?autoplay=true&controls=true`}
        frameBorder="0"
        allow="autoplay"
        allowFullScreen
        title="Fullscreen Video"
        className="absolute top-16 w-11/12 h-[70%] rounded-xl shadow-2xl border border-gray-700 mx-auto left-1/2 transform -translate-x-1/2"
      ></iframe>

      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-6">
        <button
          onClick={handleRandomVideo}
          className="group relative px-8 py-3 text-base font-bold text-gray-900 bg-yellow-500 rounded-full shadow-lg hover:scale-105 hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:ring-offset-2 transition-all"
        >
          <span className="absolute inset-0 rounded-full bg-yellow-300 opacity-0 group-hover:opacity-20 transition-opacity"></span>
          🎲 Random Video
        </button>

        <button
          onClick={navigateToPage2}
          className="group relative px-8 py-3 text-base font-bold text-gray-900 bg-green-500 rounded-full shadow-lg hover:scale-105 hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-offset-2 transition-all"
        >
          <span className="absolute inset-0 rounded-full bg-green-300 opacity-0 group-hover:opacity-20 transition-opacity"></span>
          📄 Go to Page 2
        </button>
      </div>

      <footer className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
        <p className="text-sm text-gray-400">
         Make sex not wat ❤️
        </p>
      </footer>
    </div>
  );
};

export default VimeoGrid;
