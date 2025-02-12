import { useVideoContext } from "@/app/UseState/useStates";

export const SwitchSection = () => {
  const { currentVideo, selectedVideoIndex, setSelectedVideoIndex, showVideo } =
    useVideoContext();

  return (
    <div>
      {" "}
      {currentVideo?.isOnline && showVideo ? (
        <iframe
          id="cam-preview"
          src={`https://chaturbate.com/embed/${currentVideo.name}/?join_overlay=1&campaign=GeOP2&embed_video_only=1&disable_sound=1&tour=9oGW&mobileRedirect=never`}
          width="80%"
          height="90%"
          frameBorder="0"
          className="w-full aspect-video rounded-lg shadow-xl border border-gray-700"
          scrolling="no"
          style={{
            backgroundImage: `url(https://thumb.live.mmcdn.com/ri/${currentVideo.name}.jpg)`,
            backgroundSize: "cover",
            opacity: 1,
          }}
          allowFullScreen
          title="Chaturbate Model"
        ></iframe>
      ) : (
        <iframe
          src={`https://videos.sproutvideo.com/embed/${currentVideo?.videoId[selectedVideoIndex]}?autoplay=true&controls=true`}
          frameBorder="0"
          width="80%"
          height="90%"
          className="w-full aspect-video rounded-lg shadow-xl border border-gray-700"
          allowFullScreen
          title="Vimeo Video"
        ></iframe>
      )}
      {currentVideo && currentVideo?.videoId.length > 1 && (
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {currentVideo?.videoId.map((id, index) => (
            <button
              key={id}
              onClick={() => setSelectedVideoIndex(index)}
              className={`px-3 py-1 rounded-md text-white text-sm font-semibold transition ${
                selectedVideoIndex === index
                  ? "bg-purple-700"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              Video {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
