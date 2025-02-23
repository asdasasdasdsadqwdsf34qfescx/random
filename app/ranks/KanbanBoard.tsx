import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { getData, update, updateRank } from "../ids";
import { VideoModel } from "../types";

// Definirea categoriilor și a ranking keys
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

/* ========= VIEW BY CATEGORY ========= */
/**
 * Sortează modelele în funcție de valoarea ranking key selectat.
 * Pentru fiecare categorie, se filtrează modelele care au valoarea
 * (model[rankingKey] sau 10, dacă lipsește) egală cu punctajul categoriei.
 */
const categorizeModels = (models: VideoModel[], rankingKey: keyof VideoModel) => {
  return CATEGORIES.reduce((acc, category) => {
    acc[category.name] = models.filter(
      (m) => (m[rankingKey] ?? 10) === category.pts
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
    <div>
      <div className="mb-4 text-center">
        <label className="mr-3 text-indigo-800 font-medium">Selectează Ranking-ul:</label>
        <select
          value={rankingKey}
          onChange={(e) => setRankingKey(e.target.value as keyof VideoModel)}
          className="rounded-md border border-gray-200 p-2 text-gray-800"
        >
          {RANKING_KEYS.map((key) => (
            <option key={key} value={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </option>
          ))}
        </select>
      </div>
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
                  <h2 className="text-xl font-bold text-indigo-700 mb-4">
                    {category.name}
                  </h2>
                  {categorizedModels[category.name]?.map((model, index) => (
                    <Draggable key={model.name} draggableId={model.name} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white text-gray-800 p-4 rounded-md border-2 border-indigo-600 shadow-md mb-3 cursor-move"
                        >
                          <div className="font-bold">{model.name}</div>
                          <div className="text-sm">
                            {rankingKey}: {model[rankingKey]}
                          </div>
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

/* ========= VIEW BY MODEL (CU CAUTARE) ========= */
/**
 * Pentru un model selectat, creează o distribuție a ranking-urilor în funcție de categorii.
 * Fiecare categorie va conține cheile din RANKING_KEYS pentru care valoarea modelului
 * corespunde cu punctajul categoriei.
 */
const categorizeModelRankings = (
  model: VideoModel
): Record<string, (keyof VideoModel)[]> => {
  return CATEGORIES.reduce((acc, category) => {
    acc[category.name] = RANKING_KEYS.filter(
      (key) => (model[key] ?? 10) === category.pts
    );
    return acc;
  }, {} as Record<string, (keyof VideoModel)[]>);
};

const ModelRankingKanbanSearch = () => {
  const [models, setModels] = useState<VideoModel[]>([]);
  const [selectedModel, setSelectedModel] = useState<VideoModel | null>(null);
  const [categorizedRankings, setCategorizedRankings] = useState<Record<string, (keyof VideoModel)[]>>({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchModels() {
      const data = await getData();
      if (data) {
        setModels(data);
      }
    }
    fetchModels();
  }, []);

  useEffect(() => {
    if (selectedModel) {
      setCategorizedRankings(categorizeModelRankings(selectedModel));
    }
  }, [selectedModel]);

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;
    const sourceCategory = result.source.droppableId;
    const destCategory = result.destination.droppableId;
    if (sourceCategory === destCategory) return;
    const newCategorizedRankings = { ...categorizedRankings };
    const movedKey = newCategorizedRankings[sourceCategory].splice(result.source.index, 1)[0];
    const newPts = CATEGORIES.find((c) => c.name === destCategory)?.pts ?? 10;
    if (selectedModel) {
      (selectedModel as any)[movedKey] = newPts;
    }
    newCategorizedRankings[destCategory].splice(result.destination.index, 0, movedKey);
    setCategorizedRankings(newCategorizedRankings);
    if (selectedModel) {
      await update(selectedModel);
    }
  };

  // Filtrează modelele pe baza textului introdus
  const filteredModels = models.filter((model) =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {!selectedModel && (
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-indigo-800">Caută Modelul</h2>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Introdu numele modelului..."
            className="mt-4 rounded-md border border-gray-200 p-2 text-gray-800 w-full max-w-md mx-auto"
          />
          <div className="mt-4">
            {filteredModels.map((model) => (
              <div
                key={model.name}
                onClick={() => {
                  setSelectedModel(model);
                  setSearchTerm("");
                }}
                className="cursor-pointer bg-white rounded-md p-2 border border-indigo-600 mb-2 hover:bg-indigo-100 transition"
              >
                {model.name}
              </div>
            ))}
            {filteredModels.length === 0 && (
              <div className="text-gray-600 mt-2">Nu s-au găsit modele.</div>
            )}
          </div>
        </div>
      )}
      {selectedModel && (
        <>
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-indigo-800">
              Ranking pentru {selectedModel.name}
            </h2>
            <button
              onClick={() => setSelectedModel(null)}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md"
            >
              Înapoi la căutare
            </button>
          </div>
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
                      <h2 className="text-xl font-bold text-indigo-700 mb-4">
                        {category.name}
                      </h2>
                      {categorizedRankings[category.name]?.map((key, index) => (
                        <Draggable key={key} draggableId={key} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="bg-white text-gray-800 p-4 rounded-md border-2 border-indigo-600 shadow-md mb-3 cursor-move"
                            >
                              <div className="font-bold">
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                              </div>
                              <div className="text-sm">
                                Valoare: {selectedModel[key]}
                              </div>
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
        </>
      )}
    </div>
  );
};

/* ========= TOP-LEVEL DASHBOARD ========= */
const KanbanDashboard = () => {
  const [viewType, setViewType] = useState<"category" | "model">("category");

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 px-8 py-6">
      <div className="container mx-auto">
        <header className="mb-8 text-center">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg p-6 shadow-lg flex flex-col items-center gap-4">
            <h1 className="text-4xl font-bold text-white">Kanban Dashboard</h1>
            <div className="flex gap-4">
              <button
                onClick={() => setViewType("category")}
                className={`px-4 py-2 rounded-md ${
                  viewType === "category"
                    ? "bg-white text-indigo-600"
                    : "bg-indigo-600 text-white"
                }`}
              >
                View by Category
              </button>
              <button
                onClick={() => setViewType("model")}
                className={`px-4 py-2 rounded-md ${
                  viewType === "model"
                    ? "bg-white text-indigo-600"
                    : "bg-indigo-600 text-white"
                }`}
              >
                View by Model
              </button>
            </div>
          </div>
        </header>
        {viewType === "category" ? <CategoryKanban /> : <ModelRankingKanbanSearch />}
      </div>
    </div>
  );
};

export default KanbanDashboard;
