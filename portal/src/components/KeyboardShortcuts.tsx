"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface KeyboardShortcutsProps {
  onTabChange?: (tab: string) => void;
  onRefresh?: () => void;
  onToggleProfile?: () => void;
}

export default function KeyboardShortcuts({
  onTabChange,
  onRefresh,
  onToggleProfile,
}: KeyboardShortcutsProps) {
  const router = useRouter();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignore if typing in input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // CMD/Ctrl + key shortcuts
      if (e.metaKey || e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case "1":
            e.preventDefault();
            onTabChange?.("overview");
            break;
          case "2":
            e.preventDefault();
            onTabChange?.("messages");
            break;
          case "3":
            e.preventDefault();
            onTabChange?.("files");
            break;
          case "4":
            e.preventDefault();
            onTabChange?.("approvals");
            break;
          case "r":
            e.preventDefault();
            onRefresh?.();
            break;
          case "p":
            e.preventDefault();
            onToggleProfile?.();
            break;
        }
      }

      // Escape to close modals
      if (e.key === "Escape") {
        onToggleProfile?.();
      }

      // ? to show help
      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        showHelp();
      }
    },
    [onTabChange, onRefresh, onToggleProfile]
  );

  const showHelp = () => {
    // Could show a modal with shortcuts
    console.log(`
    Keyboard Shortcuts:
    ⌘1 - Overview
    ⌘2 - Messages
    ⌘3 - Files
    ⌘4 - Approvals
    ⌘R - Refresh
    ⌘P - Profile
    Esc - Close
    `);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return null;
}
