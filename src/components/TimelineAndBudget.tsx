import React from "react";
import { TimelinePhase, BudgetChannel } from "../types";
import { Calendar, DollarSign, Clock, HelpCircle, CheckCircle, TrendingUp } from "lucide-react";

interface TimelineAndBudgetProps {
  timeline: TimelinePhase[];
  budget: BudgetChannel[];
}

export default function TimelineAndBudget({ timeline, budget }: TimelineAndBudgetProps) {
  // Helper to color-code channel bars index tags to match beautiful design aesthetics
  const getChannelColor = (index: number) => {
    const colors = [
      { bg: "bg-indigo-600", text: "text-indigo-700", border: "border-indigo-100", pill: "bg-indigo-50" },
      { bg: "bg-emerald-500", text: "text-emerald-700", border: "border-emerald-100", pill: "bg-emerald-50" },
      { bg: "bg-amber-500", text: "text-amber-700", border: "border-amber-100", pill: "bg-amber-50" },
      { bg: "bg-sky-500", text: "text-sky-700", border: "border-sky-100", pill: "bg-sky-50" },
      { bg: "bg-rose-500", text: "text-rose-700", border: "border-rose-100", pill: "bg-rose-50" }
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="timeline-budget-container">
      {/* 1. TIMELINE SCHEDULE STRATEGY */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm text-left">
        <h3 className="text-lg font-display font-semibold text-gray-900 tracking-tight mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          Campaign Timeline & Stages
        </h3>

        {timeline?.length > 0 ? (
          <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
            {timeline.map((phase, idx) => (
              <div key={idx} className="flex gap-4 relative animate-fade-in">
                {/* Visual marker node */}
                <div className="w-8.5 h-8.5 rounded-full bg-indigo-50 border border-indigo-100/80 hover:border-indigo-300 flex items-center justify-center shrink-0 shadow-sm z-10 bg-white transition duration-200">
                  <Clock className="w-4 h-4 text-indigo-600" />
                </div>
                {/* Content */}
                <div className="grow space-y-1 bg-gray-50/50 hover:bg-gray-50 border border-gray-100/50 p-4 rounded-2xl transition duration-150">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h4 className="text-sm font-semibold text-gray-900">{phase.phase}</h4>
                    <span className="text-[10px] font-mono font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full uppercase tracking-wider self-start sm:self-center">
                      {phase.duration}
                    </span>
                  </div>
                  
                  {/* Task bullet list */}
                  <div className="pt-2.5 space-y-2">
                    {phase.activities?.map((act, index) => (
                      <div key={index} className="flex items-start gap-2 text-xs text-gray-600">
                        <CheckCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                        <span className="leading-snug">{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-400 py-8 text-center">No timeline details processed.</div>
        )}
      </div>

      {/* 2. BUDGET ALLOCATION CHANNEL MATRIX */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm text-left flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-display font-semibold text-gray-900 tracking-tight mb-6 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-indigo-600" />
            Budget Configuration Strategy
          </h3>

          {/* Bar accumulation visual diagram */}
          {budget?.length > 0 ? (
            <div className="space-y-6">
              {/* Composite percentage bar */}
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 font-mono">Weighted Focus Matrix:</span>
                <div className="w-full h-4.5 rounded-full bg-gray-50 border border-gray-100 overflow-hidden flex shadow-inner">
                  {budget.map((channel, idx) => {
                    const styling = getChannelColor(idx);
                    return (
                      <div
                        key={idx}
                        style={{ width: `${channel.percentage}%` }}
                        className={`${styling.bg} h-full transition-all duration-300 relative group`}
                        title={`${channel.channel}: ${channel.percentage}%`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Channel specific rows */}
              <div className="space-y-4">
                {budget.map((item, idx) => {
                  const style = getChannelColor(idx);
                  return (
                    <div key={idx} className={`p-4 border ${style.border} rounded-2xl bg-white space-y-1.5`}>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5">
                          <span className={`w-2.5 h-2.5 rounded-full ${style.bg}`} />
                          <strong className="text-xs font-semibold text-gray-800">{item.channel}</strong>
                        </span>
                        <span className={`text-xs font-mono font-bold ${style.text} ${style.pill} px-2 py-0.5 rounded-md`}>
                          {item.percentage}% Allocation
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed pl-4">
                        {item.recommendation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-400 py-8 text-center">No budget strategy details loaded.</div>
          )}
        </div>

        {/* Action footnote info */}
        <div className="mt-8 border-t border-gray-100 pt-5 flex items-center gap-2.5 text-[11px] text-gray-400 bg-gray-50/50 p-3 rounded-xl border">
          <TrendingUp className="w-4 h-4 text-indigo-500" />
          <span>Calculated dynamic allocations optimized for high conversion CTR based on your creative tone preset.</span>
        </div>
      </div>
    </div>
  );
}
