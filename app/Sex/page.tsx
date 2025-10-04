import Sidebar from "../components/Sidebar";
import { MediaGallery } from "../components/shared/MediaGallery";

const SexPage = () => {
  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <Sidebar />
      <MediaGallery
        apiEndpoint="/api/images/sex"
        videoFilter="sex"
        basePath="sex"
        title="Sex"
      />
    </div>
  );
};

export default SexPage;