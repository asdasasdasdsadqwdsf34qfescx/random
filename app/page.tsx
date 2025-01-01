"use client";

import { useEffect, useState, useRef } from "react";

const videoIds = ["1043181960", "1043211102", "1043179505", "1043211930"];

const VimeoGrid = () => {
  const players = useRef(new Map()); // Ref to store player instances
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://player.vimeo.com/api/player.js";
    script.async = true;
    script.onload = setupVideoObservers;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const setupVideoObservers = () => {
    const iframes = document.querySelectorAll("iframe[data-vimeo]");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const iframe = entry.target;
          initializePlayer(iframe);
          observer.unobserve(iframe); // Stop observing after initialization
        }
      });
    });

    iframes.forEach((iframe) => observer.observe(iframe));
  };

  const initializePlayer = (iframe: any) => {
    if (!window.Vimeo) {
      console.error("Vimeo Player is not available yet.");
      return;
    }
    const player = new window.Vimeo.Player(iframe);
    const videoId = iframe.dataset.id; // Video ID from iframe's data attribute
    players.current.set(videoId, player);

    iframe.addEventListener("mouseenter", () => {
      console.log("Hover started, playing video:", videoId);
      player.play();
    });

    iframe.addEventListener("mouseleave", () => {
      console.log("Hover ended, pausing video:", videoId);
      player.pause();
    });
  };

  const openModal = (videoId: string) => {
    console.log("Opening modal for video:", videoId);
    setSelectedVideo(videoId);
    setModalOpen(true);
  };

  const closeModal = () => {
    console.log("Closing modal...");
    setModalOpen(false);
    setSelectedVideo(null);
  };

  return (
    <div>
      <div className="video-grid">
        {videoIds.map((id, i) => (
          <div
            className="video-container"
            key={i}
            style={{
              position: "relative",
              paddingTop: "56.25%",
              background: "#ddd",
            }}
          >
            {/* Upper Zone: Transparent, allows hover events to pass through */}
            <div
              className="hover-zone"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "50%",
                pointerEvents: "none", // Allow mouse events to pass through
                zIndex: 2,
              }}
            ></div>

            {/* Lower Zone: Click for modal */}
            <div
              className="click-zone"
              onClick={() => openModal(id)}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "50%",
                pointerEvents: "auto", // Enable clicks
                cursor: "pointer",
                zIndex: 3,
                background: "rgba(0, 0, 0, 0)", // Transparent
              }}
            ></div>

            {/* Vimeo iFrame */}
            <iframe
              data-vimeo
              data-id={id}
              src={`https://player.vimeo.com/video/${id}?badge=0&autopause=0&player_id=${i}&app_id=58479&background=1&autoplay=0`}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "0",
              }}
              title={`Video ${i + 1}`}
            ></iframe>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <iframe
              src={`https://player.vimeo.com/video/${selectedVideo}?autoplay=1`}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              style={{
                width: "100%",
                height: "100%",
              }}
              title={`Selected Video`}
            ></iframe>
            <button className="close-button" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .video-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }
        .video-container {
          position: relative;
        }
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          position: relative;
          width: 80%;
          height: 60%;
        }
        .close-button {
          position: absolute;
          top: 10px;
          right: 10px;
          background: red;
          color: white;
          border: none;
          padding: 10px;
          border-radius: 50%;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default VimeoGrid;
