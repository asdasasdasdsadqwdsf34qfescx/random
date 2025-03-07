"use client";
import { VideoModel } from "@/app/types";
import { useState, useEffect } from "react";
import {
  getData,
  getOnlineRating,
  geTopField,
  getUnrated,
  getVideoRating,
} from "../ids";
import Link from "next/link";
import {
  TrophyIcon,
  FireIcon,
  PhotoIcon,
  SparklesIcon,
  HeartIcon,
  FaceSmileIcon,
  ScaleIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import Sidebar from "../components/Sidebar";
const TopListCard = ({
  title,
  items = [], // Adaugă valoare implicită
  field,
  icon,
}: {
  title: string;
  items?: VideoModel[]; // Marchează ca optional
  field: string;
  icon: React.ReactNode;
}) => {
  const [showAll, setShowAll] = useState(false);
  const visibleItems = showAll ? items : items.slice(0, 15); // Acum items este garantat un array

  useEffect(() => {
    setShowAll(false);
  }, [items]);

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-pink-500/30 transition-all">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg">
          {icon}
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <div className="space-y-3">
        {items.length ? (
          <>
            {visibleItems.map((model, index) => (
              <Link
                key={model.id}
                href={`/profile/${model.name}?id=${model.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-700/30 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`text-sm font-medium ${
                      index < 3 ? "text-purple-400" : "text-gray-400"
                    }`}
                  >
                    #{index + 1}
                  </span>
                  <span className="truncate max-w-[200px] group-hover:text-pink-400 transition-colors">
                    {model.name}
                  </span>
                </div>
                <span className="text-pink-400/80 font-medium">
                  {model[field as keyof VideoModel]}
                </span>
              </Link>
            ))}
            {items.length > 15 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="w-full text-center py-2 text-sm text-pink-400 hover:text-pink-300 transition-colors font-medium"
              >
                {showAll
                  ? "Afișează mai puțin"
                  : `Afișează încă ${items.length - 15}`}
              </button>
            )}
          </>
        ) : (
          <div className="text-center py-4 text-gray-400">Nu există date</div>
        )}
      </div>
    </div>
  );
};
const Dashboard = () => {
  const [online, setOnline] = useState<VideoModel[]>([]);
  const [randome, setRandome] = useState<VideoModel[]>([]);
  const [models, setModels] = useState<VideoModel[]>([]);
  const [topBrest, setTopBrest] = useState<VideoModel[]>([]);
  const [topAss, setTopAss] = useState<VideoModel[]>([]);
  const [topHight, setTopHight] = useState<VideoModel[]>([]);
  const [topWife, setTopWife] = useState<VideoModel[]>([]);
  const [topFace, setTopFace] = useState<VideoModel[]>([]);
  const [topOverall, setOverall] = useState<VideoModel[]>([]);
  const [topContent, setTopContent] = useState<VideoModel[]>([]);
  const [unrated, setUnrated] = useState<VideoModel[]>([]);

  const [totalVideos, setTotalVideos] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const details = await getData();
        const getOnlineTop = await getOnlineRating();
        const getRandomeTop = await getVideoRating();
        const topBrest = await geTopField("brest");
        const getTopAss = await geTopField("ass");
        const getTopHight = await geTopField("height");
        const getTopWife = await geTopField("wife");
        const getTopFace = await geTopField("face");
        const getTopOverall = await geTopField("overall");
        const getTopContent = await geTopField("content");
        const getUnratedModels = await getUnrated();

        if (details) {
          setModels(details);
          setOnline(getOnlineTop!);
          setRandome(getRandomeTop!);
          setTopBrest(topBrest!);
          setTopAss(getTopAss!);
          setTopHight(getTopHight!);
          setTopWife(getTopWife!);
          setTopFace(getTopFace!);
          setOverall(getTopOverall!);
          setTopContent(getTopContent!);
          setUnrated(getUnratedModels!);
          const total = details.reduce(
            (acc, model) => acc + model.videoId.length,
            0
          );
          setTotalVideos(total);
        }
      } catch (error) {
        console.error("Error fetching video data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 120000);
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      {/* Stats Header */}
            <Sidebar />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-4">Model Statistics</h2>
          <div className="flex gap-8">
            <div>
              <div className="text-3xl font-bold text-pink-400">
                {models.length}
              </div>
              <div className="text-gray-400">Total Models</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">
                {totalVideos}
              </div>
              <div className="text-gray-400">Total Videos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <TopListCard
          title="Rating"
          items={models}
          field="averageRating"
          icon={<TrophyIcon className="w-6 h-6 text-white" />}
        />

        <TopListCard
          title="Online Now"
          items={online}
          field="onlineCount"
          icon={<FireIcon className="w-6 h-6 text-white" />}
        />

        <TopListCard
          title="Popular Videos"
          items={randome}
          field="videoCount"
          icon={<EyeIcon className="w-6 h-6 text-white" />}
        />

        <TopListCard
          title="Overall Rating"
          items={topOverall}
          field="overall"
          icon={<TrophyIcon className="w-6 h-6 text-white" />}
        />

        <TopListCard
          title="Content Quality"
          items={topContent}
          field="content"
          icon={<PhotoIcon className="w-6 h-6 text-white" />}
        />

        <TopListCard
          title="Best Breasts"
          items={topBrest}
          field="brest"
          icon={<SparklesIcon className="w-6 h-6 text-white" />}
        />

        <TopListCard
          title="Best Booty"
          items={topAss}
          field="ass"
          icon={<HeartIcon className="w-6 h-6 text-white" />}
        />

        <TopListCard
          title="Most Beautiful Face"
          items={topFace}
          field="face"
          icon={<FaceSmileIcon className="w-6 h-6 text-white" />}
        />

        <TopListCard
          title="Wife Material"
          items={topWife}
          field="wife"
          icon={<ScaleIcon className="w-6 h-6 text-white" />}
        />

        <TopListCard
          title="Top Hight"
          items={topHight}
          field="height"
          icon={<EyeIcon className="w-6 h-6 text-white" />}
        />

        <TopListCard
          title="Unrated Models"
          items={unrated}
          field="averageRating"
          icon={<EyeIcon className="w-6 h-6 text-white" />}
        />
      </div>
    </div>
  );
};

export default Dashboard;
