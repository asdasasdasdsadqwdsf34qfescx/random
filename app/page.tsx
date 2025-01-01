"use client";

import { useEffect, useRef } from "react";

const videoIds = [
  "1043181960",
  "1043181960",
  "1043179505",
  "1043179505",
  "1043179505",
  // Add more IDs here
];

const VimeoGrid = () => {
  const players = useRef(new Map()); // Ref to store player instances

  useEffect(() => {
    // Load Vimeo Player API script
    const script = document.createElement("script");
    script.src = "https://player.vimeo.com/api/player.js";
    script.async = true;
    script.onload = setupVideoObservers;
    document.body.appendChild(script);

    return () => {
      // Cleanup script if component unmounts
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
    const player = new window.Vimeo.Player(iframe);
    const videoId = iframe.dataset.id; // Video ID from iframe's data attribute

    // Save player instance to Map
    players.current.set(videoId, player);

    // Add hover events
    iframe.addEventListener("mouseenter", () => {
      player.play();
    });

    iframe.addEventListener("mouseleave", () => {
      player.pause();
    });
  };

  // Play video by ID
  const playVideoById = (videoId: string) => {
    const player = players.current.get(videoId);
    if (player) {
      player.play();
    } else {
      console.error(`Player for video ID ${videoId} not found.`);
    }
  };

  return (
    <div>
      {/* Video Grid */}
      <div className="video-grid">
        {videoIds.map((id, i) => (
          <div className="video-container" key={i}>
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
              }}
              title={`Video ${i + 1}`}
            ></iframe>
          </div>
        ))}
      </div>

      {/* Example Button to Control a Video */}
      <button onClick={() => playVideoById("1043181960")}>
        Play Video 1
      </button>

      <style jsx>{`
        .video-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr); /* 4 equal columns */
          gap: 20px;
        }
        .video-container {
          position: relative;
          padding-top: 56.25%; /* 16:9 aspect ratio */
        }
        iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 0;
        }

        @media (max-width: 1024px) {
          .video-grid {
            grid-template-columns: repeat(2, 1fr); /* 2 columns for medium screens */
          }
        }

        @media (max-width: 768px) {
          .video-grid {
            grid-template-columns: 1fr; /* 1 column for small screens */
          }
        }
      `}</style>
    </div>
  );
};

export default VimeoGrid;
