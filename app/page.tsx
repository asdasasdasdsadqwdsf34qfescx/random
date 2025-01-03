"use client";

import { useEffect, useState, useRef } from "react";

const videoIds = [
  "a791d7b41f1be7c02e/947da43d2d6214b9",
  "1191d7b41f1be7ce98/bfbd31f5aabcc6c5",
  "ac91d7b41f1be6c625/5576d82781fa19b0",
  "a791d7b41f1be6c12e/8df10aa081fab588",
  "1191d7b41f1be6cf98/bf5bb6adc7fd352b",
  "4491d7b41f1be6cecd/d1d48f88e84e2bbe",
  "7991d7b41f1be1c0f0/26a40c8f30613870",
  "ac91d7b41f1be1c125/6d069d3e4dfeea2c",
  "0691d7b41f1be1c38f/ab5ce055bef17333",
  "ea91d7b41f1be1c763/2a1834ead945a109",
  "a791d7b41f1be1c62e/cd4dc0fb6a0c6f9d",
  "1191d7b41f1be1c898/0c8c0a436d188d43",
  "4491d7b41f1be1c9cd/c3d62bfbf9f70645",
  "ac91d7b41f1be0c025/d5427fdf14c43880",
  "ac91d7b41f1be1c125/6d069d3e4dfeea2c",
  "4491d7b41f19efc5cd/b3e51782f2c4b3f0",
  "0691d7b41f19eece8f/d0ec49e076efe9ad",
  "ea91d7b41f19eeca63/10d0bc5ed1ed6ca2",
  "4491d7b41f19eec4cd/160b35d4d0617a0c",
  "4d91d7b41f1ae4c0c4/e4cf905ba65d31c6",
  "4d91d7b41f1ae5c1c4/6db93740911ac943",
  "a791d7b41f1ae4c22e/8c99b93f4e1624d2",
  "1191d7b41f1ae4cc98/a28a8ff2e4e6b992",
  "7091d7b41f1ae5c0f9/80e7196e258bb614",
  "a791d7b41f1ae5c32e/13780a3bbb2f160a",
  "ea91d7b41f1ae5c263/980c1e3c91d2c812",
  "1191d7b41f1ae5cd98/c61ca83479d2f93a",
  "7991d7b41f1ae6c6f0/0d90fbe3e2aed503",
  "ac91d7b41f1ae6c725/79745221e1b034e1",
  "d391d7b41f1ae6c45a/77cefaf247f93001",
  "4d91d7b41f1ae6c2c4/53adf8c3f46ba5b7",
  "4491d7b41f1ae6cfcd/214c69ba0969a69d",
  "a791d7b41f1ae6c02e/a12782765939bd88",
  "1191d7b41f1ae6ce98/6c4ec36a9a407c41",
  "ea91d7b41f1be6c063/bb19878c9399002d",
];


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
