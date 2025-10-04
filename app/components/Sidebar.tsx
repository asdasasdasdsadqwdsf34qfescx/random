"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { useSidebar } from "./ui/SidebarContext";
import { Home, Images, Video, Heart, Star, Fingerprint, Rocket, BadgeInfo, Search, Grid2X2, Settings as SettingsIcon } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/Online", label: "Online Models", icon: Rocket },
  { href: "/category/photos", label: "GF Models", icon: Images },
  { href: "/category/boobs", label: "Boobs", icon: Heart },
  { href: "/category/kiss", label: "Kiss", icon: Heart },
  { href: "/category/pillow", label: "Pillow", icon: Star },
  { href: "/category/body", label: "Body", icon: Fingerprint },
  { href: "/category/sex", label: "Sex", icon: Heart },
  { href: "/category/ideal", label: "Ideal", icon: Star },
  { href: "/category/lick", label: "Lick", icon: Heart },
  { href: "/category/ride", label: "Ride", icon: Rocket },
  { href: "/category/scissors", label: "Scissors", icon: BadgeInfo },
  { href: "/category/close", label: "Close", icon: Grid2X2 },
  { href: "/category/suck", label: "Suck", icon: Heart },
  { href: "/category/asian", label: "Asian", icon: Images },
  { href: "/category/moaning", label: "Moaning", icon: Video },
  { href: "/category/ass", label: "Ass", icon: Grid2X2 },
  { href: "/category/hairy", label: "Hairy", icon: Fingerprint },
  { href: "/category/hand", label: "Hand", icon: Fingerprint },
  { href: "/category/under", label: "Under", icon: Grid2X2 },
  { href: "/category/cute", label: "Cute", icon: Star },
  { href: "/category/dildo", label: "Dildo", icon: BadgeInfo },
  { href: "/category/doggy", label: "Doggy", icon: Rocket },
  { href: "/category/petit", label: "Petit", icon: Star },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, toggle, close } = useSidebar();
  const [query, setQuery] = useState("");

  const items = useMemo(() => navItems, []);
  const mainItems = useMemo(() => items.filter(i => !i.href.startsWith("/category/")), [items]);
  const categoryItems = useMemo(
    () => items.filter(i => i.href.startsWith("/category/")).filter(i => i.label.toLowerCase().includes(query.toLowerCase())),
    [items, query]
  );

  return (
    <>
      <button
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls="app-sidebar"
        className="fixed top-4 left-4 z-[60] p-2 rounded-lg shadow-lg text-white bg-gray-800/80 backdrop-blur hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        {isOpen ? <HiX size={22} /> : <HiMenu size={22} />}
        <span className="sr-only">Toggle sidebar</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={close}
          aria-hidden
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed top-0 left-0 h-full w-64 z-50 text-gray-200 transition-transform duration-300 will-change-transform
        bg-gradient-to-b from-gray-900/95 to-gray-800/95 backdrop-blur border-r border-white/10
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="h-16 flex items-center gap-2 px-4 border-b border-white/10">
          <Video className="w-5 h-5 text-indigo-400" />
          <span className="text-lg font-semibold tracking-wide">Model Menu</span>
        </div>

        <div className="px-3 py-3 border-b border-white/10">
          <label htmlFor="sidebar-search" className="sr-only">Search</label>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
            <input
              id="sidebar-search"
              type="search"
              placeholder="Search categories..."
              className="w-full bg-white/5 border border-white/10 rounded-md pl-8 pr-3 py-1.5 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <nav className="h-[calc(100%-8rem)] overflow-y-auto scrollbar-hide px-2 py-3 space-y-6">
          <div>
            <div className="px-3 mb-2 text-xs uppercase tracking-wider text-white/50">Main</div>
            <ul className="space-y-1">
              {mainItems.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`group flex items-center gap-3 px-3 py-2 rounded-md transition-colors outline-none focus:ring-2 focus:ring-indigo-500 border border-transparent
                      ${active ? "bg-indigo-600/90 text-white border-indigo-500/30" : "hover:bg-white/10"}`}
                      onClick={close}
                      title={label}
                    >
                      <Icon className="w-4.5 h-4.5 text-white/70 group-hover:text-white" />
                      <span className="truncate">{label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <div className="px-3 mb-2 text-xs uppercase tracking-wider text-white/50">Categories</div>
            <ul className="space-y-1">
              {categoryItems.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`group flex items-center gap-3 px-3 py-2 rounded-md transition-colors outline-none focus:ring-2 focus:ring-indigo-500 border border-transparent
                      ${active ? "bg-indigo-600/90 text-white border-indigo-500/30" : "hover:bg-white/10"}`}
                      onClick={close}
                      title={label}
                    >
                      <Icon className="w-4.5 h-4.5 text-white/70 group-hover:text-white" />
                      <span className="truncate">{label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="pt-1 border-t border-white/10">
            <ul>
              <li>
                <Link
                  href="/settings"
                  className={`group flex items-center gap-3 px-3 py-2 rounded-md transition-colors outline-none focus:ring-2 focus:ring-indigo-500 hover:bg-white/10`}
                  onClick={close}
                  title="Settings"
                >
                  <SettingsIcon className="w-4.5 h-4.5 text-white/70 group-hover:text-white" />
                  <span className="truncate">Settings</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </aside>
    </>
  );
}
