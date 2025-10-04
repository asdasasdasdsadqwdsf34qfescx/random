"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type SidebarContextValue = {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
};

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  // Initialize from localStorage or viewport
  useEffect(() => {
    try {
      const saved = localStorage.getItem("__sidebar_open");
      if (saved !== null) {
        setIsOpen(saved === "1");
        return;
      }
    } catch {}
    if (typeof window !== "undefined") {
      setIsOpen(window.innerWidth >= 768);
    }
  }, []);

  // Persist preference
  useEffect(() => {
    try {
      localStorage.setItem("__sidebar_open", isOpen ? "1" : "0");
    } catch {}
  }, [isOpen]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(v => !v), []);

  const value = useMemo(() => ({ isOpen, toggle, open, close }), [isOpen, toggle, open, close]);
  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error("useSidebar must be used within SidebarProvider");
  return ctx;
}
