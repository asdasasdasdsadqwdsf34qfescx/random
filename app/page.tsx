"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { videoIds } from "./ids";

const VimeoGrid = () => {
  const [currentVideo, setCurrentVideo] = useState(videoIds[Math.floor(Math.random() * videoIds.length)]);
  const router = useRouter();

  const handleRandomVideo = () => {
    const randomIndex = Math.floor(Math.random() * videoIds.length);
    setCurrentVideo(videoIds[randomIndex]);
  };

  const navigateToPage2 = () => {
    router.push("/page2"); // Navigate to page2.tsx
  };

  return (
    <div style={{ height: "100vh",  }}>
      <div style={{ position: "relative", width: "100%", paddingTop: "50%" }}>
        <iframe
          src={`https://videos.sproutvideo.com/embed/${currentVideo}?autoplay=true&controls=true`}
          frameBorder="0"
          allow="autoplay"
          allowFullScreen
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          title="Fullscreen Video"
        ></iframe>

        <button
          onClick={handleRandomVideo}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            border: "none",
            backgroundColor: "#007BFF",
            color: "white",
            borderRadius: "5px",
            zIndex: 1000,
          }}
        >
          Change Video
        </button>

        <button
          onClick={navigateToPage2}
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            border: "none",
            backgroundColor: "#28A745",
            color: "white",
            borderRadius: "5px",
            zIndex: 1000,
          }}
        >
          Go to Page 2
        </button>
      </div>
    </div>
  );
};

export default VimeoGrid;
