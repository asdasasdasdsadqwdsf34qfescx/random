"use client";

interface DetailsSectionProps {
  currentVideoDetails: Record<string, any> | null;
}

const DetailsSection: React.FC<DetailsSectionProps> = ({
  currentVideoDetails,
}) => {

  let tempData = { ...currentVideoDetails };
delete tempData.id;
  
  
  return (
    <div className="w-full bg-gray-900 rounded-xl p-2 shadow-lg border border-gray-700">

      {tempData && (
        <div className="space-y-2">
          {Object.entries(tempData).map(([key, value]) =>
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
        </div>
      )}
    </div>
  );
};

export default DetailsSection;
