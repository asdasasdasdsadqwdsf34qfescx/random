"use client";
import { VideoModel } from "@/app/types";
import { useState, useEffect } from "react";
import { getData } from "../ids";
import Sidebar from "../components/Sidebar";
import Link from "next/link";

const OnlineTab = () => {
  const [online, setOnline] = useState<VideoModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPinned, setShowPinned] = useState(true); // Stare pentru modelele fixate

  // Modelele fixate pe care vrei să le afișezi permanent
  const pinnedModels = [
    { name: "agnieszkabanana", isOnline: true /*, ...alte proprietăți */ },
    { name: "tender_diana", isOnline: true /*, ...alte proprietăți */ },
    { name: "swt_shadow", isOnline: true /*, ...alte proprietăți */ },
    { name: "lizamyah", isOnline: true /*, ...alte proprietăți */ },

    // Poți adăuga mai multe modele aici lizamyah
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const details = await getData();
        if (details) {
          const onlineModels = details.filter((video) => video.isOnline);
          setOnline(onlineModels);
        }
      } catch (error) {
        console.error("Error fetching video data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 120000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen relative overflow-hidden">
      <Sidebar />

      {/* Elemente de fundal animate */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute w-96 h-96 bg-emerald-500/20 rounded-full -top-48 -left-48 mix-blend-screen" />
        <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full -bottom-48 -right-48 mix-blend-screen" />
      </div>

      {/* Buton de toggle pentru modelele fixate */}
      <div className="relative z-10 mb-4">
        <button
          onClick={() => setShowPinned((prev) => !prev)}
          className="px-4 py-2 bg-slate-700 text-white rounded"
        >
          {showPinned ? "Ascunde modelele fixe" : "Arată modelele fixe"}
        </button>
      </div>

      {/* Afișarea modelelor fixate, dacă showPinned este true */}
      {showPinned && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 relative z-10 mb-8">
          {pinnedModels.map((model) => (
            <div
              key={model.name}
              className="group relative bg-slate-800/20 rounded-xl overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:z-20 border border-slate-700/30 hover:border-emerald-400/30"
            >
              <div className="aspect-video relative flex flex-col justify-center items-center">
                {/* Two buttons that redirect to the Chaturbate room for the given model */}
                <a
                  href={`https://chaturbate.com/in/?tour=7Bge&campaign=3YHSK&track=default&room=${model.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-2 px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors"
                >
                  Watch {model.name}
                </a>
                <a
                  href={`https://chaturbate.com/in/?tour=7Bge&campaign=3YHSK&track=default&room=${model.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors"
                >
                  Enter Room
                </a>
                {/* Overlay with model information */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/95 via-slate-900/60 to-transparent p-4 pt-8">
                  <h3 className="font-bold text-white text-lg truncate drop-shadow-lg">
                    {model.name}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Afișarea modelelor online */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 relative z-10">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="aspect-video bg-slate-800/50 rounded-xl animate-pulse"
            >
              <div className="h-full w-full bg-slate-700/30 rounded-xl" />
            </div>
          ))}
        </div>
      ) : online.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 relative z-10">
          {online.map((model) => (
            <div
              key={model.name}
              className="group relative bg-slate-800/20 rounded-xl overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:z-20 border border-slate-700/30 hover:border-emerald-400/30"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="aspect-video relative">
                <iframe
                  src={`https://chaturbate.com/embed/${model.name}/?join_overlay=1&campaign=GeOP2&embed_video_only=1&disable_sound=1&tour=9oGW&mobileRedirect=never&disable_autoplay=1`}
                  className="w-full h-full object-cover rounded-t-xl"
                  frameBorder="0"
                  scrolling="no"
                  allowFullScreen
                  title={`${model.name} Live Cam`}
                />
                <Link
                  href={`/profile/${model.name}?id=${model.id}`}
                  key={model.name}
                >
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/95 via-slate-900/60 to-transparent p-4 pt-8">
                    <h3 className="font-bold text-white text-lg truncate drop-shadow-lg">
                      {model.name}
                    </h3>
                  </div>{" "}
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 relative z-10">
          <div className="inline-block bg-slate-800/50 p-8 rounded-2xl border border-slate-700/30">
            <div className="text-6xl mb-4">🌌</div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">
              No Broadcasts Currently Live
            </h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Our elite performers are preparing their next show. Check back
              soon for exclusive live experiences.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnlineTab;
