import Sidebar from "../components/Sidebar";
import { MediaGallery } from "../components/shared/MediaGallery";

const MoaningPage = () => {
  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <Sidebar />
      <MediaGallery
        apiEndpoint="/api/images/moaning"
        videoFilter="moaning"
        basePath="moaning"
        title="Moaning"
      />
    </div>
  );
};

export default MoaningPage;