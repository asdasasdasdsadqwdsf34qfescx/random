import Sidebar from "../components/Sidebar";
import { MediaGallery } from "../components/shared/MediaGallery";

const HandPage = () => {
  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <Sidebar />
      <MediaGallery
        apiEndpoint="/api/images/hand"
        videoFilter="hand"
        basePath="hand"
        title="Hand"
      />
    </div>
  );
};

export default HandPage;