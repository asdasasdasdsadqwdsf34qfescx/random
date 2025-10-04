"use client";

import Sidebar from "../components/Sidebar";
import { MediaGallery } from "../components/shared/MediaGallery";

const DildoPage = () => {
  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <Sidebar />
      <MediaGallery
        apiEndpoint="/api/images/dildo"
        videoFilter="dildo"
        basePath="dildo"
        title="Dildo"
      />
    </div>
  );
};

export default DildoPage;