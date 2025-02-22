"use client";

interface DetailsSectionProps {
  currentVideoDetails: Record<string, any> | null;
}

const getColorForRank = (rank: number): string => {
  if (rank === 1) return "bg-pink-500";
  if (rank >= 2 && rank <= 4) return "bg-green-500";
  if (rank >= 5 && rank <= 20) return "bg-yellow-500";
  if (rank >= 21 && rank <= 50) return "bg-purple-500";
  if (rank >= 51 && rank <= 100) return "bg-blue-500";
  if (rank >= 101 && rank <= 170) return "bg-indigo-500";
  return "bg-red-500";
};

const getWidthForRank = (rank: number): string => {
  if (rank === 1) return "100%";
  if (rank >= 2 && rank <= 4) return "95%";
  if (rank >= 5 && rank <= 20) return "75%";
  if (rank >= 21 && rank <= 50) return "65%";
  if (rank >= 51 && rank <= 100) return "45%";
  if (rank >= 101 && rank <= 170) return "25%";
  return "10%";
};

const DetailsSection: React.FC<DetailsSectionProps> = ({
  currentVideoDetails,
}) => {
  if (!currentVideoDetails) return null;

  // Excludem câteva proprietăți care nu sunt necesare
  const tempData = { ...currentVideoDetails };
  delete tempData.id;
  delete tempData.videoCount;
  delete tempData.onlineCount;
  delete tempData.averageRating;

  return (
    <div className="w-full bg-gray-900 rounded-xl p-2 shadow-lg border border-gray-700">
      {Object.entries(tempData).map(([key, value]) =>
        typeof value === "number" ? (
          <div key={key} className="space-y-2 mb-2">
            <div className="flex justify-between items-center text-gray-300 text-xs">
              <span className="capitalize font-medium">{key}:</span>
              <span
                className={`${getColorForRank(
                  value
                )} px-2 py-1 rounded text-white inline-block w-32 text-center`}
              >
                Place: {value}
              </span>
            </div>
            <div className="relative w-full h-1 bg-gray-700 rounded-md overflow-hidden">
              <div
                className={`${getColorForRank(value)} absolute h-full`}
                style={{ width: getWidthForRank(value) }}
              ></div>
            </div>
          </div>
        ) : null
      )}
    </div>
  );
};

export default DetailsSection;
