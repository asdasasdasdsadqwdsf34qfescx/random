"use client";

import { useEffect, useState, useRef, SetStateAction } from "react";
import { videoIds } from "../ids";

const VimeoGrid = () => {
  const players = useRef(new Map()); // Ref to store player instances
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [visibleVideos, setVisibleVideos] = useState([]);
  const [loadCount, setLoadCount] = useState(16); // Number of videos to load at a time

  useEffect(() => {
    // Initialize visible videos with the first batch
    setVisibleVideos(videoIds.slice(0, loadCount));
  }, [loadCount]);

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
      player.play();
    });

    iframe.addEventListener("mouseleave", () => {
      player.pause();
    });
  };

  const openModal = (videoId: any) => {
    setSelectedVideo(videoId);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedVideo(null);
  };

  const loadMoreVideos = () => {
    const nextBatch = videoIds.slice(visibleVideos.length, visibleVideos.length + loadCount);
    setVisibleVideos((prev) => [...prev, ...nextBatch]);
  };

  return (
    <div>
      <div className="video-grid">
        {visibleVideos.map((id, i) => (
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

            {/* Dynamic Vimeo iFrame */}
            <iframe
              data-vimeo
              data-id={id}
              src={`https://videos.sproutvideo.com/embed/${id}?bigPlayButton=false&showControls=false`}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write,background"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: "0",
              }}
              title={`Video ${i + 1}`}
            />
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {visibleVideos.length < videoIds.length && (
        <button onClick={loadMoreVideos} style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}>
          Load More Videos
        </button>
      )}

      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <iframe
              className="sproutvideo-player"
              src={`https://videos.sproutvideo.com/embed/${selectedVideo}`}
              width="640"
              height="360"
              frameBorder="0"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title="Video Player"
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
