import React, { useState } from "react";
import { CampaignRequest } from "../types";
import { Sparkles, Flame, HelpCircle, Layers, Target, Compass, DollarSign, ArrowRight } from "lucide-react";

// Preconfigured template cases for seamless, single-click testing
const PRODUCT_TEMPLATES = [
  {
    name: "CalmNest Sleep Pillow",
    description: "An AI-guided memory foam sleep pillow that detects micro-tensions and emits tiny rhythmic, soothing vibrations to sync with human breathing, triggering slow-wave deep sleep in under 15 minutes.",
    audience: "Stressed young professionals, light sleepers, chronic coffee drinkers, and busy parents struggling with insomnia.",
    goals: ["Direct Sales", "Lead Generation"],
    channels: ["Instagram", "Email Marketing", "Google Ads"],
    tone: "Empathetic & Warm",
    budgetType: "Medium / Growth Focus"
  },
  {
    name: "CodexLocal compiler",
    description: "An offline-first, private desktop compiler extension that detects memory leaks, suggests premium assembly/runtime code optimizations, and highlights security vulnerabilities locally, never transmitting code to external servers.",
    audience: "Privacy-centric software engineers, enterprise tech leads, and cybersecurity professionals.",
    goals: ["App Installs", "Brand Authority"],
    channels: ["LinkedIn", "Twitter/X", "SEO Blog"],
    tone: "Professional & Technical",
    budgetType: "Low / Organic Growth"
  },
  {
    name: "AeroBlend Smart Flask",
    description: "A self-cleaning modular sports flask that uses dual-frequency sonic waves to aerate and preserve the temperature of performance protein smoothies, completely preventing clumping, sediment, and odors.",
    audience: "High-performance fitness athletes, endurance runners, and wellness enthusiasts looking for premium portable nutrition.",
    goals: ["Brand Authority", "Direct Sales"],
    channels: ["Instagram", "Twitter/X", "Google Ads", "Email Marketing"],
    tone: "Bold & High-Energy",
    budgetType: "High / Aggressive Scale"
  }
];

const TONE_OPTIONS = [
  { label: "Empathetic & Warm", desc: "Compassionate, human-centric, reassuring" },
  { label: "Professional & Technical", desc: "Expert-level, data-driven, precise" },
  { label: "Bold & High-Energy", desc: "Challenger brand, punchy, persuasive" },
  { label: "Witty & Playful", desc: "Humorous, self-aware, conversational" },
  { label: "Premium & Editorial", desc: "Understated luxury, sophisticated, artistic" }
];

const CAMPAIGN_GOALS = [
  "Brand Authority",
  "Direct Sales",
  "Lead Generation",
  "App Installs",
  "Event Registrations"
];

const MARKETING_CHANNELS = [
  { id: "Instagram", name: "Instagram / Visual", desc: "Visual storytelling, reels, graphic hooks" },
  { id: "LinkedIn", name: "LinkedIn / Professional", desc: "Industry analysis, business insights, text authority" },
  { id: "Twitter/X", name: "Twitter/X / Conversation", desc: "Short-form punchy writing, threads, tech hooks" },
  { id: "Email Marketing", name: "Email Newsletters", desc: "Direct relationship, rich narratives, strong CTAs" },
  { id: "SEO Blog", name: "SEO Blog Blueprint", desc: "Thought-leadership essays, long-form search intent" },
  { id: "Google Ads", name: "PPC Google Search Ads", desc: "High-intent search queries, optimized headers" }
];

const BUDGET_OPTIONS = [
  { id: "Low / Organic Growth", label: "Low / Organic Growth", desc: "Focuses on high-ROI organic reach, text threads, and email curation." },
  { id: "Medium / Growth Focus", label: "Medium / Growth Focus", desc: "Balanced paid push on high-performing ad networks and targeted content." },
  { id: "High / Aggressive Scale", label: "High / Aggressive Scale", desc: "Multi-layered ads budget, high frequency, and rapid conversion funnels." }
];

interface CampaignFormProps {
  onSubmit: (request: CampaignRequest) => void;
  isLoading: boolean;
}

