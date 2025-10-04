"use client";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Pagination from "./components/Pagination";
import { getVideosPaths } from "./api";

export default function VideoPage() {
  const [paths, setPaths] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      const data = await getVideosPaths(currentPage, itemsPerPage);
      setPaths(data.videos);
      setTotal(data.total);
    };
    fetchData();
  }, [currentPage]);
  console.log(paths);

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
      <Sidebar />
      <div className="ml-24 p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paths.map((path, idx) => (
          <div key={idx} className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
            <video
              src={'/videos/' + path.path}
              controls
              className="w-full h-64 object-cover bg-black"
            />
          </div>
        ))}
        {paths.length === 0 && (
          <div className="text-white text-lg col-span-full text-center">
            No videos found.
          </div>
        )}
      </div>

      <div className="ml-24 mt-4">
        <Pagination
          currentPage={currentPage}
          totalItems={total}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
