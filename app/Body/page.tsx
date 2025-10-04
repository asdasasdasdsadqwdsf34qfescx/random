"use client";

import Sidebar from "../components/Sidebar";
import { MediaGallery } from "../components/shared/MediaGallery";

const BodyPage = () => {
  return (
    <div className="flex w-full min-h-screen bg-gray-50">
      <Sidebar />
      <MediaGallery
        apiEndpoint="/api/images/body"
        videoFilter="body"
        basePath="body"
        title="Body"
      />
    </div>
  );
};

export default BodyPage;
