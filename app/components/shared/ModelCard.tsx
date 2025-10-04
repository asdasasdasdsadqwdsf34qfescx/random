import Image from "next/image";

interface ModelCardProps {
  photo: string;
  basePath: string;
  onPhotoClick: (photo: string) => void;
  onMiddleClick?: (photo: string) => void;
}

export const ModelCard = ({ photo, basePath, onPhotoClick, onMiddleClick }: ModelCardProps) => (
  <div
    role="button"
    tabIndex={0}
    className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-transform duration-300 overflow-hidden hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-400"
    onClick={() => onPhotoClick(photo)}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onPhotoClick(photo);
      }
    }}
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
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-2 left-2 right-2 pointer-events-none">
        <p className="text-sm font-medium text-white drop-shadow truncate">
          {photo.replace(/\.[^.]+$/, "")}
        </p>
      </div>
    </div>
  </div>
);
