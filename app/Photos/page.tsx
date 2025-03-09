"use client";
import { useState, useEffect } from "react";
import { getPhoto, addPhoto } from "../ids";
import Sidebar from "../components/Sidebar";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Plus } from "lucide-react";

const Photos = () => {
  const [photos, setPhotos] = useState<{ id: string; link: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newPhotoLink, setNewPhotoLink] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const details = await getPhoto();
        if (details) {
          setPhotos(details as { id: string; link: string }[]);
        }
      } catch (error) {
        console.error("Error fetching photo data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 120000);
    return () => clearInterval(interval);
  }, []);

  // Open a photo by setting its link as the selectedPhoto
  const openPhoto = (link: string, index: number) => {
    setSelectedPhoto(link);
    setCurrentIndex(index);
  };

  // Navigate between photos and update the selectedPhoto accordingly
  const navigatePhotos = (direction: "prev" | "next") => {
    let newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= photos.length) newIndex = 0;
    if (newIndex < 0) newIndex = photos.length - 1;
    setCurrentIndex(newIndex);
    setSelectedPhoto(photos[newIndex].link);
  };

  // Handle adding a new photo via the addPhoto function
  const handleAddPhoto = async () => {
    if (newPhotoLink.trim() === "") return;
    try {
      await addPhoto(newPhotoLink);
      // Optionally, you could refresh your photos list here
      setNewPhotoLink("");
      setIsAddModalOpen(false);
      const details = await getPhoto();
        if (details) {
          setPhotos(details as { id: string; link: string }[]);
        }
    } catch (error) {
      console.error("Error adding photo:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-stone-900 to-charcoal-900 relative overflow-hidden">
      <Sidebar />
      <div className="pl-24 pr-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-gradient-to-br from-stone-800 to-zinc-900 animate-pulse rounded-2xl shadow-xl"
              >
                <div className="w-full h-full rounded-2xl bg-stone-700/20" />
              </div>
            ))}
          </div>
        ) : photos.length > 0 ? (
          <div className="masonry-grid gap-8">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="relative group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
                onClick={() => openPhoto(photo.link, index)}
              >
                <img
                  src={photo.link}
                  alt="thumbnail-2"
                  width={800}
                  height={1200}
                  className="rounded-3xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-3xl z-10" />
                <div className="absolute bottom-6 left-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                  <span className="text-sm font-light text-stone-200 bg-black/30 px-4 py-2 rounded-full">
                    View Masterpiece
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[80vh]">
            <div className="text-center space-y-6">
              <div className="text-8xl text-amber-100/20 mb-6">🖼</div>
              <h3 className="text-2xl font-light text-stone-300">
                Gallery Awaits Your Vision
              </h3>
              <p className="text-stone-500 font-light">
                Curated photography collection coming soon
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Photo Viewer Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex items-center justify-center p-8">
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-8 right-8 text-stone-300 hover:text-white transition-colors"
          >
            <X size={32} />
          </button>

          <div className="relative max-w-[90vw] max-h-[90vh]">
            <img
              src={selectedPhoto}
              alt="thumbnail-2"
              width={500}
              height={700}
            />
            <div className="absolute inset-y-0 left-0 flex items-center -translate-x-16">
              <button
                onClick={() => navigatePhotos("prev")}
                className="p-4 text-stone-300 hover:text-white transition-colors"
              >
                <ChevronLeft size={48} />
              </button>
            </div>

            <div className="absolute inset-y-0 right-0 flex items-center translate-x-16">
              <button
                onClick={() => navigatePhotos("next")}
                className="p-4 text-stone-300 hover:text-white transition-colors"
              >
                <ChevronRight size={48} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Add Photo Button */}
      <button
        className="fixed right-4 bottom-4 bg-gradient-to-r from-stone-800 to-zinc-700 p-4 rounded-full shadow-xl hover:scale-105 transition-all"
        onClick={() => setIsAddModalOpen(true)}
      >
        <Plus size={24} className="text-stone-300" />
      </button>

      {/* Add Photo Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50 flex items-center justify-center p-8">
          <div className="bg-stone-900 p-8 rounded-2xl shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-stone-300 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-semibold text-stone-200 mb-4">
              Adaugă fotografie
            </h2>
            <input
              type="text"
              placeholder="Link fotografie"
              value={newPhotoLink}
              onChange={(e) => setNewPhotoLink(e.target.value)}
              className="w-full p-2 rounded-md bg-stone-800 text-stone-200 placeholder-stone-400 mb-4"
            />
            <button
              onClick={handleAddPhoto}
              className="w-full py-2 bg-gradient-to-r from-stone-800 to-zinc-700 text-stone-200 rounded-md hover:scale-105 transition-all"
            >
              Adaugă
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Photos;
