interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const TabButton = ({ label, isActive, onClick }: TabButtonProps) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 font-semibold text-sm transition-all duration-200 border-b-2 ${
      isActive
        ? 'text-blue-600 border-blue-600 bg-blue-50'
        : 'text-gray-600 border-transparent hover:text-blue-500 hover:border-blue-300'
    }`}
  >
    {label}
  </button>
);
