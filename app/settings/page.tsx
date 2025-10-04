"use client";

import { useCallback, useMemo, useState } from "react";
import { CheckCircle2, Loader2, RefreshCw, Settings as SettingsIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SettingsPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const canClick = status === "idle" || status === "error" || status === "success";

  const handleSync = useCallback(async () => {
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/sync", { method: "GET", cache: "no-store" });
      if (res.ok) {
        const txt = await res.text();
        setMessage(txt || "Models synchronized successfully");
        setStatus("success");
      } else {
        const errTxt = await res.text();
        setMessage(errTxt || "Sync failed");
        setStatus("error");
      }
    } catch (e) {
      setMessage("Network error while syncing");
      setStatus("error");
    }
  }, []);

  const statusLabel = useMemo(() => {
    switch (status) {
      case "loading":
        return "Syncing...";
      case "success":
        return "Synced";
      case "error":
        return "Retry";
      default:
        return "Sync Models";
    }
  }, [status]);

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <header className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Settings</h1>
            <p className="text-sm text-gray-500">Control your application preferences</p>
          </div>
        </header>

        <div className="space-y-6">
          <section className="rounded-xl border border-white/10 bg-white/5 backdrop-blur p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-medium">Models</h2>
                <p className="text-sm text-gray-500">Synchronize models from the backend service</p>
              </div>

              <button
                onClick={canClick ? handleSync : undefined}
                disabled={!canClick || status === "loading"}
                className={`relative inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed
                ${status === "success" ? "bg-emerald-600 text-white" : status === "error" ? "bg-rose-600 text-white" : "bg-indigo-600 text-white hover:bg-indigo-500"}`}
              >
                <AnimatePresence initial={false} mode="wait">
                  {status === "loading" && (
                    <motion.span
                      key="loading"
                      className="flex items-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </motion.span>
                  )}
                  {status === "success" && (
                    <motion.span
                      key="success"
                      className="flex items-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </motion.span>
                  )}
                  {status === "error" && (
                    <motion.span
                      key="error"
                      className="flex items-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </motion.span>
                  )}
                </AnimatePresence>
                <span>{statusLabel}</span>
              </button>
            </div>

            <AnimatePresence>
              {status !== "idle" && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-gray-300"
                >
                  {message}
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </div>
    </div>
  );
}
