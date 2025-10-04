import Sidebar from "../components/Sidebar";
import { MediaGallery } from "../components/shared/MediaGallery";

const DoggyPage = () => {
  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <Sidebar />
      <MediaGallery
        apiEndpoint="/api/images/doggy"
        videoFilter="doggy"
        basePath="doggy"
        title="Doggy"
      />
    </div>
  );
};

export default DoggyPage;