export default function CampaignForm({ onSubmit, isLoading }: CampaignFormProps) {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [campaignGoals, setCampaignGoals] = useState<string[]>(["Brand Authority"]);
  const [channels, setChannels] = useState<string[]>(["Instagram", "Email Marketing"]);
  const [tone, setTone] = useState("Empathetic & Warm");
  const [budgetType, setBudgetType] = useState("Medium / Growth Focus");

  // Load a template dynamically to simplify testing
  const loadTemplate = (tpl: typeof PRODUCT_TEMPLATES[0]) => {
    setProductName(tpl.name);
    setProductDescription(tpl.description);
    setTargetAudience(tpl.audience);
    setCampaignGoals(tpl.goals);
    setChannels(tpl.channels);
    setTone(tpl.tone);
    setBudgetType(tpl.budgetType);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim() || !productDescription.trim()) return;
    onSubmit({
      productName,
      productDescription,
      targetAudience,
      campaignGoals,
      channels,
      tone,
      budgetType
    });
  };

  const handleToggleGoal = (goal: string) => {
    setCampaignGoals(prev => 
      prev.includes(goal)
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  const handleToggleChannel = (chanId: string) => {
    setChannels(prev => 
      prev.includes(chanId)
        ? prev.length > 1 ? prev.filter(c => c !== chanId) : prev // keep at least 1
        : [...prev, chanId]
    );
  };

  const isFormValid = productName.trim().length > 0 && productDescription.trim().length > 0;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-50/50 p-6 md:p-8" id="campaign-form-container">
      {/* Header */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 font-medium px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          Campaign Architect
        </div>
        <h2 className="text-2xl font-display font-semibold text-gray-900 tracking-tight">Configure Your Campaign</h2>
        <p className="text-gray-500 text-sm mt-1">Specify your parameters or load one of our optimized high-conversion templates below.</p>
      </div>

      {/* Preset templates selector */}
      <div className="mb-8 bg-gray-50 rounded-2xl p-4 border border-gray-100">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2.5">Instant Click-to-Fill Templates:</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {PRODUCT_TEMPLATES.map((tpl, idx) => (
            <button
              key={idx}
              type="button"
              id={`template-btn-${idx}`}
              onClick={() => loadTemplate(tpl)}
              className="flex items-start text-left gap-2 px-3 py-2.5 bg-white hover:bg-indigo-50/30 border border-gray-200 hover:border-indigo-200 rounded-xl transition duration-150 group"
            >
              <div className="p-1 rounded bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100/80 transition mt-0.5">
                <Flame className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="font-medium text-xs text-gray-800 line-clamp-1">{tpl.name}</div>
                <div className="text-[10px] text-gray-400 font-mono tracking-tight mt-0.5 uppercase">{tpl.tone.split(" ")[0]}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name and Audience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label htmlFor="product-name" className="text-xs font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
              Product or Service Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="product-name"
              type="text"
              required
              placeholder="e.g. HydroPlanter Pro"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full text-sm border border-gray-200 hover:border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white rounded-xl px-4 py-3 transition outline-none"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="target-audience" className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Target Audience Profile
            </label>
            <input
              id="target-audience"
              type="text"
              placeholder="e.g. Remote developers, busy moms, organic food seekers"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              className="w-full text-sm border border-gray-200 hover:border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white rounded-xl px-4 py-3 transition outline-none"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="product-description" className="text-xs font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-1">
            Product/Service Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="product-description"
            rows={3}
            required
            placeholder="Describe the product, its unique features, competitive advantage, and the core problem it solves..."
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            className="w-full text-sm border border-gray-200 hover:border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white rounded-xl px-4 py-3 transition outline-none resize-none"
          />
        </div>

        {/* Campaign Goals */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
            <Target className="w-4 h-4 text-gray-400" />
            Core Campaign Goals <span className="text-gray-400 font-normal">(Select all that apply)</span>
          </label>
          <div className="flex flex-wrap gap-2 pt-1">
            {CAMPAIGN_GOALS.map((goal) => {
              const active = campaignGoals.includes(goal);
              return (
                <button
                  key={goal}
                  type="button"
                  id={`goal-pill-${goal.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => handleToggleGoal(goal)}
                  className={`text-xs px-3.5 py-2 rounded-xl border transition-all ${
                    active 
                      ? "bg-indigo-600 border-indigo-600 text-white font-medium" 
                      : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {goal}
                </button>
              );
            })}
          </div>
        </div>

        {/* Marketing Channels */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-gray-400" />
            Target Distribution Channels <span className="text-gray-400 font-normal">(Required to map custom copies)</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
            {MARKETING_CHANNELS.map((chan) => {
              const active = channels.includes(chan.id);
              return (
                <button
                  key={chan.id}
                  type="button"
                  id={`channel-card-${chan.id.replace(/\W+/g, '-').toLowerCase()}`}
                  onClick={() => handleToggleChannel(chan.id)}
                  className={`flex flex-col items-start p-3 text-left border rounded-xl transition ${
                    active
                      ? "bg-indigo-50/60 border-indigo-200 ring-1 ring-indigo-200"
                      : "bg-white border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => {}} // event handled by parent button click
                      className="rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 w-3.5 h-3.5"
                    />
                    <span className="text-xs font-semibold text-gray-800">{chan.name}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 line-clamp-1 leading-snug">{chan.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Brand Tone and Budget Segment */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tone selection */}
          <div className="space-y-2">
            <label htmlFor="tone-selector" className="text-xs font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-gray-400" />
              Creative Tone & Vibe
            </label>
            <select
              id="tone-selector"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full text-sm border border-gray-200 hover:border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white rounded-xl px-3 py-3 outline-none"
            >
              {TONE_OPTIONS.map((opt) => (
                <option key={opt.label} value={opt.label}>
                  {opt.label} — {opt.desc}
                </option>
              ))}
            </select>
          </div>

          {/* Budget tier */}
          <div className="space-y-2">
            <label htmlFor="budget-selector" className="text-xs font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-gray-400" />
              Estimated Budget Profile
            </label>
            <select
              id="budget-selector"
              value={budgetType}
              onChange={(e) => setBudgetType(e.target.value)}
              className="w-full text-sm border border-gray-200 hover:border-gray-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white rounded-xl px-3 py-3 outline-none"
            >
              {BUDGET_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            id="generate-campaign-btn"
            disabled={!isFormValid || isLoading}
            className={`w-full flex items-center justify-center gap-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 py-3.5 px-6 rounded-2xl transition duration-150 select-none shadow-md shadow-indigo-600/10 ${
              (!isFormValid || isLoading) ? "opacity-50 cursor-not-allowed bg-indigo-400" : ""
            }`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Assembling Marketing Architecture...
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4 animate-bounce" />
                Generate Multi-Channel Campaign
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
