import Sidebar from "../components/Sidebar";
import { MediaGallery } from "../components/shared/MediaGallery";

const UnderPage = () => {
  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <Sidebar />
      <MediaGallery
        apiEndpoint="/api/images/under"
        videoFilter="under"
        basePath="under"
        title="Under"
      />
    </div>
  );
};

export default UnderPage;