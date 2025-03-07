import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { getData, update, updateRank } from "../../ids";
import { VideoModel } from "../../types";
import { useParams } from "next/navigation";
import { FiAward, FiMove, FiSearch, FiStar } from "react-icons/fi";
import Sidebar from "@/app/components/Sidebar";

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
  { name: "Novice 🌟", pts: 0 },
];

const RANKING_KEYS: (keyof VideoModel)[] = [
  "brest",
  "ass",
  "face",
  "wife",
  "height",
  "overall",
  "content",
];

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

const ModelRankingKanbanSearch = ({
  modelName,
  setCurrentModel,
  setCurrentIndexModel,
}: {
  modelName: any;
  setCurrentModel: any;
  setCurrentIndexModel: (value: any) => void;
}) => {
  const [selectedModel, setSelectedModel] = useState<VideoModel | null>(null);
  const [categorizedRankings, setCategorizedRankings] = useState<
    Record<string, (keyof VideoModel)[]>
  >({});

  useEffect(() => {
    async function fetchModels() {
      const data = await getData();
      if (data) {
        const model = data.filter((m) => m.name === modelName);
        setSelectedModel(model[0]);
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
    if (!result.destination || !selectedModel) return;

    const sourceCategory = result.source.droppableId;
    const destCategory = result.destination.droppableId;
    const movedKey = categorizedRankings[sourceCategory][result.source.index];

    // Actualizează state-ul local corect
    const newRankings = { ...categorizedRankings };
    newRankings[sourceCategory] = newRankings[sourceCategory].filter(
      (k) => k !== movedKey
    );
    newRankings[destCategory] = [
      ...newRankings[destCategory].slice(0, result.destination.index),
      movedKey,
      ...newRankings[destCategory].slice(result.destination.index),
    ];

    // Actualizează modelul
    const newPts = CATEGORIES.find((c) => c.name === destCategory)?.pts || 0;
    const updatedModel = { ...selectedModel, [movedKey]: newPts };

    try {
      await update(updatedModel);
      setCurrentModel(updatedModel);
      setSelectedModel(updatedModel);
      setCategorizedRankings(newRankings);
      const details = await getData();
      if (details) {
        const currentIndexModel = details!.findIndex((model) => model.name === modelName);
        setCurrentIndexModel(currentIndexModel + 1 )
      }
    } catch (error) {
      console.error("Error updating ranking:", error);
      // Rollback la starea anterioară
      setCategorizedRankings(categorizedRankings);
    }
  };

  return (
    <div className="from-slate-900 to-slate-800">
      <Sidebar />
      {selectedModel && (
        <>
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {CATEGORIES.map((category) => (
                <Droppable key={category.name} droppableId={category.name}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className=" from-slate-800/70 to-slate-900/70 backdrop-blur-lg rounded-2xl shadow-xl p-6  border border-slate-700/50 hover:border-teal-400/30 transition-all"
                    >
                      <div className="mb-6 flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-semibold text-slate-200 flex items-center gap-2">
                            <FiAward className="text-purple-400" />
                            {category.name.split(" ")[0]}
                          </h2>
                          <p className="text-sm text-slate-400 mt-1">
                            {category.name.split(" ")[1]} • {category.pts}pts
                          </p>
                        </div>
                        <span className="bg-slate-700/50 text-teal-400 px-3 py-1 rounded-full text-sm">
                          {categorizedRankings[category.name]?.length || 0}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {categorizedRankings[category.name]?.map(
                          (key, index) => (
                            <Draggable
                              key={`${selectedModel.name}-${key}`}
                              draggableId={`${selectedModel.name}-${key}`}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    ...provided.draggableProps.style,
                                    transition:
                                      "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                  }}
                                  className="group bg-slate-800/50 hover:bg-slate-700/60 p-4 rounded-xl border border-slate-700/50 hover:border-teal-400/30 backdrop-blur-sm shadow-lg cursor-grab active:cursor-grabbing"
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="font-medium text-slate-200 flex items-center gap-2">
                                        <FiMove className="text-slate-500 group-hover:text-teal-400 transition-colors" />
                                        {key.charAt(0).toUpperCase() +
                                          key.slice(1)}
                                      </div>
                                      <div className="text-xs text-slate-400 mt-1">
                                        Current Value:{" "}
                                        <span className="text-teal-400 font-medium">
                                          {selectedModel[key]}
                                        </span>
                                      </div>
                                    </div>
                                    <FiStar className="text-yellow-400/80" />
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          )
                        )}
                        {provided.placeholder}
                      </div>
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

export default ModelRankingKanbanSearch;
