import { add, getData, VideoModel } from "../../ids";
import { defaultNewModel, useVideoContext } from "../../UseState/useStates";

  export const handleAddSubmit = async (e: React.FormEvent) => {
     const {
        setPreviousRandomTop,
        setVideoDetails,
        randomTop,
        setRandomTop,
        setPreviousOnlineTop,
        setOnlineTop,
        setCurrentVideo,
        setSelectedVideoIndex,
        newModel,
        setNewModel,
        setShowAddModal
      } = useVideoContext();
    e.preventDefault();
    try {
      const ratingFields = [
        newModel.brest,
        newModel.nipples,
        newModel.legs,
        newModel.ass,
        newModel.face,
        newModel.pussy,
        newModel.overall,
        newModel.voice,
        newModel.content,
        newModel.eyes,
        newModel.lips,
        newModel.waist,
        newModel.wife,
        newModel.haire,
        newModel.nails,
        newModel.skin,
        newModel.hands,
        newModel.rear,
        newModel.front,
        newModel.ears,
        newModel.height,
        newModel.weight,
        newModel.nose,
      ];

      const averageRating =
        ratingFields.reduce((a, b) => a + b, 0) / ratingFields.length;

      const modelToAdd: VideoModel = {
        ...newModel,
        isOnline: false,
        averageRating,
      };

      add(modelToAdd);

      const details = await getData();
      if (details) {
        setVideoDetails(details);
        setCurrentVideo(details[0]);
      }

      setShowAddModal(false);
      setNewModel(defaultNewModel);
    } catch (error) {
      console.error("Error adding model:", error);
    }
  };