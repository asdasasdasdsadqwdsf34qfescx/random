import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { getData, updateRank } from "../ids";
import { VideoModel } from "../types";

interface KanbanBoardProps {
  rankingKey: keyof VideoModel;
}

export const KanbanBoard = ({ rankingKey }: KanbanBoardProps) => {
  const [models, setModels] = useState<VideoModel[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getData();
      if (data) {
        // TypeScript știe acum că rankingKey este o cheie validă din VideoModel
        const sorted = data.sort((a, b) => (a[rankingKey] as number) - (b[rankingKey] as number));
        setModels(sorted);
      }
    }
    fetchData();
  }, [rankingKey]);

  const getPoints = (value: number) => {
    if (value === 1) return 10000;
    if (value >= 2 && value < 5) return 8000;
    if (value >= 5 && value < 20) return 6500;
    if (value >= 20 && value <= 50) return 5000;
    if (value >= 50 && value <= 100) return 3000;
    if (value >= 100 && value <= 170) return 1000;
    return 0;
  };

  const handleDragEnd = async (result: {
    destination: { index: number } | null;
    source: { index: number };
  }) => {
    if (!result.destination) return;
    const newModels = [...models];
    const [movedItem] = newModels.splice(result.source.index, 1);
    newModels.splice(result.destination.index, 0, movedItem);

    const updatedModels = newModels.map((model: VideoModel, index) => ({
      ...model,
      [rankingKey]: index + 1, // Atribuie noul rang
    }));

    const newModelsup = updatedModels.map((m) => {
      let assPoint = getPoints(m.ass);
      let facepoints = getPoints(m.face);
      let heightPoints = getPoints(m.height);
      let brestPoints = getPoints(m.brest);
      let wifePoints = getPoints(m.wife);

      m.averageRating = assPoint + facepoints + heightPoints + brestPoints + wifePoints;
      return m;
    });
    setModels(newModelsup);
    await updateRank(newModelsup);
  };

  // Funcție pentru a determina culoarea de fundal pe baza rangului
  const getRankColor = (rank: number) => {
    if (rank === 1) return "#d5a6bd";
    if (rank >= 2 && rank < 5) return "#c27ba0";
    if (rank >= 5 && rank < 20) return "#a64d79";
    if (rank >= 20 && rank <= 50) return "#8e7cc3";
    if (rank >= 50 && rank <= 100) return "#bcbcbc";
    if (rank >= 100 && rank <= 170) return "#9fc5e8";
    return "#cc0000";
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="kanban-droppable">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="p-6 bg-white/10 rounded-2xl min-h-[300px] shadow-md"
          >
            {models.length > 0 ? (
              models.map((model: VideoModel, index) => {
                // Aici, folosim rankingKey ca fiind key-ul unui obiect VideoModel
                const rank = model[rankingKey] as number;
                return (
                  <Draggable
                    key={model.id}
                    draggableId={String(model.id)}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          userSelect: "none",
                          padding: "1px 24px",
                          marginBottom: 12,
                          background: getRankColor(rank),
                          borderRadius: "12px",
                          color: "#000000",
                          fontSize: "14px",
                          fontWeight: 600,
                          boxShadow: snapshot.isDragging
                            ? "0 8px 24px rgba(0, 0, 0, 0.3)"
                            : "0 4px 12px rgba(0, 0, 0, 0.1)",
                          transform: snapshot.isDragging
                            ? "scale(1.02) rotate(2deg)"
                            : "scale(1)",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          cursor: "grab",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          ...provided.draggableProps.style,
                        }}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-lg font-bold text-gray-800">
                              {model.name}
                            </div>
                          </div>
                          <div className="bg-black/20 rounded-lg px-3 py-1 text-xs text-white flex items-center">
                            {rankingKey}: {rank}
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })
            ) : (
              <div className="text-center text-gray-400 py-10 italic">
                No items available
              </div>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default KanbanBoard;
