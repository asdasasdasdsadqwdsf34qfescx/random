import { VideoModel } from "@/app/ids";

 export const calculatePositionChanges = (
    currentList: VideoModel[],
    previousList: VideoModel[]
  ): { id: number; change: number }[] => {
    const positionChanges: { id: number; change: number }[] = [];
    currentList.forEach((video, currentIndex) => {
      const previousIndex = previousList.findIndex((v) => v.id === video.id);
      if (previousIndex !== -1) {
        positionChanges.push({
          id: video.id!,
          change: previousIndex - currentIndex, // Calculăm diferența de poziții
        });
      } else {
        positionChanges.push({ id: video.id!, change: 0 }); // Dacă nu există în lista anterioară, schimbarea e 0
      }
    });
    return positionChanges;
  };