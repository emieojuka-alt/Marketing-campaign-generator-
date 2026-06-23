import React from "react";
import { TargetPersona } from "../types";
import { User, ShieldAlert, Heart, Quote, Activity } from "lucide-react";

interface PersonaCardProps {
  persona: TargetPersona;
}

export default function PersonaCard({ persona }: PersonaCardProps) {
  // Extract initials for the modern abstract avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm hover:shadow-md transition duration-200" id="persona-card-container">
      {/* Title */}
      <h3 className="text-lg font-display font-semibold text-gray-900 tracking-tight mb-5 flex items-center gap-2">
        <User className="w-5 h-5 text-indigo-600" />
        Target Buyer Persona
      </h3>

      {/* Profile Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pb-6 border-b border-gray-100">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white font-display font-bold text-xl tracking-wider shadow-lg shadow-indigo-500/10 shrink-0">
          {getInitials(persona.name || "Target Customer")}
        </div>
        <div>
          <h4 className="text-xl font-display font-bold text-gray-900">{persona.name}</h4>
          <div className="inline-flex items-center gap-1.5 bg-gray-50 text-gray-500 text-xs px-2.5 py-1 rounded-md font-mono mt-1 border border-gray-100">
            <Activity className="w-3.5 h-3.5" />
            {persona.demographics}
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="mt-6 space-y-6">
        {/* Value Prop Highlight */}
        <div className="bg-indigo-50/50 border border-indigo-100/60 rounded-2xl p-5 relative overflow-hidden">
          <Quote className="absolute -right-2 -top-2 w-16 h-16 text-indigo-500/5 rotate-12 pointer-events-none" />
          <h5 className="text-xs font-semibold text-indigo-700 uppercase tracking-widest mb-1.5 font-mono">The Hook (Core Value Proposition)</h5>
          <p className="text-gray-800 text-sm font-medium leading-relaxed italic">
            "{persona.valueProposition}"
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Pain Points */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 uppercase tracking-wide">
              <ShieldAlert className="w-4 h-4" />
              Primary Pain Points / Struggles
            </div>
            <ul className="space-y-2">
              {persona.painPoints.map((item, index) => (
                <li key={index} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-2" />
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Interests */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 uppercase tracking-wide">
              <Heart className="w-4 h-4" />
              Interests & Core Channels
            </div>
            <div className="flex flex-wrap gap-1.5">
              {persona.interests.map((item, index) => (
                <span
                  key={index}
                  className="text-xs px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100/80 font-medium"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
