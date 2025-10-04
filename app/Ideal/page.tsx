import Sidebar from "../components/Sidebar";
import { MediaGallery } from "../components/shared/MediaGallery";

const IdealPage = () => {
  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <Sidebar />
      <MediaGallery
        apiEndpoint="/api/images/ideal"
        videoFilter=""
        basePath="ideal"
        title="Ideal"
      />
    </div>
  );
};

export default IdealPage;