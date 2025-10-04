import Sidebar from "../components/Sidebar";
import { MediaGallery } from "../components/shared/MediaGallery";

const ScissorsPage = () => {
  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <Sidebar />
      <MediaGallery
        apiEndpoint="/api/images/scissors"
        videoFilter="scissors"
        basePath="scissors"
        title="Scissors"
      />
    </div>
  );
};

export default ScissorsPage;