'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-50 p-2 bg-gray-800 text-white rounded-lg md:hidden"
      >
        ☰
      </button>
      
      <div className={`fixed left-0 top-0 h-full bg-gray-800 text-white p-4 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 w-64 z-40`}>
        <h2 className="text-2xl font-bold mb-6">Model Menu</h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className={`block p-2 rounded hover:bg-gray-700 ${
                  pathname === "/" ? "bg-gray-700" : ""
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/randomize"
                className={`block p-2 rounded hover:bg-gray-700 ${
                  pathname === "/randomize" ? "bg-gray-700" : ""
                }`}
              >
                Randomize Models
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}