import React from "react";
import { SavedCampaign } from "../types";
import { History, Calendar, ExternalLink, Trash2, ArrowRight, Sparkles, Folder } from "lucide-react";

interface SavedCampaignsSidebarProps {
  savedList: SavedCampaign[];
  activeId: string | null;
  onSelect: (campaign: SavedCampaign) => void;
  onDelete: (id: string) => void;
}

export default function SavedCampaignsSidebar({ savedList, activeId, onSelect, onDelete }: SavedCampaignsSidebarProps) {
  // Format dates beautifully
  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString(undefined, { 
        month: "short", 
        day: "numeric", 
        hour: "2-digit", 
        minute: "2-digit" 
      });
    } catch {
      return "Recently Created";
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm h-full text-left flex flex-col justify-between" id="saved-campaigns-container">
      <div>
        {/* Title */}
        <h3 className="text-base font-display font-semibold text-gray-900 tracking-tight mb-5 flex items-center gap-2">
          <History className="w-4.5 h-4.5 text-indigo-600 animate-pulse-slow" />
          Saved Campaigns Workspace
        </h3>

        {/* Saved List container */}
        <div className="space-y-3 max-h-[320px] lg:max-h-none overflow-y-auto pr-1">
          {savedList.length > 0 ? (
            savedList.map((item) => {
              const isActive = item.id === activeId;
              return (
                <div
                  key={item.id}
                  id={`saved-card-${item.id}`}
                  className={`group relative p-3.5 rounded-2xl border transition duration-150 ${
                    isActive
                      ? "bg-indigo-50/50 border-indigo-200"
                      : "bg-white border-gray-150 hover:border-gray-300"
                  }`}
                >
                  <div 
                    onClick={() => onSelect(item)}
                    className="cursor-pointer space-y-1.5 pr-8"
                  >
                    <div className="flex items-center gap-1.5">
                      <Folder className={`w-3.5 h-3.5 ${isActive ? "text-indigo-600" : "text-gray-400"}`} />
                      <span className="font-bold text-xs text-gray-800 hover:text-indigo-600 transition block truncate">
                        {item.request.productName}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-gray-400 font-medium">
                      <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                        {item.request.tone.split(" ")[0]}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3" />
                        {formatDate(item.timestamp)}
                      </span>
                    </div>
                  </div>

                  {/* Absolute positioning trash button */}
                  <button
                    onClick={() => onDelete(item.id)}
                    id={`delete-saved-btn-${item.id}`}
                    aria-label="Delete saved campaign"
                    className="absolute top-3 right-3 text-gray-300 hover:text-rose-600 p-1 rounded-lg hover:bg-gray-50 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition duration-150"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          ) : (
            <div className="py-8 bg-gray-50/50 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center p-4">
              <Sparkles className="w-6 h-6 text-indigo-300 block mb-2" />
              <span className="text-xs font-semibold text-gray-400 block">Workspace Empty</span>
              <p className="text-[10px] text-gray-400 max-w-[180px] mt-1 leading-snug">Generate a campaign to save your draft strategies here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info badge */}
      {savedList.length > 0 && (
        <div className="mt-6 pt-5 border-t border-gray-100 text-[10px] text-gray-400 font-mono tracking-tight text-center leading-normal">
          Campaigns stored locally within browser Cache. Export as report to keep safe.
        </div>
      )}
    </div>
  );
}
