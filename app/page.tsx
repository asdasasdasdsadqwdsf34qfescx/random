"use client";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Pagination from "./components/Pagination";
import VideoCard from "./components/VideoCard";
import { getVideosPaths } from "@/lib/clientApi";
import { useSidebar } from "./components/ui/SidebarContext";

interface VideoPath { path: string }
interface VideoResponse { videos: VideoPath[]; total: number }

export default function VideoPage() {
  const [paths, setPaths] = useState<VideoPath[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 6;

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = (await getVideosPaths(currentPage, itemsPerPage)) as VideoResponse;
        if (!cancelled) {
          setPaths(data.videos || []);
          setTotal(data.total || 0);
        }
      } catch (e) {
        if (!cancelled) {
          setError("Failed to load videos");
          setPaths([]);
          setTotal(0);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [currentPage]);

  const { isOpen } = useSidebar();

  return (
    <div className="relative">
      <Sidebar />
      <section className={`${isOpen ? "md:ml-64" : "md:ml-0"} ml-0 py-4 md:py-8 transition-[margin] duration-300`}>
        <h1 className="sr-only">Latest Videos</h1>
        {error && (
          <div role="alert" className="mb-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {loading
            ? Array.from({ length: itemsPerPage }).map((_, i) => (
                <div key={i} className="bg-gray-800/80 rounded-xl shadow-xl overflow-hidden border border-white/10">
                  <div className="w-full h-64 bg-gray-700 animate-pulse" />
                </div>
              ))
            : paths.map((path, idx) => (
                <VideoCard key={idx} src={"/videos/" + path.path} />
              ))}
          {!loading && paths.length === 0 && (
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
      </section>
    </div>
  );
}
