"use client";

import Sidebar from "../components/Sidebar";
import { MediaGallery } from "../components/shared/MediaGallery";

const SuckPage = () => {
  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <Sidebar />
      <MediaGallery
        apiEndpoint="/api/images/suck"
        videoFilter="suck"
        basePath="suck"
        title="Suck"
      />
    </div>
  );
};

export default SuckPage;
