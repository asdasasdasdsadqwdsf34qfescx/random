import Sidebar from "../components/Sidebar";
import { MediaGallery } from "../components/shared/MediaGallery";

const PetitPage = () => {
  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <Sidebar />
      <MediaGallery
        apiEndpoint="/api/images/petit"
        videoFilter=""
        basePath="petit"
        title="Petit"
      />
    </div>
  );
};

export default PetitPage;