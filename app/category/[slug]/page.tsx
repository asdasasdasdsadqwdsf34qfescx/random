"use client";
import Sidebar from "@/app/components/Sidebar";
import { MediaGallery } from "@/app/components/shared/MediaGallery";
import { notFound, useParams } from "next/navigation";
import { useSidebar } from "@/app/components/ui/SidebarContext";

const CATEGORY_CONFIG: Record<string, { apiBasePath: string; basePath: string; videoFilter: string; title: string }> = {
  asian: { apiBasePath: "asian", basePath: "asian", videoFilter: "asian", title: "Asian" },
  boobs: { apiBasePath: "boobs", basePath: "boobs", videoFilter: "", title: "Boobs" },
  kiss: { apiBasePath: "kiss", basePath: "kiss", videoFilter: "kiss", title: "Kiss" },
  pillow: { apiBasePath: "pillow", basePath: "pillow", videoFilter: "pillow", title: "Pillow" },
  body: { apiBasePath: "body", basePath: "body", videoFilter: "body", title: "Body" },
  sex: { apiBasePath: "sex", basePath: "sex", videoFilter: "sex", title: "Sex" },
  ideal: { apiBasePath: "ideal", basePath: "ideal", videoFilter: "", title: "Ideal" },
  lick: { apiBasePath: "lick", basePath: "lick", videoFilter: "lick", title: "Lick" },
  ride: { apiBasePath: "ride", basePath: "ride", videoFilter: "ride", title: "Ride" },
  scissors: { apiBasePath: "scissors", basePath: "scissors", videoFilter: "scissors", title: "Scissors" },
  close: { apiBasePath: "close", basePath: "close", videoFilter: "close", title: "Close" },
  suck: { apiBasePath: "suck", basePath: "suck", videoFilter: "suck", title: "Suck" },
  ass: { apiBasePath: "ass", basePath: "ass", videoFilter: "", title: "Ass" },
  hairy: { apiBasePath: "hairy", basePath: "hairy", videoFilter: "hairy", title: "Hairy" },
  hand: { apiBasePath: "hand", basePath: "hand", videoFilter: "hand", title: "Hand" },
  under: { apiBasePath: "under", basePath: "under", videoFilter: "under", title: "Under" },
  cute: { apiBasePath: "cute", basePath: "cute", videoFilter: "", title: "Cute" },
  dildo: { apiBasePath: "dildo", basePath: "dildo", videoFilter: "dildo", title: "Dildo" },
  petit: { apiBasePath: "petit", basePath: "petit", videoFilter: "", title: "Petit" },
  moaning: { apiBasePath: "moaning", basePath: "moaning", videoFilter: "moaning", title: "Moaning" },
  doggy: { apiBasePath: "doggy", basePath: "doggy", videoFilter: "doggy", title: "Doggy" },
  photos: { apiBasePath: "photos", basePath: "photos", videoFilter: "", title: "GF" },
};

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug = (params?.slug || "").toLowerCase();
  const cfg = CATEGORY_CONFIG[slug];

  if (!cfg) return notFound();

  const { isOpen } = useSidebar();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <main className={`py-6 transition-[margin] duration-300 ${isOpen ? "md:ml-64" : "ml-0"}`}>
        <div className="max-w-7xl mx-auto">
          <MediaGallery
            apiEndpoint={`/api/images/${encodeURIComponent(cfg.apiBasePath)}`}
            videoFilter={cfg.videoFilter}
            basePath={cfg.basePath}
            title={cfg.title}
          />
        </div>
      </main>
    </div>
  );
}
