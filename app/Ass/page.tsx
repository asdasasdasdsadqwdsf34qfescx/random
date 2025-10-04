import Sidebar from "../components/Sidebar";
import { MediaGallery } from "../components/shared/MediaGallery";

const AssPage = () => {
  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <Sidebar />
      <MediaGallery
        apiEndpoint="/api/images/ass"
        videoFilter=""
        basePath="ass"
        title="Ass"
      />
    </div>
  );
};

export default AssPage;