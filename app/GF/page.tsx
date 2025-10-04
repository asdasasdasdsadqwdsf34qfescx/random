import Sidebar from "../components/Sidebar";
import { MediaGallery } from "../components/shared/MediaGallery";

const GFPage = () => {
  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <Sidebar />
      <MediaGallery
        apiEndpoint="/api/images/photos"
        videoFilter=""
        basePath="photos"
        title="GF"
      />
    </div>
  );
};

export default GFPage;