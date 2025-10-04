import Sidebar from "../components/Sidebar";
import { MediaGallery } from "../components/shared/MediaGallery";

const RidePage = () => {
  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <Sidebar />
      <MediaGallery
        apiEndpoint="/api/images/ride"
        videoFilter="ride"
        basePath="ride"
        title="Ride"
      />
    </div>
  );
};

export default RidePage;