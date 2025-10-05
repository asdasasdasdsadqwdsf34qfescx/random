"use client";
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

export type ToastType = "info" | "success" | "error" | "warning";
export type Toast = { id: number; message: string; type: ToastType; duration?: number };

interface ToastContextValue {
  addToast: (message: string, type?: ToastType, durationMs?: number) => void;
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType = "info", durationMs = 3500) => {
    const id = ++idRef.current;
    const toast: Toast = { id, message, type, duration: durationMs };
    setToasts((prev) => [...prev, toast]);
    if (durationMs > 0) {
      window.setTimeout(() => removeToast(id), durationMs);
    }
  }, [removeToast]);

  const value = useMemo(() => ({ addToast, removeToast }), [addToast, removeToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] space-y-2 w-[90vw] max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-md border px-3 py-2 shadow-lg text-sm flex items-start gap-2 backdrop-blur bg-opacity-90 ${
              t.type === "error" ? "bg-red-600/20 border-red-400/30 text-red-100" :
              t.type === "success" ? "bg-green-600/20 border-green-400/30 text-green-100" :
              t.type === "warning" ? "bg-yellow-600/20 border-yellow-400/30 text-yellow-100" :
              "bg-gray-700/70 border-white/10 text-white"
            }`}
            role="status"
            aria-live="polite"
          >
            <span className="flex-1">{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              className="ml-2 rounded bg-white/10 hover:bg-white/20 px-2 py-0.5 text-xs"
              aria-label="Close notification"
            >
              Close
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
