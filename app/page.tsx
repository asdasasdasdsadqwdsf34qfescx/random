"use client";

import { useEffect, useState, useRef } from "react";

const videoIds = [
  "ac91d7b51d1ee3c525/ac4e9fc87cdcd050",
  "7091d7b51d1febc8f9/3087cba4e4754dc5",
  "0691d7b51d1febce8f/28a7e147af708498",
  "1191d7b51d1feac498/562aee1d51848b5a",
  "0691d7b51d1feacf8f/680df57aac8a7640",
  "7991d7b51d1feaccf0/cdee72305fc08b6d",
  "a791d7b51d1fe5c52e/33041001bacda8d2",
  "1191d7b4191de7ce98/8e59794be4e84f90",
  "ea91d7b4191de7c163/a628f529b13229b0",
  "7091d7b4191de7c3f9/e2c99e4d9cb8b01b",
  "4d91d7b4191de7c2c4/690508e3e3c506b4",
  "0691d7b4191de7c58f/08ad122553281077",
  "ac91d7b4191de7c725/023dec2eb86e5b63",
  "4491d7b4191de4cccd/7a44b6dd4362d812",
  "7091d7b4191de4c0f9/6d7a5e130e1ff6ec",
  "d391d7b4191de4c75a/060af59b5c515457",
  "ac91d7b4191de4c425/5d97ea59ec554751",
  "4491d7b4191de5cdcd/b94d24bf08759604",
  "ea91d7b4191de5c363/09bd3fcc3be70592",
  "1191d7b4191cedc598/4b2e1363e6b494c8",
  "ac91d7b4191cedcc25/0a255ea8a34253bd",
  "a791d7b4191cecca2e/441ff49a04c9adda",
  "7091d7b4191cecc9f9/6a473417c7412a64",
  "4d91d7b4191cedc9c4/95222890dda33b67",
  "4d91d7b4191cecc8c4/47903618f1a25689",
  "a791d7b4191de4c32e/c49ae4c7af8dad8f",
  "4491d7b51d1feac5cd/61e08f43792f21c3",
  "d391d7b4191cecce5a/386c37093c9101c0",
  "4491d7b4191ce3cacd/586b1d56855a6a57",
  "ea91d7b4191ce3c463/6b8a79417b492de8",
  "a791d7b4191ce3c52e/5f49569ffdd3df20",
  "d391d7b4191ce3c15a/0a68ddd0a8300644",
  "ac91d7b4191ce3c225/ca6080cb0b89c794",
  "1191d7b4191ce2ca98/204a7be438701eb2",
  "ea91d7b4191ce2c563/5b3250c8b4db907c",
  "a791d7b41c1de3c12e/79d0393d9ddadc58",
  "7091d7b41c1de3c2f9/1309fecbaea60d7a",
  "ac91d7b41c1de3c625/2ff9ca1c22a8655f",
  "7991d7b41c1de3c7f0/73e6b99acbb32e94",
  "4491d7b41c1de2cfcd/c5900c7e779dfe3b",
  "1191d7b41c1de2ce98/07905bf925f886dd",
  "a791d7b41c1de2c02e/dbcd38cca0e46d68",
  "7091d7b41c1de2c3f9/a22456ee9a9a775e",
  "ac91d7b41c1de2c725/032a0a4366cab271",
  "7991d7b41c1de2c6f0/978fe1e2def53232",
  "4491d7b41c1de1cccd/a52cdaf2d585f34a",
  "ea91d7b41c1de1c263/5da9531fc7723bec",
  "7091d7b41c1de1c0f9/0bf98e31c0a31cd0",
  "ac91d7b41c1de1c425/15fb03497126559d",
  "1191d7b41c1de0cc98/55350c2eaaef45cd",
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
