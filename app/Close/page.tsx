"use client";

import Sidebar from "../components/Sidebar";
import { MediaGallery } from "../components/shared/MediaGallery";

const ClosePage = () => {
  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <Sidebar />
      <MediaGallery
        apiEndpoint="/api/images/close"
        videoFilter="close"
        basePath="close"
        title="Galerie Close"
      />
    </div>
  );
};

export default ClosePage;
