import React, { useState, useEffect } from "react";
import CampaignForm from "./components/CampaignForm";
import PersonaCard from "./components/PersonaCard";
import ChannelPreview from "./components/ChannelPreview";
import TimelineAndBudget from "./components/TimelineAndBudget";
import SavedCampaignsSidebar from "./components/SavedCampaignsSidebar";
import { CampaignRequest, MarketingCampaign, SavedCampaign } from "./types";
import { 
  Sparkles, Layers, Quote, ArrowLeft, Download, Copy, Check, Send, AlertCircle, Plus, Trash2, ShieldAlert
} from "lucide-react";

const WORKSPACE_STORAGE_KEY = "marketing_campaigns_db";

export default function App() {
  // Application Primary States
  const [currentRequest, setCurrentRequest] = useState<CampaignRequest | null>(null);
  const [activeCampaign, setActiveCampaign] = useState<MarketingCampaign | null>(null);
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(null);
  
  const [savedCampaigns, setSavedCampaigns] = useState<SavedCampaign[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState("Initializing Core Architect...");
  const [refineText, setRefineText] = useState("");
  const [copiedState, setCopiedState] = useState(false);

  // Reassuring loading steps to cycle through during server-side processing
  useEffect(() => {
    if (!isLoading) return;
    const steps = [
      "Analyzing product specifications and market positioning...",
      "Modeling targeted customer buyer personas...",
      "Drafting psychological hooks and campaign taglines...",
      "Formulating creative graphic concepts for social channels...",
      "Compiling high-converting copy for social publications...",
      "Writing subject lines and triggers for direct email marketing...",
      "Reviewing SEO metrics for blog blueprint and keywords...",
      "Optimizing headline length restrictions for Google Search Ads...",
      "Establishing action timelines and allocating budget investments..."
    ];
    let stepIndex = 0;
    const interval = setInterval(() => {
      stepIndex = (stepIndex + 1) % steps.length;
      setLoadingStep(steps[stepIndex]);
    }, 2800);

    return () => clearInterval(interval);
  }, [isLoading]);

  // Load saved campaigns from LocalStorage on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem(WORKSPACE_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          setSavedCampaigns(parsed);
          // If there is at least one, activate it optionally or let them click
        }
      }
    } catch (e) {
      console.error("Localstorage load error:", e);
    }
  }, []);

  // Save campaigns to LocalStorage
  const persistCampaigns = (newList: SavedCampaign[]) => {
    setSavedCampaigns(newList);
    try {
      localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(newList));
    } catch (e) {
      console.error("LocalStorage save error:", e);
    }
  };

  // 1. Submit Campaign Generation
  const handleGenerateCampaign = async (request: CampaignRequest) => {
    setIsLoading(true);
    setErrorMsg(null);
    setLoadingStep("Connecting to chief marketing engine...");
    
    try {
      const response = await fetch("/api/campaign/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        let errMsg = "An unexpected server issue occurred.";
        try {
          const text = await response.text();
          const parsed = JSON.parse(text);
          errMsg = parsed.error || errMsg;
        } catch {
          errMsg = `Server Error (Status: ${response.status})`;
        }
        throw new Error(errMsg);
      }

      let campaignData: MarketingCampaign;
      try {
        const text = await response.text();
        campaignData = JSON.parse(text);
      } catch {
        throw new Error("Failed to parse campaign layout response from direct channels.");
      }
      
      // Successfully generated, create unique tracking id
      const uniqueId = "campaign_" + Date.now();
      const savedNode: SavedCampaign = {
        id: uniqueId,
        timestamp: new Date().toISOString(),
        request: request,
        campaign: campaignData
      };

      setCurrentRequest(request);
      setActiveCampaign(campaignData);
      setActiveCampaignId(uniqueId);
      
      // Update Saved list
      persistCampaigns([savedNode, ...savedCampaigns]);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to finalize campaign layout.");
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Submit AI Campaign Refinement
  const handleRefineCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refineText.trim() || !activeCampaign) return;

    setIsRefining(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/campaign/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentCampaign: activeCampaign,
          refinementInstructions: refineText
        })
      });

      if (!response.ok) {
        let errMsg = "Refinement failed.";
        try {
          const text = await response.text();
          const parsed = JSON.parse(text);
          errMsg = parsed.error || errMsg;
        } catch {
          errMsg = `Server Error (Status: ${response.status})`;
        }
        throw new Error(errMsg);
      }

      let refinedCampaignData: MarketingCampaign;
      try {
        const text = await response.text();
        refinedCampaignData = JSON.parse(text);
      } catch {
        throw new Error("Failed to parse the refined campaign strategy data properly.");
      }
      
      // Save revised content into the currently active campaign item
      const updatedCampaigns = savedCampaigns.map(item => {
        if (item.id === activeCampaignId) {
          return {
            ...item,
            campaign: refinedCampaignData,
            timestamp: new Date().toISOString() // refresh edit hour
          };
        }
        return item;
      });

      setActiveCampaign(refinedCampaignData);
      persistCampaigns(updatedCampaigns);
      setRefineText(""); // clear input

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An error occurred during creative refinement.");
    } finally {
      setIsRefining(false);
    }
  };

  // Handle active catalog selection
  const handleSelectSaved = (savedNode: SavedCampaign) => {
    setCurrentRequest(savedNode.request);
    setActiveCampaign(savedNode.campaign);
    setActiveCampaignId(savedNode.id);
    setErrorMsg(null);
  };

  // Handle deletion
  const handleDeleteSaved = (id: string) => {
    const newList = savedCampaigns.filter(item => item.id !== id);
    persistCampaigns(newList);

    if (activeCampaignId === id) {
      // Clear active editor space
      setActiveCampaign(null);
      setActiveCampaignId(null);
      setCurrentRequest(null);
    }
  };

  // Exit result screen to form builder
  const handleClearWorkspace = () => {
    setActiveCampaign(null);
    setActiveCampaignId(null);
    setCurrentRequest(null);
    setErrorMsg(null);
  };

  // Copy structured textual breakdown
  const handleCopyOutline = () => {
    if (!activeCampaign) return;
    
    const formatted = `
CAMPAIGN SUMMARY OUTLINE
Theme: ${activeCampaign.theme}
Slogan: ${activeCampaign.slogan}
Overview: ${activeCampaign.description}

BUYER PERSONA:
Name: ${activeCampaign.targetPersona.name}
Demographics: ${activeCampaign.targetPersona.demographics}
Pain Points: ${activeCampaign.targetPersona.painPoints.join(", ")}
Interests: ${activeCampaign.targetPersona.interests.join(", ")}
Value Proposition: ${activeCampaign.targetPersona.valueProposition}
`;
    navigator.clipboard.writeText(formatted.trim());
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  // Download raw campaign schema JSON file
  const handleDownloadReport = () => {
    if (!activeCampaign) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeCampaign, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `Campaign_Architecture_${currentRequest?.productName.replace(/\W+/g, "_")}.json`);
    dlAnchorElem.click();
    dlAnchorElem.remove();
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col justify-between" id="applet-root">
      {/* 1. TOP GLOBAL ARCHITECT HEADER */}
      <header className="bg-white border-b border-gray-100 py-4.5 px-6 sticky top-0 z-40 shadow-sm shadow-gray-50/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-600/10">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-base font-display font-bold text-gray-900 tracking-tight leading-tight">GrowthLab</h1>
              <p className="text-[11px] text-gray-400 font-medium">SaaS Marketing Campaign Architect • powered by Gemini 3.5</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeCampaign && (
              <button
                id="header-back-btn"
                onClick={handleClearWorkspace}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 px-3.5 py-2 hover:bg-gray-50 border border-gray-200 bg-white rounded-xl transition shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                New Brand Campaign
              </button>
            )}
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping block shrink-0" title="System Live" />
          </div>
        </div>
      </header>

      {/* 2. MAIN HUB CONTROLLER SECTION */}
      <main className="max-w-7xl w-full mx-auto px-4 md:px-6 py-8 grow">
        
        {/* If server throws and error banner */}
        {errorMsg && (
          <div className="mb-6 bg-rose-50 border border-rose-100 rounded-2xl p-4.5 flex items-start gap-3 text-left shadow-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-sm text-rose-800 block">Workflow Halt Alert</span>
              <p className="text-xs text-rose-600 mt-1">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* LOADING SCREEN WITH ACTIVE TICKERS */}
        {isLoading ? (
          <div className="min-h-[460px] flex items-center justify-center p-10 bg-white border border-gray-100 rounded-3xl shadow-xl shadow-gray-50/50">
            <div className="max-w-md text-center space-y-6">
              {/* Spinner */}
              <div className="relative w-16 h-16 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
                <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 border-r-indigo-600 animate-spin" />
              </div>

              <div className="space-y-2.5">
                <h3 className="text-xl font-display font-semibold text-gray-900 tracking-tight">Drafting Brand Strategy</h3>
                <p className="text-sm font-medium text-indigo-600 animate-pulse min-h-[36px] px-4 font-mono leading-relaxed">
                  {loadingStep}
                </p>
                <p className="text-xs text-gray-400 max-w-[280px] mx-auto leading-normal">
                  Our algorithm processes content length constraints, persona pain points, and distribution structures dynamically. Typically takes 5-10 seconds.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* NO ACTIVE GENERATED CAMPAIGN / EMPTY SCREEN */}
            {!activeCampaign ? (
              <React.Fragment>
                {/* Side grid - Saved campaigns workspace */}
                <div className="lg:col-span-3">
                  <SavedCampaignsSidebar
                    savedList={savedCampaigns}
                    activeId={activeCampaignId}
                    onSelect={handleSelectSaved}
                    onDelete={handleDeleteSaved}
                  />
                </div>

                {/* Main grid - Launch configuration */}
                <div className="lg:col-span-9 space-y-8">
                  {/* Visual Intro card */}
                  <div className="bg-gradient-to-br from-indigo-900 via-[#1e1b4b] to-violet-950 p-6 md:p-8 rounded-3xl text-left text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="relative z-10 max-w-xl space-y-3">
                      <div className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-200 text-[10px] uppercase tracking-wider font-mono px-3 py-1 rounded-full border border-indigo-400/15">
                        <Sparkles className="w-3.5 h-3.5" />
                        AI Growth Engine
                      </div>
                      <h2 className="text-2xl md:text-3xl font-display font-semibold tracking-tight text-white leading-tight">
                        Launch hyper-converting campaigns in minutes.
                      </h2>
                      <p className="text-[13px] text-indigo-100/90 leading-relaxed font-sans">
                        Provide a product name and description, select distribution channels, and tone presets. The server coordinates with Gemini 3.5 on the backend to structure slogans, copy assets, ideal demographics, and investment maps.
                      </p>
                    </div>
                  </div>

                  {/* Config Form */}
                  <CampaignForm 
                    onSubmit={handleGenerateCampaign} 
                    isLoading={isLoading} 
                  />
                </div>
              </React.Fragment>
            ) : (
              // RESULTS HUB WORKSPACE
              <div className="lg:col-span-12 space-y-8">
                
                {/* Result header banner */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm text-left flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden" id="campaign-banner">
                  <div className="absolute right-0 top-0 w-48 h-48 bg-indigo-50/40 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="space-y-2 relative z-10 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-mono uppercase tracking-wider">
                        Theme: {activeCampaign.theme}
                      </span>
                      <span className="text-[11px] bg-gray-50 border border-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-mono">
                        Tone: {currentRequest?.tone}
                      </span>
                    </div>

                    <h2 className="text-3xl font-display font-extrabold text-indigo-950 tracking-tight">
                      "{activeCampaign.slogan}"
                    </h2>

                    <p className="text-sm text-gray-500 leading-relaxed font-sans">
                      {activeCampaign.description}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap md:flex-col gap-2 shrink-0 md:w-56 justify-start relative z-10">
                    <button
                      id="export-report-btn"
                      onClick={handleDownloadReport}
                      className="grow inline-flex items-center justify-center gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4.5 rounded-xl transition shadow-sm cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Export Campaign JSON
                    </button>
                    <button
                      id="copy-outline-btn"
                      onClick={handleCopyOutline}
                      className="grow inline-flex items-center justify-center gap-1.5 text-xs font-semibold bg-white hover:bg-gray-50 text-gray-700 py-3 px-4.5 border border-gray-200 rounded-xl transition shadow-sm cursor-pointer"
                    >
                      {copiedState ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-600">Copied Outline</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy Outline Summary
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* REFINE CAMPAIGN OPTIONS INPUT */}
                <div className="bg-indigo-50/40 border border-indigo-100/60 rounded-3xl p-5 md:p-6 text-left space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-indigo-950">Refine Campaign Strategy</h3>
                      <p className="text-[11px] text-indigo-600 font-medium">Give instructions to adjust individual details, rewrite social thread angles, or optimize CTA messaging.</p>
                    </div>
                  </div>

                  <form onSubmit={handleRefineCampaign} className="flex gap-2" id="refine-campaign-form">
                    <input
                      required
                      type="text"
                      id="campaign-refinement-input"
                      placeholder="e.g. Make Instagram posts sound more technical, or draft launch email with higher urgency promo"
                      value={refineText}
                      onChange={(e) => setRefineText(e.target.value)}
                      disabled={isRefining}
                      className="grow bg-white border border-gray-200/80 hover:border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-3 text-xs outline-none transition disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      id="submit-refinement-btn"
                      disabled={!refineText.trim() || isRefining}
                      className={`inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-semibold text-xs rounded-xl px-5 py-3 transition shrink-0 ${
                        isRefining ? "animate-pulse" : ""
                      }`}
                    >
                      {isRefining ? (
                        <div className="flex items-center gap-1.5">
                          <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Refining...
                        </div>
                      ) : (
                        <span className="flex items-center gap-1">
                          Refine <Send className="w-3 h-3 ml-0.5" />
                        </span>
                      )}
                    </button>
                  </form>

                  {/* Suggestion tags to click on refinement input to show what is possible */}
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mr-1">Quick Refinements:</span>
                    <button
                      type="button"
                      id="refine-tag-1"
                      onClick={() => setRefineText("Make the slogan punchier, bolder, and more energetic")}
                      className="text-[10px] bg-white hover:bg-indigo-50 border border-gray-150 text-indigo-700 px-2.5 py-1 rounded-lg transition"
                    >
                      "Make slogan punchier and bolder"
                    </button>
                    <button
                      type="button"
                      id="refine-tag-2"
                      onClick={() => setRefineText("Target older enterprise demographics and add technical highlights in the pain points")}
                      className="text-[10px] bg-white hover:bg-indigo-50 border border-gray-150 text-indigo-700 px-2.5 py-1 rounded-lg transition"
                    >
                      "Target enterprise demographics"
                    </button>
                    <button
                      type="button"
                      id="refine-tag-3"
                      onClick={() => setRefineText("Adjust the budget percentages towards Organic Content Marketing, and rewrite SEO copy blueprint details accordingly")}
                      className="text-[10px] bg-white hover:bg-indigo-50 border border-gray-150 text-indigo-700 px-2.5 py-1 rounded-lg transition"
                    >
                      "Focus budget on organic content SEO"
                    </button>
                  </div>
                </div>

                {/* GRID DETAILS ROW 1: USER PERSONA & MARKETING ASSETS PREVIEW */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Persona details */}
                  <div className="md:col-span-5 h-full">
                    <PersonaCard persona={activeCampaign.targetPersona} />
                  </div>

                  {/* Asset Mock previews container */}
                  <div className="md:col-span-7 h-full">
                    <ChannelPreview campaign={activeCampaign} />
                  </div>
                </div>

                {/* GRID DETAILS ROW 2: CALENDAR SCHEDULE & BUDGET BAR MATRIX */}
                <TimelineAndBudget 
                  timeline={activeCampaign.timelineStrategy} 
                  budget={activeCampaign.budgetAllocation} 
                />

                {/* History sidebar loaded directly underneath on mobile / as a horizontal tray on results */}
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-3xl text-left">
                  <span className="text-xs font-semibold text-gray-400 block px-2 mb-3">Other Campaign drafts saved:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    {savedCampaigns.filter(item => item.id !== activeCampaignId).slice(0, 4).map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelectSaved(item)}
                        className="bg-white hover:bg-indigo-50/20 border border-gray-150 hover:border-indigo-200 p-3.5 rounded-2xl cursor-pointer transition flex justify-between items-center group"
                      >
                        <div className="truncate pr-4">
                          <strong className="text-xs text-gray-700 font-bold block truncate">{item.request.productName}</strong>
                          <span className="text-[9px] text-gray-400 block mt-0.5">{item.request.tone}</span>
                        </div>
                        <Trash2
                          id={`delete-inner-btn-${item.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSaved(item.id);
                          }}
                          className="w-3.5 h-3.5 text-gray-300 hover:text-rose-600 block transition"
                        />
                      </div>
                    ))}
                    {savedCampaigns.length <= 1 && (
                      <div className="sm:col-span-4 py-3 text-center text-xs text-gray-400 font-mono tracking-tight">
                        No secondary campaign drafts in catalog yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* 3. FOOTER REGION */}
      <footer className="bg-white border-t border-gray-100 py-6 px-6 text-center text-gray-400 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
          <span>© {new Date().getFullYear()} GrowthLab Campaigns Engine. All Rights Reserved.</span>
          <span>Security Guaranteed via Sandbox Environment • Port 3000 Ingress</span>
        </div>
      </footer>
    </div>
  );
}
