import Sidebar from "../components/Sidebar";
import { MediaGallery } from "../components/shared/MediaGallery";

const KissPage = () => {
  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <Sidebar />
      <MediaGallery
        apiEndpoint="/api/images/kiss"
        videoFilter="kiss"
        basePath="kiss"
        title="Kiss"
      />
    </div>
  );
};

export default KissPage;