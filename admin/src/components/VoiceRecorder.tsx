"use client";

import { useState, useRef, useEffect } from "react";
import { MicrophoneIcon, StopIcon, PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface VoiceRecorderProps {
  onSend?: (audioBlob: Blob, duration: number) => Promise<void>;
  disabled?: boolean;
  maxDuration?: number; // in seconds
}

export default function VoiceRecorder({
  onSend,
  disabled = false,
  maxDuration = 120,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [sending, setSending] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration((d) => {
          if (d >= maxDuration) {
            stopRecording();
            return d;
          }
          return d + 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Mikrofon-Zugriff verweigert:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRecording(false);
  };

  const cancelRecording = () => {
    stopRecording();
    setAudioBlob(null);
    setDuration(0);
  };

  const sendRecording = async () => {
    if (!audioBlob || !onSend) return;
    setSending(true);
    try {
      await onSend(audioBlob, duration);
      setAudioBlob(null);
      setDuration(0);
    } catch (err) {
      console.error("Senden fehlgeschlagen:", err);
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Preview mode (after recording)
  if (audioBlob) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-[#FC682C]/10 border border-[#FC682C]/30 rounded-xl animate-fade-in">
        <span className="text-sm text-white/70">🎤 {formatDuration(duration)}</span>
        <button
          onClick={cancelRecording}
          className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-red-400 transition-colors"
          title="Verwerfen"
        >
          <XMarkIcon className="w-4 h-4" />
        </button>
        <button
          onClick={sendRecording}
          disabled={sending}
          className="p-1.5 rounded-lg bg-[#FC682C] text-white hover:bg-[#FC682C]/80 disabled:opacity-50 transition-colors"
          title="Senden"
        >
          <PaperAirplaneIcon className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Recording mode
  if (isRecording) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-xl animate-pulse">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        <span className="text-sm text-red-400 font-medium">{formatDuration(duration)}</span>
        <button
          onClick={stopRecording}
          className="p-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
          title="Stoppen"
        >
          <StopIcon className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Default state
  return (
    <button
      onClick={startRecording}
      disabled={disabled}
      className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-[#FC682C]/20 border border-white/[0.08] hover:border-[#FC682C]/30 text-white/50 hover:text-[#FC682C] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      title="Sprachnachricht aufnehmen"
    >
      <MicrophoneIcon className="w-5 h-5" />
    </button>
  );
}
