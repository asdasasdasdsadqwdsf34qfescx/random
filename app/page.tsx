"use client";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Pagination from "./components/Pagination";
import VideoCard from "./components/VideoCard";
import { getVideosPaths } from "./api";

export default function VideoPage() {
  const [paths, setPaths] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      const data = await getVideosPaths(currentPage, itemsPerPage);
      setPaths(data.videos || []);
      setTotal(data.total || 0);
    };
    fetchData();
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black relative">
      <Sidebar />
      <main className="ml-0 md:ml-64 p-4 md:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {paths.map((path, idx) => (
            <VideoCard key={idx} src={"/videos/" + path.path} />
          ))}
          {paths.length === 0 && (
            <div className="text-white/80 text-lg col-span-full text-center py-12">
              No videos found.
            </div>
          )}
        </div>

        <div className="mt-6 md:mt-8">
          <Pagination
            currentPage={currentPage}
            totalItems={total}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>
    </div>
  );
}
