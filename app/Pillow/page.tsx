import Sidebar from "../components/Sidebar";
import { MediaGallery } from "../components/shared/MediaGallery";

const PillowPage = () => {
  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <Sidebar />
      <MediaGallery
        apiEndpoint="/api/images/pillow"
        videoFilter="pillow"
        basePath="pillow"
        title="Pillow"
      />
    </div>
  );
};

export default PillowPage;