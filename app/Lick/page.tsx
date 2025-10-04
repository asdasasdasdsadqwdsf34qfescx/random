import Sidebar from "../components/Sidebar";
import { MediaGallery } from "../components/shared/MediaGallery";

const LickPage = () => {
  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <Sidebar />
      <MediaGallery
        apiEndpoint="/api/images/lick"
        videoFilter="lick"
        basePath="lick"
        title="Lick"
      />
    </div>
  );
};

export default LickPage;