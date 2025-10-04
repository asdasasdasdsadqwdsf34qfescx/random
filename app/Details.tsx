"use client";

interface DetailsSectionProps {
  currentVideoDetails: Record<string, any> | null;
}

const CATEGORIES = [
  { name: "Celestial 💠", pts: 100, color: "bg-green-700" },
  { name: "Imperial 👑", pts: 90, color: "bg-green-600" },
  { name: "Prestige 🏅", pts: 80, color: "bg-green-500" },
  { name: "Prime ✨", pts: 70, color: "bg-green-400" },
  { name: "Superior 🏆", pts: 60, color: "bg-green-300" },
  { name: "Refined 🎭", pts: 50, color: "bg-gray-200" },
  { name: "Select 🔹", pts: 40, color: "bg-gray-100" },
  { name: "Emerging 🌱", pts: 30, color: "bg-gray-400" },
  { name: "Aspiring 🚀", pts: 20, color: "bg-gray-500" },
  { name: "Novice 🌟", pts: 10, color: "bg-gray-600" },
];



const getCategoryForScore = (score: number) => {
  // Iterăm peste categorii în ordine descrescătoare de punctaj
  for (const category of CATEGORIES) {
    if (score >= category.pts) return category;
  }
  // Dacă scorul este mai mic decât orice prag, se returnează ultima categorie
  return CATEGORIES[CATEGORIES.length - 1];
};

const DetailsSection: React.FC<DetailsSectionProps> = ({
  currentVideoDetails,
}) => {
  if (!currentVideoDetails) return null;

  // Eliminăm proprietățile care nu sunt necesare
  const tempData = { ...currentVideoDetails };
  delete tempData.id;
  delete tempData.videoCount;
  delete tempData.onlineCount;
  delete tempData.averageRating;

return (
  <div className="w-full bg-gray-900 rounded-xl p-4 shadow-lg border border-gray-700">
    {Object.entries(tempData).map(([key, value]) =>
      typeof value === "number" ? (() => {
        const category = getCategoryForScore(value);
        return (
          <div key={key} className="mb-1">
            <div className="flex justify-between items-center text-gray-300 text-sm mb-1">
              <span className="capitalize font-medium">{key}:</span>
              <span
                className={`${category.color} px-5 py-1 rounded text-black text-center`}
              >
                {value}
              </span>
            </div>
            <div className="relative w-full h-3 bg-gray-700 rounded-md overflow-hidden">
              <div
                className={`${category.color} h-full`}
                style={{ width: `${value}%` }}
              ></div>
            </div>
          </div>
        );
      })() : null
    )}
  </div>
);

};

export default DetailsSection;
