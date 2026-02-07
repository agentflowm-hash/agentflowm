"use client";

import { ReactNode } from "react";
import { ToastProvider } from "./Toast";
import ConnectionStatus from "./ConnectionStatus";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <ConnectionStatus />
    </ToastProvider>
  );
}
