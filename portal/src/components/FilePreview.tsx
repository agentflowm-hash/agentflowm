"use client";

import { useState } from "react";
import { XMarkIcon, ArrowDownTrayIcon, ArrowsPointingOutIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

interface FilePreviewProps {
  files: Array<{
    id: number;
    name: string;
    url?: string;
    type: string;
  }>;
  initialIndex?: number;
  onClose: () => void;
}

export default function FilePreview({ files, initialIndex = 0, onClose }: FilePreviewProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const currentFile = files[currentIndex];

  const isImage = currentFile?.type === "image";

  const goNext = () => {
    setCurrentIndex((i) => (i + 1) % files.length);
  };

  const goPrev = () => {
    setCurrentIndex((i) => (i - 1 + files.length) % files.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowRight") goNext();
    if (e.key === "ArrowLeft") goPrev();
  };

  if (!currentFile) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center gap-3">
          <span className="text-white font-medium">{currentFile.name}</span>
          <span className="text-white/50 text-sm">
            {currentIndex + 1} / {files.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {currentFile.url && (
            <a
              href={currentFile.url}
              download={currentFile.name}
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              <ArrowDownTrayIcon className="w-5 h-5" />
            </a>
          )}
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        className="max-w-5xl max-h-[80vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {isImage && currentFile.url ? (
          <img
            src={currentFile.url}
            alt={currentFile.name}
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
          />
        ) : (
          <div className="p-12 rounded-2xl bg-white/5 border border-white/10 text-center">
            <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📄</span>
            </div>
            <p className="text-white font-medium mb-2">{currentFile.name}</p>
            <p className="text-white/50 text-sm">Preview not available</p>
            {currentFile.url && (
              <a
                href={currentFile.url}
                download={currentFile.name}
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-[#FC682C] text-white hover:bg-[#e55d27] transition-all"
              >
                <ArrowDownTrayIcon className="w-4 h-4" />
                Download
              </a>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      {files.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Thumbnail Strip */}
      {files.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 rounded-xl bg-black/50 backdrop-blur-xl">
          {files.slice(0, 10).map((file, i) => (
            <button
              key={file.id}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(i);
              }}
              className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                i === currentIndex
                  ? "border-[#FC682C] opacity-100"
                  : "border-transparent opacity-50 hover:opacity-75"
              }`}
            >
              {file.type === "image" && file.url ? (
                <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-white/10 flex items-center justify-center text-xs">
                  📄
                </div>
              )}
            </button>
          ))}
          {files.length > 10 && (
            <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-white/50 text-xs">
              +{files.length - 10}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
