"use client";

import { useState, useEffect } from "react";
import { WifiIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function ConnectionStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [showOffline, setShowOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Show "back online" briefly
      setShowOffline(true);
      setTimeout(() => setShowOffline(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOffline(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial check
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!showOffline) return null;

  return (
    <div
      className={`fixed bottom-6 left-6 z-[200] flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl animate-slide-in ${
        isOnline
          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
          : "bg-red-500/10 border-red-500/30 text-red-400"
      }`}
    >
      {isOnline ? (
        <>
          <WifiIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Wieder online</span>
        </>
      ) : (
        <>
          <ExclamationTriangleIcon className="w-5 h-5" />
          <span className="text-sm font-medium">Keine Verbindung</span>
        </>
      )}
    </div>
  );
}
