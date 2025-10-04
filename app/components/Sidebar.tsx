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
                href="/Online"
                className={`block p-2 rounded hover:bg-gray-700 ${
                  mounted && pathname === "/Online" ? "bg-gray-700" : ""
                }`}
              >
                Online Models
              </Link>
            </li>
            <li>
              <Link
                href="/GF"
                className={`block p-2 rounded hover:bg-gray-700 ${
                  mounted && pathname === "/GF" ? "bg-gray-700" : ""
                }`}
              >
                GF Models
              </Link>
              <Link
                href="/Boobs"
                className={`block p-2 rounded hover:bg-gray-700 ${
                  mounted && pathname === "/Boobs" ? "bg-gray-700" : ""
                }`}
              >
                Boobs
              </Link>
              <Link
                href="/Kiss"
                className={`block p-2 rounded hover:bg-gray-700 ${
                  mounted && pathname === "/Kiss" ? "bg-gray-700" : ""
                }`}
              >
                Kiss
              </Link>
              <Link
                href="/Pillow"
                className={`block p-2 rounded hover:bg-gray-700 ${
                  mounted && pathname === "/Pillow" ? "bg-gray-700" : ""
                }`}
              >
                Pillow
              </Link>
              <Link
                href="/Body"
                className={`block p-2 rounded hover:bg-gray-700 ${
                  mounted && pathname === "/Body" ? "bg-gray-700" : ""
                }`}
              >
                Body
              </Link>
              <Link
                href="/Sex"
                className={`block p-2 rounded hover:bg-gray-700 ${
                  mounted && pathname === "/Sex" ? "bg-gray-700" : ""
                }`}
              >
                Sex
              </Link>
              <Link
                href="/Ideal"
                className={`block p-2 rounded hover:bg-gray-700 ${
                  mounted && pathname === "/Ideal" ? "bg-gray-700" : ""
                }`}
              >
                Ideal
              </Link>
              <Link
                href="/Lick"
                className={`block p-2 rounded hover:bg-gray-700 ${
                  mounted && pathname === "/Lick" ? "bg-gray-700" : ""
                }`}
              >
                Lick
              </Link>
              <Link
                href="/Ride"
                className={`block p-2 rounded hover:bg-gray-700 ${
                  mounted && pathname === "/Ride" ? "bg-gray-700" : ""
                }`}
              >
                Ride
              </Link>
              <Link
                href="/Scissors"
                className={`block p-2 rounded hover:bg-gray-700 ${
                  mounted && pathname === "/Scissors" ? "bg-gray-700" : ""
                }`}
              >
                Scissors
              </Link>
              <Link
                href="/Close"
                className={`block p-2 rounded hover:bg-gray-700 ${
                  mounted && pathname === "/Close" ? "bg-gray-700" : ""
                }`}
              >
                Close
              </Link> 
              <Link
                href="/Suck"
                className={`block p-2 rounded hover:bg-gray-700 ${
                  mounted && pathname === "/Suck" ? "bg-gray-700" : ""
                }`}
              >
                Suck
              </Link>
              <Link
                href="/Asian"
                className={`block p-2 rounded hover:bg-gray-700 ${
                  mounted && pathname === "/Asian" ? "bg-gray-700" : ""
                }`}
              >
                Asian
              </Link>
              <Link
                href="/Morning"
                className={`block p-2 rounded hover:bg-gray-700 ${
                  mounted && pathname === "/Morning" ? "bg-gray-700" : ""
                }`}
              >
                Morning
              </Link>
              <Link
                href="/Ass"
                className={`block p-2 rounded hover:bg-gray-700 ${
                  mounted && pathname === "/Ass" ? "bg-gray-700" : ""
                }`}
              >
                Ass
              </Link>
              <Link
                href="/Hairy"
                className={`block p-2 rounded hover:bg-gray-700 ${
                  mounted && pathname === "/Hairy" ? "bg-gray-700" : ""
                }`}
              >
                Hairy
              </Link>
              <Link
                href="/Hand"
                className={`block p-2 rounded hover:bg-gray-700 ${
                  mounted && pathname === "/Hand" ? "bg-gray-700" : ""
                }`}
              >
                Hand
              </Link>
              <Link
                href="/Under"
                className={`block p-2 rounded hover:bg-gray-700 ${
                  mounted && pathname === "/Under" ? "bg-gray-700" : ""
                }`}
              >
                Under
              </Link>
              <Link
                href="/Cute"
                className={`block p-2 rounded hover:bg-gray-700 ${
                  mounted && pathname === "/Cute" ? "bg-gray-700" : ""
                }`}
              >
                Cute
              </Link>
              <Link
                href="/Dildo"
                className={`block p-2 rounded hover:bg-gray-700 ${
                  mounted && pathname === "/Dildo" ? "bg-gray-700" : ""
                }`}
              >
                Dildo
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}