'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
      >
        {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white p-4 
        transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64 z-40`}
      >
        <h2 className="text-2xl font-bold mb-6">Model Menu</h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className={`block p-2 rounded hover:bg-gray-700 ${
                  mounted && pathname === "/" ? "bg-gray-700" : ""
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/Dashboard"
                className={`block p-2 rounded hover:bg-gray-700 ${
                  mounted && pathname === "/Dashboard" ? "bg-gray-700" : ""
                }`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/Online"
                className={`block p-2 rounded hover:bg-gray-700 ${
                  mounted && pathname === "/Online" ? "bg-gray-700" : ""
                }`}
              >
                Online Models
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}