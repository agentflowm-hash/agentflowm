"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CheckCircleIcon, ExclamationTriangleIcon, XMarkIcon, InformationCircleIcon } from "@heroicons/react/24/outline";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (type: ToastType, message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: ToastType, message: string, duration = 4000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, message, duration }]);
    
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const icons = {
    success: <CheckCircleIcon className="w-5 h-5 text-emerald-400" />,
    error: <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />,
    info: <InformationCircleIcon className="w-5 h-5 text-blue-400" />,
    warning: <ExclamationTriangleIcon className="w-5 h-5 text-amber-400" />,
  };

  const colors = {
    success: "border-emerald-500/30 bg-emerald-500/10",
    error: "border-red-500/30 bg-red-500/10",
    info: "border-blue-500/30 bg-blue-500/10",
    warning: "border-amber-500/30 bg-amber-500/10",
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-2xl animate-slide-in ${colors[toast.type]}`}
          >
            {icons[toast.type]}
            <p className="flex-1 text-sm text-white">{toast.message}</p>
            <button
              onClick={() => dismissToast(toast.id)}
              className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <style jsx global>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </ToastContext.Provider>
  );
}
