import Sidebar from "../components/Sidebar";
import { MediaGallery } from "../components/shared/MediaGallery";

const AsianPage = () => {
  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <Sidebar />
      <MediaGallery
        apiEndpoint="/api/images/hairy"
        videoFilter="hairy"
        basePath="hairy"
        title="Hairy"
      />
    </div>
  );
};

export default AsianPage;