import DetailsSection from "@/app/Details";
import { VideoModel } from "@/app/types";

export const DetailTab = ({
  currentVideo,
}: {

  currentVideo: VideoModel | null;
}) => {
  return (
    <div className="space-y-2 overflow-auto h-[750px] scrollbar-hide">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl">
        <DetailsSection currentVideoDetails={currentVideo!} />
      </div>
    </div>
  );
};