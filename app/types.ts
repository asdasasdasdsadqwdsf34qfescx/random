
export const defaultNewModel: Omit<VideoModel, "id" | "isOnline" | "averageRating" | "links" | "avatarLink"> = {
    videoId: [],
    name: "",
    brest: 0,
    nipples: 0,
    legs: 0,
    ass: 0,
    face: 0,
    pussy: 0,
    overall: 0,
    voice: 0,
    content: 0,
    eyes: 0,
    lips: 0,
    waist: 0,
    wife: 0,
    haire: 0,
    nails: 0,
    nose: 0,
    skin: 0,
    hands: 0,//кисти рук
    rear: 0,
    front: 0,
    ears: 0,
    height: 0,
    weight: 0,
    cheeks:0, //щекиы
    instagram: null,
    tiktok: null,
    onlineCount: 0,
    videoCount: 0,

    thighs:0,
    stomach:0,
    buttshape:0,
    eyebrows:0,
    neck:0,
    collarbone: 0,//ключица
    shoulders: 0,//плечи
    posture:0,//осанка
    back: 0,
    forearms: 0,//предплечья
    style: 0,
    poportions: 0,
    generaimpression: 0,
  };

  export interface VideoModel {
    id?: number;
    videoId: string[];
    name: string;
    brest: number;
    nipples: number;
    legs: number;
    ass: number;
    face: number;
    pussy: number;
    overall: number;
    voice: number;
    content: number;
    eyes: number;
    lips: number;
    waist: number;
    wife: number;
    haire: number;
    nails: number;
    skin: number;
    hands: number;
    rear: number;
    front: number;
    nose: number;
    ears: number;
    height: number;
    weight: number;
    instagram: null | string | undefined;
    tiktok: null | string;
    isOnline: boolean;
    averageRating: number;
    onlineCount: number;
    videoCount: number;
    links: string[]
    avatarLink: string | null

    cheeks: number;
    stomach: number;
    thighs: number;
    buttshape: number;
    eyebrows: number;
    neck: number;
    collarbone: number;
    shoulders: number;
    posture: number;
    back: number,

    forearms: number,
    style: number,
    poportions: number,
    generaimpression: number,
  }