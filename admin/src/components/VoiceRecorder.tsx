"use client";

import { useState, useRef, useEffect } from "react";
import { MicrophoneIcon, StopIcon, TrashIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";

interface VoiceRecorderProps {
  onSend: (audioBlob: Blob, duration: number) => void;
  disabled?: boolean;
}

export default function VoiceRecorder({ onSend, disabled }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const t = useTranslations("voiceMessage");

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.current = recorder;
      recorder.start();
      setIsRecording(true);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);
    } catch (err) {
      console.error("Mic access denied:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const discardRecording = () => {
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setDuration(0);
  };

  const sendRecording = () => {
    if (audioBlob) {
      onSend(audioBlob, duration);
      discardRecording();
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (audioBlob && audioUrl) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
        <audio src={audioUrl} controls className="h-10 flex-1" />
        <span className="text-sm text-white/50 tabular-nums">{formatTime(duration)}</span>
        <button
          onClick={discardRecording}
          className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
          title={t?.("discard") || "Discard"}
        >
          <TrashIcon className="w-5 h-5" />
        </button>
        <button
          onClick={sendRecording}
          disabled={disabled}
          className="p-2 rounded-lg bg-[#FC682C] text-white hover:bg-[#e55d27] transition-all disabled:opacity-50"
          title={t?.("send") || "Send"}
        >
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      disabled={disabled}
      className={`relative p-3 rounded-xl transition-all ${
        isRecording
          ? "bg-red-500 text-white animate-pulse"
          : "bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10"
      } disabled:opacity-50`}
      title={isRecording ? (t?.("stopRecording") || "Stop") : (t?.("startRecording") || "Record voice message")}
    >
      {isRecording ? (
        <>
          <StopIcon className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold bg-white text-red-500 rounded-full tabular-nums">
            {formatTime(duration)}
          </span>
        </>
      ) : (
        <MicrophoneIcon className="w-5 h-5" />
      )}
    </button>
  );
}
