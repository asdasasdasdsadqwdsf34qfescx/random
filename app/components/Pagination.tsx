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
    const totalPages = Math.ceil(totalItems / itemsPerPage);
  
    const getVisiblePages = () => {
      let start = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
      let end = start + maxVisiblePages - 1;
  
      if (end > totalPages) {
        end = totalPages;
        start = Math.max(end - maxVisiblePages + 1, 1);
      }
  
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };
  
    if (totalPages <= 1) return null;
  
    return (
      <div className="flex justify-center mt-4 gap-2">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          className="px-3 py-1 rounded-md border border-white/10 text-white/90 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Prev
        </button>

        {getVisiblePages().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              page === currentPage
                ? "bg-indigo-600 border-indigo-500 text-white"
                : "border-white/10 text-white/90 hover:bg-white/10"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          className="px-3 py-1 rounded-md border border-white/10 text-white/90 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Next
        </button>
      </div>
    );
  }
