"use client";

import { useState } from "react";
import {
  PlusIcon,
  UserPlusIcon,
  DocumentPlusIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  XMarkIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

interface QuickActionsProps {
  onAddLead?: () => void;
  onAddClient?: () => void;
  onSendEmail?: () => void;
  onScheduleCall?: () => void;
  onCreateTask?: () => void;
}

export default function QuickActions({
  onAddLead,
  onAddClient,
  onSendEmail,
  onScheduleCall,
  onCreateTask,
}: QuickActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { icon: UserPlusIcon, label: "Neuer Lead", color: "from-blue-500 to-cyan-500", onClick: onAddLead },
    { icon: DocumentPlusIcon, label: "Neuer Kunde", color: "from-emerald-500 to-green-500", onClick: onAddClient },
    { icon: EnvelopeIcon, label: "E-Mail senden", color: "from-purple-500 to-pink-500", onClick: onSendEmail },
    { icon: PhoneIcon, label: "Anruf planen", color: "from-orange-500 to-amber-500", onClick: onScheduleCall },
    { icon: CalendarIcon, label: "Aufgabe erstellen", color: "from-red-500 to-rose-500", onClick: onCreateTask },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action Buttons */}
      <div className={`absolute bottom-16 right-0 flex flex-col gap-3 transition-all duration-300 ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={() => { action.onClick?.(); setIsOpen(false); }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r ${action.color} text-white font-medium shadow-lg hover:scale-105 transition-all whitespace-nowrap`}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <action.icon className="w-5 h-5" />
            {action.label}
          </button>
        ))}
      </div>

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full bg-gradient-to-r from-[#FC682C] to-[#FF8F5C] text-white shadow-2xl hover:shadow-[#FC682C]/50 hover:scale-110 transition-all flex items-center justify-center ${isOpen ? "rotate-45" : ""}`}
      >
        {isOpen ? <XMarkIcon className="w-6 h-6" /> : <PlusIcon className="w-6 h-6" />}
      </button>

      {/* Glow Effect */}
      <div className="absolute inset-0 w-14 h-14 rounded-full bg-[#FC682C] blur-xl opacity-30 animate-pulse pointer-events-none" />
    </div>
  );
}
