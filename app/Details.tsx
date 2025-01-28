'use client';
const DetailsSection = ({ currentVideoDetails, showDetails, setShowDetails, calculateAverage }) => {
  return (
    <div className="w-full bg-gray-900 rounded-xl p-4 shadow-lg border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-yellow-300">Details</h2>
      </div>
      {showDetails && currentVideoDetails && (
        <div className="space-y-2">
          {Object.entries(currentVideoDetails).map(([key, value]) =>
            typeof value === "number" ? (
              <div key={key} className="flex flex-col">
                <div className="flex justify-between items-center text-gray-300 text-xs">
                  <span className="capitalize font-medium">{key}:</span>
                  <span className="text-yellow-400">{value}/10</span>
                </div>
                <div className="relative w-full h-1 bg-gray-700 rounded-md overflow-hidden">
                  <div
                    className="absolute h-full bg-yellow-500"
                    style={{ width: `${value * 10}%` }}
                  ></div>
                </div>
              </div>
            ) : null
          )}

          <div className="mt-3 border-t border-gray-700 pt-3">
            <div className="flex justify-between items-center text-gray-300 text-xs">
              <span className="font-medium">Average:</span>
              <span className="text-yellow-400">
                {calculateAverage(currentVideoDetails)}/10
              </span>
            </div>
            <div className="relative w-full h-2 bg-gray-700 rounded-md overflow-hidden">
              <div
                className="absolute h-full bg-yellow-500"
                style={{
                  width: `${(calculateAverage(currentVideoDetails) / 10) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailsSection;