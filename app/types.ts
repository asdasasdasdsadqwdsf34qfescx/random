
export const defaultNewModel = {
    videoId: [],
    spankBangLinks: [],
    name: "",
    brest: 0,
    ass: 0,
    face: 0,
    overall: 0,
    content: 0,
    wife: 0,
    height: 0,
  };

  export interface VideoModel {
    id?: number;
    videoId: string[];
    name: string;
    brest: number;
    ass: number;
    face: number;
    overall: number;
    content: number;
    wife: number;
    height: number;
    instagram: null | string | undefined;
    tiktok: null | string;
    isOnline: boolean;
    averageRating: number;
    onlineCount: number;
    videoCount: number;
    links: string[]
  }