// components/Pagination.tsx
interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
}

export default function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  maxVisiblePages = 6,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  if (totalPages <= 1) return null;

  const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));

  const getVisiblePages = () => {
    const pages: (number | "ellipsis")[] = [];
    const half = Math.floor(maxVisiblePages / 2);
    const start = clamp(currentPage - half, 1, Math.max(1, totalPages - maxVisiblePages + 1));
    const end = clamp(start + maxVisiblePages - 1, 1, totalPages);

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("ellipsis");
    }

    for (let p = start; p <= end; p++) pages.push(p);

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("ellipsis");
      pages.push(totalPages);
    }

    return pages;
  };

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <nav className="flex justify-center mt-4 gap-2" aria-label="Pagination Navigation">
      <button
        onClick={() => canPrev && onPageChange(currentPage - 1)}
        disabled={!canPrev}
        aria-label="Previous page"
        className={`px-3 py-1 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          canPrev ? "border-white/10 text-white/90 hover:bg-white/10" : "border-white/10 text-white/40 cursor-not-allowed"
        }`}
      >
        Prev
      </button>

      {getVisiblePages().map((item, idx) => (
        item === "ellipsis" ? (
          <span key={`el-${idx}`} className="px-2 py-1 text-white/60 select-none">…</span>
        ) : (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            aria-current={item === currentPage ? "page" : undefined}
            className={`px-3 py-1 rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              item === currentPage
                ? "bg-indigo-600 border-indigo-500 text-white"
                : "border-white/10 text-white/90 hover:bg-white/10"
            }`}
          >
            {item}
          </button>
        )
      ))}

      <button
        onClick={() => canNext && onPageChange(currentPage + 1)}
        disabled={!canNext}
        aria-label="Next page"
        className={`px-3 py-1 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
          canNext ? "border-white/10 text-white/90 hover:bg-white/10" : "border-white/10 text-white/40 cursor-not-allowed"
        }`}
      >
        Next
      </button>
    </nav>
  );
}
