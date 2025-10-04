import Image from "next/image";

interface ModelCardProps {
  photo: string;
  basePath: string;
  onPhotoClick: (photo: string) => void;
  onMiddleClick?: (photo: string) => void;
}

export const ModelCard = ({ photo, basePath, onPhotoClick, onMiddleClick }: ModelCardProps) => (
  <div
    className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
    onClick={() => onPhotoClick(photo)}
    onMouseDown={(e) => {
      if (e.button === 1 && onMiddleClick) {
        e.preventDefault();
        onMiddleClick(photo);
      }
    }}
  >
    <div className="aspect-square relative overflow-hidden">
      <Image
        src={`/${basePath}/${photo}`}
        alt={photo}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </div>
    <div className="p-3">
      <p className="text-sm font-medium text-gray-900 truncate">
        {photo.replace(/\.[^.]+$/, "")}
      </p>
    </div>
  </div>
);
