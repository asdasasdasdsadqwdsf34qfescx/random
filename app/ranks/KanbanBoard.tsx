import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { getData, updateRank } from "../ids";
import { VideoModel } from "../types";

const CATEGORIES = [
  { name: "Celestial 💠", pts: 100 },
  { name: "Imperial 👑", pts: 90 },
  { name: "Prestige 🏅", pts: 80 },
  { name: "Prime ✨", pts: 70 },
  { name: "Superior 🏆", pts: 60 },
  { name: "Refined 🎭", pts: 50 },
  { name: "Select 🔹", pts: 40 },
  { name: "Emerging 🌱", pts: 30 },
  { name: "Aspiring 🚀", pts: 20 },
  { name: "Novice 🌟", pts: 10 },
];

const RANKING_KEYS: (keyof VideoModel)[] = ["brest", "ass", "face", "wife", "height"];

const categorizeModels = (models: VideoModel[], rankingKey: keyof VideoModel) => {
  return CATEGORIES.reduce((acc, category) => {
    acc[category.name] = models.filter(
      (m) => (m[rankingKey] ?? 10) === category.pts // Dacă e null/undefined, se setează la 10 (Novice)
    );
    return acc;
  }, {} as Record<string, VideoModel[]>);
};

const CategoryKanban = () => {
  const [models, setModels] = useState<VideoModel[]>([]);
  const [categorizedModels, setCategorizedModels] = useState<Record<string, VideoModel[]>>({});
  const [rankingKey, setRankingKey] = useState<keyof VideoModel>("brest");

  useEffect(() => {
    async function fetchData() {
      const data = await getData();
      if (data) {
        setModels(data);
        setCategorizedModels(categorizeModels(data, rankingKey));
      }
    }
    fetchData();
  }, [rankingKey]);

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const sourceCategory = result.source.droppableId;
    const destCategory = result.destination.droppableId;

    if (sourceCategory === destCategory) return;

    const newCategorizedModels = { ...categorizedModels };
    const movedItem = newCategorizedModels[sourceCategory].splice(result.source.index, 1)[0];

    const newPts = CATEGORIES.find((c) => c.name === destCategory)?.pts ?? 10;
    (movedItem as any)[rankingKey] = newPts;
    newCategorizedModels[destCategory].splice(result.destination.index, 0, movedItem);

    setCategorizedModels(newCategorizedModels);
    setModels(Object.values(newCategorizedModels).flat());
    await updateRank(Object.values(newCategorizedModels).flat());
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 px-8 py-6">
      <div className="container mx-auto">
        <header className="mb-8 text-center">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg p-6 shadow-lg">
            <h1 className="text-4xl font-bold text-white">Kanban Board</h1>
            <div className="mt-4">
              <label htmlFor="ranking" className="mr-3 text-white font-medium">
                Selectează Ranking-ul:
              </label>
              <select
                id="ranking"
                value={rankingKey}
                onChange={(e) => setRankingKey(e.target.value as keyof VideoModel)}
                className="rounded-md border border-gray-200 p-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
              >
                {RANKING_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {CATEGORIES.map((category) => (
              <Droppable key={category.name} droppableId={category.name}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-white rounded-lg shadow-xl p-4 min-h-[300px] border-2 border-indigo-600 hover:shadow-2xl transition-shadow duration-200"
                  >
                    <h2 className="text-xl font-bold text-indigo-700 mb-4">{category.name}</h2>
                    {categorizedModels[category.name]?.map((model, index) => (
                      <Draggable key={model.name} draggableId={model.name} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white text-gray-800 p-4 rounded-md border-2 border-indigo-600 shadow-md hover:shadow-xl transition-all duration-200 mb-3 cursor-move"
                          >
                            {model.name} (<span className="font-medium">{rankingKey}</span>: {model[rankingKey]})
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default CategoryKanban;
