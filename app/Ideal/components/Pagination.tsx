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
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          className="text-white px-3 py-1 rounded hover:bg-gray-700"
        >
          Prev
        </button>
  
        {getVisiblePages().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded ${
              page === currentPage
                ? "bg-white text-black"
                : "text-white hover:bg-gray-700"
            }`}
          >
            {page}
          </button>
        ))}
  
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          className="text-white px-3 py-1 rounded hover:bg-gray-700"
        >
          Next
        </button>
      </div>
    );
  }
  