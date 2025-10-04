export const defaultNewModel = {
  videoId: [],
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
  videos: {
    id: number;
    link: string;
  }[];
  name: string;
  brest: number;
  ass: number;
  face: number;
  overall: number;
  content: number;
  wife: number;
  height: number;
  winner: number;
  Semifinals: number;
  Final: number;
  Quarterfinals: number;
  instagram: null | string | undefined;
  tiktok: null | string;
  isOnline: boolean;
  averageRating: number;
  onlineCount: number;
  videoCount: number;
  links: string[];
  body: number;
  hair: number;
  nipples: number;
  legs: number;
  pussy: number;
  duelRating: number;
  duelWin: number;
  duelLose: number;
  winStreak: number;
  imageUrl: string;
  place: number;
  duelTir: string
  avatarLink: null | string;
}
