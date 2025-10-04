"use client";

import Sidebar from "../components/Sidebar";
import { MediaGallery } from "../components/shared/MediaGallery";

const BoobsPage = () => {
  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <Sidebar />
      <MediaGallery
        apiEndpoint="/api/images/boobs"
        videoFilter=""
        basePath="boobs"
        title="Boobs"
      />
    </div>
  );
};

export default BoobsPage;
