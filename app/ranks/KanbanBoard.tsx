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

const categorizeModels = (models: VideoModel[], rankingKey: keyof VideoModel) => {
  return CATEGORIES.reduce((acc, category) => {
    acc[category.name] = models.filter(
      (m) => (m[rankingKey] ?? 10) === category.pts // Dacă e null/undefined, se setează la 10 (Novice)
    );
    return acc;
  }, {} as Record<string, VideoModel[]>);
}

const KanbanBoard = ({ rankingKey, onBack }: { rankingKey: keyof VideoModel, onBack: () => void }) => {
  const [models, setModels] = useState<VideoModel[]>([]);
  const [categorizedModels, setCategorizedModels] = useState<Record<string, VideoModel[]>>({});

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
  
    // Dacă nu s-a schimbat categoria, ieșim
    if (sourceCategory === destCategory) return;
  
    // Clonăm datele pentru actualizare
    const newCategorizedModels = { ...categorizedModels };
    const movedItem = newCategorizedModels[sourceCategory].splice(result.source.index, 1)[0];
  
    // Setăm noua valoare a rankingKey
    const newPts = CATEGORIES.find((c) => c.name === destCategory)?.pts ?? 10;
    movedItem[rankingKey] = newPts;
  
    // Adăugăm itemul în noua categorie
    newCategorizedModels[destCategory].splice(result.destination.index, 0, movedItem);
  
    // Actualizăm state-ul local
    setCategorizedModels(newCategorizedModels);
    setModels(Object.values(newCategorizedModels).flat());
    console.log(Object.values(newCategorizedModels).flat())
    // Actualizăm backend-ul
    await updateRank(Object.values(newCategorizedModels).flat());
  };

  return (
    <div>
      <button onClick={onBack} className="bg-red-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-500 mb-4">Back to Category Selection</button>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-6">
          {CATEGORIES.map((category) => (
            <Droppable key={category.name} droppableId={category.name}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="p-4 bg-gray-800 rounded-lg shadow-md min-h-[300px]"
                >
                  <h2 className="text-white font-bold text-lg mb-4">{category.name}</h2>
                  {categorizedModels[category.name]?.map((model, index) => (
                    <Draggable key={model.name} draggableId={model.name} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white text-black p-2 rounded-lg shadow-md mb-2 cursor-pointer"
                        >
                          {model.name} ({rankingKey}: {model[rankingKey]})
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
  );
};

const CategorySelection = () => {
  const [selectedCategory, setSelectedCategory] = useState<keyof VideoModel | null>(null);
  
  return selectedCategory ? (
    <KanbanBoard rankingKey={selectedCategory} onBack={() => setSelectedCategory(null)} />
  ) : (
    <div className="flex flex-col items-center gap-4 p-10">
      <h1 className="text-white text-2xl font-bold">Select a Category</h1>
      {(["brest", "ass", "face", "wife", "height"] as (keyof VideoModel)[]).map((key) => (
        <button
          key={key}
          onClick={() => setSelectedCategory(key)}
          className="bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-blue-500"
        >
          {key.charAt(0).toUpperCase() + key.slice(1)} Ranking
        </button>
      ))}
    </div>
  );
};

export default CategorySelection;
