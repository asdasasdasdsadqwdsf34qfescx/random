import Image from "next/image";

interface ModelCardProps {
  photo?: string;
  basePath?: string;
  imageSrc?: string;
  name?: string;
  onPhotoClick: (photoOrName: string) => void;
  onMiddleClick?: (photoOrName: string) => void;
  tags?: string[];
  checked?: boolean;
}

export const ModelCard = ({ photo, basePath = "", imageSrc, name, onPhotoClick, onMiddleClick, tags = [], checked = false }: ModelCardProps) => {
  const label = name || (photo ? photo.replace(/\.[^.]+$/, "") : "");
  const isExternal = typeof imageSrc === "string" && /^(https?:)?\/\//i.test(imageSrc);
  const src = imageSrc || (photo && basePath ? `/${basePath}/${photo}` : "");

  return (
    <div
      role="button"
      tabIndex={0}
      className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-transform duration-300 overflow-hidden hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-emerald-400"
      onClick={() => onPhotoClick(label)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onPhotoClick(label);
        }
      }}
      onMouseDown={(e) => {
        if (e.button === 1 && onMiddleClick) {
          e.preventDefault();
          onMiddleClick(label);
        }
      }}
    >
      <div className="aspect-square relative overflow-hidden">
        {isExternal ? (
          <img src={src} alt={label} className="w-full h-full object-cover" />
        ) : (
          <Image src={src} alt={label} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        )}
        {checked && (
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
            <svg viewBox="0 0 20 20" className="w-4 h-4" aria-hidden>
              <path fill="currentColor" d="M7.629 13.314a1 1 0 0 1-1.258.062l-.095-.082-2.5-2.5a1 1 0 0 1 1.32-1.497l.094.083L7 10.586l6.439-6.44a1 1 0 0 1 1.497 1.32l-.083.094-7 7-.062.055-.074.054Z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-2 left-2 right-2 pointer-events-none">
          <span className="inline-block max-w-full bg-black/70 text-white text-xs sm:text-sm font-medium px-2 py-1 rounded-md truncate">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
};
