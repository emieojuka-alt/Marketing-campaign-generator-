import React, { useState } from "react";
import { MarketingCampaign, SocialMediaPost, EmailMessage, GoogleAd } from "../types";
import { 
  Instagram, Linkedin, Twitter, Mail, BookOpen, Search, Copy, Check, MessageSquare, Heart, Share2, CornerDownRight, Bookmark, ArrowUpRight, Eye, RefreshCw
} from "lucide-react";

interface ChannelPreviewProps {
  campaign: MarketingCampaign;
}

export default function ChannelPreview({ campaign }: ChannelPreviewProps) {
  const [activeTab, setActiveTab] = useState<"social" | "email" | "seo" | "ads">("social");
  
  // Specific internal selector states
  const [activeSocialIdx, setActiveSocialIdx] = useState(0);
  const [activeEmailIdx, setActiveEmailIdx] = useState(0);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setCopiedStates(prev => ({ ...prev, [key]: false }));
    }, 2000);
  };

  // Helper to render platform-specific icons
  const getSocialIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes("instagram")) return <Instagram className="w-4 h-4 text-pink-500" />;
    if (p.includes("linkedin")) return <Linkedin className="w-4 h-4 text-sky-700" />;
    if (p.includes("twitter") || p.includes("x")) return <Twitter className="w-4 h-4 text-black" />;
    return <Instagram className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm" id="channel-previews-container">
      {/* Tab Selectors */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-5">
        <div>
          <h3 className="text-lg font-display font-semibold text-gray-900 tracking-tight flex items-center gap-2">
            <Eye className="w-5 h-5 text-indigo-600" />
            Generated Marketing Assets & Previews
          </h3>
          <p className="text-sm text-gray-400 mt-0.5">Explore high-fidelity visual mockups of your customized content bundle.</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-1 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
          <button
            id="tab-social-btn"
            onClick={() => setActiveTab("social")}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition ${
              activeTab === "social" 
                ? "bg-white text-gray-900 shadow-sm border border-gray-100" 
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Instagram className="w-3.5 h-3.5" />
            Social Bundle
          </button>
          <button
            id="tab-email-btn"
            onClick={() => setActiveTab("email")}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition ${
              activeTab === "email" 
                ? "bg-white text-gray-900 shadow-sm border border-gray-100" 
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            Email Flow
          </button>
          <button
            id="tab-seo-btn"
            onClick={() => setActiveTab("seo")}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition ${
              activeTab === "seo" 
                ? "bg-white text-gray-900 shadow-sm border border-gray-100" 
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            SEO Blog
          </button>
          <button
            id="tab-ads-btn"
            onClick={() => setActiveTab("ads")}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl transition ${
              activeTab === "ads" 
                ? "bg-white text-gray-900 shadow-sm border border-gray-100" 
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            PPC Ads
          </button>
        </div>
      </div>

      {/* RENDER ACTIVE TAB */}

      {/* 1. SOCIAL MEDIA BUNDLE */}
      {activeTab === "social" && campaign.socialMediaBundle?.length > 0 && (
        <div id="social-tab-content" className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
          {/* List of generated socials */}
          <div className="lg:col-span-4 flex flex-col gap-2.5">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block px-1 mb-1">Select Post Creative:</span>
            {campaign.socialMediaBundle.map((post, idx) => (
              <button
                key={idx}
                id={`social-post-selector-btn-${idx}`}
                onClick={() => setActiveSocialIdx(idx)}
                className={`flex items-center justify-between text-left p-3.5 rounded-2xl border transition duration-150 ${
                  activeSocialIdx === idx
                    ? "bg-indigo-50/60 border-indigo-200 ring-1 ring-indigo-200"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2.5 max-w-[85%]">
                  <div className="p-2 bg-gray-50 rounded-lg shrink-0">
                    {getSocialIcon(post.platform)}
                  </div>
                  <div className="truncate">
                    <span className="font-semibold text-xs text-gray-800 block">{post.platform} Post</span>
                    <span className="text-[10px] text-gray-400 block truncate mt-0.5">{post.caption}</span>
                  </div>
                </div>
                <div className="text-[10px] bg-white border border-gray-100 px-1.5 py-0.5 rounded text-gray-400 font-mono font-medium">#{idx + 1}</div>
              </button>
            ))}
          </div>

          {/* High Fidelity Mock Rendering */}
          <div className="lg:col-span-8 bg-gray-50 p-5 rounded-3xl border border-gray-100 flex items-center justify-center">
            {(() => {
              const post = campaign.socialMediaBundle[activeSocialIdx];
              if (!post) return <div className="text-sm text-gray-400">Select a post to preview</div>;

              const isInstagram = post.platform.toLowerCase().includes("instagram");
              const isLinkedin = post.platform.toLowerCase().includes("linkedin");
              const isTwitter = post.platform.toLowerCase().includes("twitter") || post.platform.toLowerCase().includes("x");

              // INSTAGRAM MOCKUP
              if (isInstagram) {
                return (
                  <div className="w-full max-w-[360px] bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-md flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-3.5 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-xs text-indigo-700">M</div>
                        <div>
                          <div className="text-xs font-bold text-gray-800 leading-tight">yourbrand.co</div>
                          <div className="text-[9px] text-gray-400">Sponsored</div>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-800">•••</button>
                    </div>

                    {/* Image / Graphic Concept zone */}
                    <div className="aspect-square bg-slate-900 p-6 flex flex-col justify-between text-white relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-violet-950 opacity-90" />
                      <div className="relative flex items-center gap-1 bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] tracking-widest font-mono text-indigo-200 uppercase self-start border border-white/5">
                        Creative Concept
                      </div>
                      <div className="relative py-4 z-10">
                        <p className="text-sm font-semibold font-display tracking-tight text-indigo-100 leading-relaxed text-center italic">
                          "{post.graphicConcept}"
                        </p>
                      </div>
                      <div className="relative text-[10px] text-indigo-300 font-mono tracking-tight text-center z-10 select-none">
                        [ Visual concept placeholder for graphic creators ]
                      </div>
                    </div>

                    {/* Actions bar */}
                    <div className="p-3 pb-2 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-gray-600">
                        <Heart className="w-5 h-5 cursor-pointer hover:text-rose-500 hover:fill-rose-500 transition-colors" />
                        <MessageSquare className="w-5 h-5 cursor-pointer hover:text-indigo-600" />
                        <Share2 className="w-5 h-5 cursor-pointer hover:text-indigo-600" />
                      </div>
                      <Bookmark className="w-5 h-5 text-gray-600 cursor-pointer" />
                    </div>

                    {/* Caption area */}
                    <div className="px-3.5 pb-4">
                      <div className="text-xs font-bold text-gray-800">4,812 likes</div>
                      <p className="text-xs text-gray-600 mt-1 pb-2 leading-relaxed">
                        <span className="font-bold text-gray-800 mr-1.5">yourbrand.co</span> 
                        {post.caption}
                      </p>
                      {/* Hashtags */}
                      <p className="text-[11px] text-indigo-600 font-medium leading-relaxed">
                        {post.hashtags?.map((t, idx) => `#${t.replace("#", "")} `)}
                      </p>
                    </div>
                  </div>
                );
              }

              // LINKEDIN MOCKUP
              if (isLinkedin) {
                return (
                  <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-4 text-left flex flex-col">
                    {/* Brand header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-sm bg-indigo-600 text-white flex items-center justify-center font-display font-bold text-lg">M</div>
                        <div>
                          <div className="text-xs font-bold text-gray-900 inline-flex items-center gap-1.5">
                            Marketing Growth
                            <span className="text-[9px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-medium">Page</span>
                          </div>
                          <p className="text-[10px] text-gray-400">142,504 followers</p>
                          <p className="text-[9px] text-gray-400 inline-flex items-center gap-1">5h • <Share2 className="w-2.5 h-2.5" /></p>
                        </div>
                      </div>
                      <button className="text-indigo-600 hover:text-indigo-700 text-xs font-bold font-mono tracking-tight">+ Follow</button>
                    </div>

                    {/* Post Copy */}
                    <p className="text-xs text-gray-700 mt-4 leading-relaxed whitespace-pre-wrap">{post.caption}</p>

                    {/* Hashtags */}
                    <p className="text-xs font-medium text-sky-700 mt-2.5">
                      {post.hashtags?.map((t, idx) => `#${t.replace("#", "")} `)}
                    </p>

                    {/* Large display preview */}
                    <div className="mt-3.5 border border-gray-100 rounded-xl overflow-hidden bg-gray-50">
                      <div className="bg-sky-950 p-5 text-sky-100 font-mono text-[10px] italic border-b border-gray-100 min-h-[90px] flex items-center justify-center text-center">
                        <div>
                          <div className="font-semibold text-xs tracking-tight text-white font-sans max-w-[280px] mx-auto not-italic">
                            {post.graphicConcept}
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-white">
                        <div className="text-[10px] text-gray-400 uppercase font-mono tracking-wider">yourbrand.co</div>
                        <div className="text-xs font-semibold text-gray-800 tracking-tight mt-0.5">Learn more about our customized brand solution</div>
                      </div>
                    </div>

                    {/* Engagement bar */}
                    <div className="flex items-center gap-5 mt-4 pt-3.5 border-t border-gray-100 text-gray-500 font-semibold text-[11px]">
                      <span className="cursor-pointer hover:text-gray-900 flex items-center gap-1.5"><Heart className="w-4 h-4 text-gray-400" /> Like</span>
                      <span className="cursor-pointer hover:text-gray-900 flex items-center gap-1.5"><MessageSquare className="w-4 h-4 text-gray-400" /> Comment</span>
                      <span className="cursor-pointer hover:text-gray-900 flex items-center gap-1.5"><Share2 className="w-4 h-4 text-gray-400" /> Share</span>
                    </div>
                  </div>
                );
              }

              // DEFAULT TWITTER/X MOCKUP
              return (
                <div className="w-full bg-white rounded-2xl border border-gray-200 p-4 text-left shadow-sm">
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">𝕏</div>
                    <div className="grow">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-gray-900">Growth Architect</span>
                        <span className="text-[11px] text-gray-400">@growth_arch • 4h</span>
                      </div>
                      <p className="text-xs text-gray-800 mt-1 leading-relaxed whitespace-pre-wrap">{post.caption}</p>

                      <p className="text-xs text-indigo-600 mt-2 font-medium">
                        {post.hashtags?.map((t, idx) => `#${t.replace("#", "")} `)}
                      </p>

                      {/* Static Visual Card description */}
                      <div className="mt-3 bg-slate-900 rounded-xl p-4 border border-gray-800">
                        <span className="text-[9px] font-bold text-indigo-400 font-mono tracking-widest uppercase block mb-1">Visual Directive:</span>
                        <p className="text-[11px] text-indigo-100 leading-relaxed italic">"{post.graphicConcept}"</p>
                      </div>

                      {/* Twitter actions */}
                      <div className="flex items-center justify-between text-gray-400 text-xs mt-3.5 max-w-[280px]">
                        <span className="hover:text-sky-500 cursor-pointer flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> 24</span>
                        <span className="hover:text-emerald-500 cursor-pointer flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5" /> 8</span>
                        <span className="hover:text-red-500 cursor-pointer flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> 89</span>
                        <span className="hover:text-sky-500 cursor-pointer flex items-center gap-1"><Share2 className="w-3.5 h-3.5" /></span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* 2. EMAIL SEQUENCES */}
      {activeTab === "email" && campaign.emailSequence?.length > 0 && (
        <div id="email-tab-content" className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
          {/* List of emails */}
          <div className="lg:col-span-4 flex flex-col gap-2.5">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block px-1 mb-1">Select Campaign Step:</span>
            {campaign.emailSequence.map((email, idx) => (
              <button
                key={idx}
                id={`email-step-selector-btn-${idx}`}
                onClick={() => setActiveEmailIdx(idx)}
                className={`flex items-center justify-between text-left p-3.5 rounded-2xl border transition duration-150 ${
                  activeEmailIdx === idx
                    ? "bg-indigo-50/60 border-indigo-200 ring-1 ring-indigo-200"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2.5 max-w-[85%]">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 text-indigo-600 flex items-center justify-center font-mono text-xs font-bold border border-gray-100 shrink-0">
                    S{idx + 1}
                  </div>
                  <div className="truncate">
                    <span className="font-semibold text-xs text-gray-800 block truncate">{email.type}</span>
                    <span className="text-[10px] text-gray-400 block truncate mt-0.5">{email.subject}</span>
                  </div>
                </div>
                <div className="text-[10px] bg-white border border-gray-100 px-1.5 py-0.5 rounded text-gray-400 font-mono font-medium">STEP {idx + 1}</div>
              </button>
            ))}
          </div>

          {/* High Fidelity Email Mock */}
          <div className="lg:col-span-8 bg-gray-50 p-5 rounded-3xl border border-gray-100">
            {(() => {
              const email = campaign.emailSequence[activeEmailIdx];
              if (!email) return <div className="text-sm text-gray-400">Select an email step to preview</div>;

              const copiedKey = `email-${activeEmailIdx}`;

              return (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden text-left">
                  {/* Mock Browser/Mail Header */}
                  <div className="bg-gray-50/80 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-[10px] font-mono text-gray-400 font-medium">Newsletter Campaign Template</span>
                    <button
                      onClick={() => handleCopyText(`${email.subject}\n\n${email.body}`, copiedKey)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 bg-white border border-gray-200 px-2.5 py-1.5 rounded-xl transition shadow-sm"
                    >
                      {copiedStates[copiedKey] ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-600">Copied Email</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy Draft
                        </>
                      )}
                    </button>
                  </div>

                  {/* Envelope Address Area */}
                  <div className="p-4 border-b border-gray-100 space-y-2 text-xs text-gray-500">
                    <div>
                      <span className="font-semibold text-gray-400 mr-2 uppercase text-[10px] tracking-wider">From:</span> 
                      <span className="text-gray-800 font-medium">growth@yourbrand.co</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-400 mr-2 uppercase text-[10px] tracking-wider">Subject:</span> 
                      <span className="text-gray-900 font-bold">{email.subject}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="font-semibold text-gray-400 mr-2 uppercase text-[10px] tracking-wider shrink-0 mt-0.5">Teaser:</span> 
                      <span className="text-gray-400 leading-relaxed italic">{email.previewText}</span>
                    </div>
                  </div>

                  {/* Email Body Card */}
                  <div className="p-6 md:p-8 overflow-y-auto max-h-[360px] bg-white leading-relaxed">
                    <div className="max-w-[480px] mx-auto space-y-4">
                      {/* Logo header */}
                      <div className="text-center pb-4 border-b border-gray-50">
                        <span className="font-display font-black text-xl text-indigo-600 uppercase tracking-widest">[ COMPANY LOGO ]</span>
                      </div>

                      {/* Message parsing paragraphs */}
                      <div className="text-sm text-gray-700 space-y-4 whitespace-pre-line leading-relaxed">
                        {email.body}
                      </div>

                      {/* Mock Footer button */}
                      <div className="pt-6 pb-2 text-center">
                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-6 py-3 rounded-full transition shadow-md shadow-indigo-600/10">
                          Activate Special Offer Now
                        </button>
                      </div>

                      <div className="text-[10px] text-gray-400 text-center pt-8 border-t border-gray-50 leading-loose">
                        You are receiving this email because you registered on our platform.<br />
                        © {new Date().getFullYear()} Your Brand Inc. 123 Launch Ave, Innovate Tower. <br />
                        <span className="underline cursor-pointer">Unsubscribe</span> from these emails.
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* 3. SEO BLOG BLUEPRINT */}
      {activeTab === "seo" && campaign.blogBlueprint && (
        <div id="seo-tab-content" className="space-y-6 animate-fade-in text-left">
          {/* Mock Google Search Snippet */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 max-w-2xl">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 font-mono">Google SERP Snippet Preview:</span>
            <div className="space-y-1.5">
              <div className="text-xs text-gray-500 truncate flex items-center gap-1.5">
                www.yourbrand.co <CornerDownRight className="w-3 h-3 block" /> blog
              </div>
              <h4 className="text-base font-medium text-blue-800 hover:underline cursor-pointer leading-tight">
                {campaign.blogBlueprint.title}
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                {campaign.blogBlueprint.metaDescription}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Keywords and metadata */}
            <div className="md:col-span-4 space-y-5">
              <div className="bg-white rounded-2xl border border-gray-100 p-4.5 space-y-4">
                {/* Target Keywords */}
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2.5 font-mono">Target SEO Keywords:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {campaign.blogBlueprint.targetKeywords?.map((keyword, index) => (
                      <span
                        key={index}
                        className="text-xs font-mono font-medium px-2.5 py-1.5 bg-gray-50 text-gray-600 border border-gray-100 rounded-lg"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Editorial details */}
                <div className="pt-4 border-t border-gray-50 space-y-2 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>Suggested Wordcount:</span>
                    <span className="font-bold text-gray-800">1,200 - 1,500 words</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Primary Funnel Step:</span>
                    <span className="font-bold text-gray-800">Top of Funnel (Educational)</span>
                  </div>
                </div>
              </div>

              {/* Copy Blueprint Button */}
              <button
                onClick={() => handleCopyText(`Title: ${campaign.blogBlueprint.title}\nMeta: ${campaign.blogBlueprint.metaDescription}\n\nSuggested Headers:\n${campaign.blogBlueprint.suggestedHeaders.join("\n")}`, "seo-blueprint")}
                className="w-full flex items-center justify-center gap-2 text-xs font-semibold py-3 border border-indigo-100 hover:border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 rounded-2xl transition"
              >
                {copiedStates["seo-blueprint"] ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-700">Copied Outline</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Blog Outline Blueprint
                  </>
                )}
              </button>
            </div>

            {/* Writer's Outline */}
            <div className="md:col-span-8 bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-5">
              {/* Writer Brief */}
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 font-mono">Editorial Intent & Writer Brief:</span>
                <p className="text-xs text-gray-700 leading-relaxed bg-white p-4 rounded-xl border border-gray-100">
                  {campaign.blogBlueprint.briefOutline}
                </p>
              </div>

              {/* Headers checklist */}
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2.5 font-mono">Recommended Headers Checklist:</span>
                <div className="space-y-2 bg-white rounded-xl p-4 border border-gray-100">
                  {campaign.blogBlueprint.suggestedHeaders?.map((header, index) => (
                    <div key={index} className="flex items-start gap-2.5 text-xs text-gray-600">
                      <span className="font-mono text-[10px] font-bold text-indigo-600 w-8 shrink-0 mt-0.5 bg-indigo-50 border border-indigo-100 text-center py-0.5 rounded">H{index === 0 ? "1" : "2"}</span>
                      <span className="font-semibold text-gray-800 leading-snug">{header}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. PPC SEARCH ADS */}
      {activeTab === "ads" && campaign.googleAds?.length > 0 && (
        <div id="pcc-tab-content" className="space-y-6 animate-fade-in text-left">
          <div className="bg-gray-50 p-4.5 rounded-2xl border border-gray-100">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2 px-1">Selected Google Search PPC Ads:</span>
            <p className="text-xs text-gray-400 px-1 leading-snug">Review how your compressed headlines and search summaries display dynamically triggers in Google Search engines.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {campaign.googleAds.map((ad, idx) => {
              const copiedKey = `ad-${idx}`;
              return (
                <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-5 relative shadow-sm hover:shadow-md transition">
                  <span className="absolute top-4 right-4 text-[10px] font-mono text-gray-400 font-medium">AD VARIANT #{idx + 1}</span>
                  
                  {/* Headline structure */}
                  <div className="space-y-1 bg-gray-50/50 p-4 rounded-xl border border-gray-100/60 mt-2">
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 uppercase tracking-widest font-mono">
                      <span>Ad</span> • <span>www.yourbrand.co</span>
                    </div>
                    {/* Mock headline */}
                    <h4 className="text-base font-medium text-blue-800 hover:underline cursor-pointer leading-tight">
                      {ad.headline} | Custom Brand Hook
                    </h4>
                    {/* Mock Description */}
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {ad.description} — <span className="font-semibold text-indigo-600">{ad.cta}</span>
                    </p>
                  </div>

                  {/* Metadata and action bar */}
                  <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex gap-2">
                      <span>CTR Target: <strong className="text-emerald-600">3.5 - 5%</strong></span>
                    </div>
                    <button
                      onClick={() => handleCopyText(`Headline: ${ad.headline}\nDescription: ${ad.description}\nCTA: ${ad.cta}`, copiedKey)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 px-2.5 py-1 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      {copiedStates[copiedKey] ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-500">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copy Asset
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
