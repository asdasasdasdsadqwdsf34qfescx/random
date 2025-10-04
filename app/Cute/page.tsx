import Sidebar from "../components/Sidebar";
import { MediaGallery } from "../components/shared/MediaGallery";

const CutePage = () => {
  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <Sidebar />
      <MediaGallery
        apiEndpoint="/api/images/cute"
        videoFilter=""
        basePath="cute"
        title="Cute"
      />
    </div>
  );
};

export default CutePage;