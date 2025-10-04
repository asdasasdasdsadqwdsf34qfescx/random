"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/Online", label: "Online Models" },
  { href: "/GF", label: "GF Models" },
  { href: "/Boobs", label: "Boobs" },
  { href: "/Kiss", label: "Kiss" },
  { href: "/Pillow", label: "Pillow" },
  { href: "/Body", label: "Body" },
  { href: "/Sex", label: "Sex" },
  { href: "/Ideal", label: "Ideal" },
  { href: "/Lick", label: "Lick" },
  { href: "/Ride", label: "Ride" },
  { href: "/Scissors", label: "Scissors" },
  { href: "/Close", label: "Close" },
  { href: "/Suck", label: "Suck" },
  { href: "/Asian", label: "Asian" },
  { href: "/Morning", label: "Morning" },
  { href: "/Ass", label: "Ass" },
  { href: "/Hairy", label: "Hairy" },
  { href: "/Hand", label: "Hand" },
  { href: "/Under", label: "Under" },
  { href: "/Cute", label: "Cute" },
  { href: "/Dildo", label: "Dildo" }
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setIsOpen(window.innerWidth >= 768);
    }
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        aria-controls="app-sidebar"
        className="fixed top-4 left-4 z-50 p-2 rounded-lg shadow-lg text-white bg-gray-800/80 backdrop-blur hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 md:hidden"
      >
        {isOpen ? <HiX size={22} /> : <HiMenu size={22} />}
        <span className="sr-only">Toggle sidebar</span>
      </button>

      {/* Backdrop (mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden
        />
      )}

      <aside
        id="app-sidebar"
        className={`fixed top-0 left-0 h-full w-64 z-50 text-gray-200 transition-transform duration-300
        bg-gradient-to-b from-gray-900 to-gray-800 border-r border-white/10
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="h-16 flex items-center px-4 border-b border-white/10">
          <span className="text-lg font-semibold tracking-wide">Model Menu</span>
        </div>
        <nav className="h-[calc(100%-4rem)] overflow-y-auto scrollbar-hide px-2 py-4">
          <ul className="space-y-1">
            {navItems.map(({ href, label }) => {
              const active = mounted && pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors outline-none focus:ring-2 focus:ring-indigo-500
                    ${active ? "bg-indigo-600 text-white" : "hover:bg-white/10"}`}
                  >
                    <span className="truncate">{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
