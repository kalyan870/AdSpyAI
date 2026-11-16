"use client";
import React from "react";

/**
 * SOCIAL PROFILES CONFIGURATION
 * 
 * Supply your live profile URLs below:
 * (Replace empty strings with your exact handles/URLs)
 */
export const SOCIAL_PROFILES = {
  tiktok: "", // e.g. "https://www.tiktok.com/@adspyai"
  linkedin: "", // e.g. "https://www.linkedin.com/company/adspyai"
  instagram: "", // e.g. "https://www.instagram.com/adspyai"
  substack: "", // e.g. "https://adspyai.substack.com"
};

export interface SocialPlatform {
  id: "tiktok" | "linkedin" | "instagram" | "substack";
  name: string;
  url: string;
  isConfigured: boolean;
  colorHover: string;
  badge: string;
  icon: (props: { className?: string }) => React.JSX.Element;
}

export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    id: "tiktok",
    name: "TikTok",
    url: SOCIAL_PROFILES.tiktok,
    isConfigured: Boolean(SOCIAL_PROFILES.tiktok && SOCIAL_PROFILES.tiktok.startsWith("http")),
    colorHover: "hover:border-cyan-400 hover:text-cyan-300 hover:shadow-cyan-500/30",
    badge: "Viral Ad Breakdowns",
    icon: ({ className = "w-5 h-5" }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.46 6.27 6.27 0 0 0 1.88-4.46V8.75a8.28 8.28 0 0 0 4.84 1.54v-3.6z" />
      </svg>
    ),
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    url: SOCIAL_PROFILES.linkedin,
    isConfigured: Boolean(SOCIAL_PROFILES.linkedin && SOCIAL_PROFILES.linkedin.startsWith("http")),
    colorHover: "hover:border-blue-400 hover:text-blue-300 hover:shadow-blue-500/30",
    badge: "Creative Strategy Case Studies",
    icon: ({ className = "w-5 h-5" }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
      </svg>
    ),
  },
  {
    id: "instagram",
    name: "Instagram",
    url: SOCIAL_PROFILES.instagram,
    isConfigured: Boolean(SOCIAL_PROFILES.instagram && SOCIAL_PROFILES.instagram.startsWith("http")),
    colorHover: "hover:border-pink-400 hover:text-pink-300 hover:shadow-pink-500/30",
    badge: "Daily UGC Hook Highlights",
    icon: ({ className = "w-5 h-5" }) => (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    id: "substack",
    name: "Substack",
    url: SOCIAL_PROFILES.substack,
    isConfigured: Boolean(SOCIAL_PROFILES.substack && SOCIAL_PROFILES.substack.startsWith("http")),
    colorHover: "hover:border-amber-400 hover:text-amber-300 hover:shadow-amber-500/30",
    badge: "In-Depth Teardown Newsletter",
    icon: ({ className = "w-5 h-5" }) => (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
      </svg>
    ),
  },
];

interface SocialLinksProps {
  showLabels?: boolean;
  className?: string;
}

export default function SocialLinks({ showLabels = false, className = "" }: SocialLinksProps) {
  return (
    <div
      role="group"
      aria-label="Official Social Media & Editorial Channels"
      className={`flex items-center gap-2.5 flex-wrap ${className}`}
    >
      {SOCIAL_PLATFORMS.map((platform) => {
        const ariaLabel = platform.isConfigured
          ? `Visit AdSpyAI.com on ${platform.name} (${platform.badge})`
          : `${platform.name} (${platform.badge} - URL pending configuration)`;

        if (platform.isConfigured) {
          return (
            <a
              key={platform.id}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={ariaLabel}
              title={`${platform.name} — ${platform.badge}`}
              className={`group relative p-2.5 rounded-xl bg-[#071329] text-slate-300 border border-white/10 ${platform.colorHover} transition-all duration-200 shadow-md hover:scale-105 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050B1A] flex items-center gap-2`}
            >
              <platform.icon className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
              {showLabels && (
                <span className="text-xs font-bold text-white pr-1">
                  {platform.name}
                </span>
              )}
            </a>
          );
        }

        // Clean unconfigured/disabled state with tooltip
        return (
          <div
            key={platform.id}
            title={`${platform.name} — ${platform.badge} (Profile handle pending configuration)`}
            className="group relative"
          >
            <button
              type="button"
              disabled
              aria-label={ariaLabel}
              className="p-2.5 rounded-xl bg-[#071329]/70 text-slate-400 border border-white/10 cursor-not-allowed opacity-80 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <platform.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              {showLabels && (
                <span className="text-xs font-semibold text-slate-300 pr-1">
                  {platform.name}
                </span>
              )}
            </button>
            {/* Subtle hover tooltip explaining configuration status */}
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1 rounded-lg bg-black/95 text-[10px] font-bold text-cyan-300 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity border border-cyan-500/30 shadow-xl z-30">
              {platform.name} · Link coming soon
            </span>
          </div>
        );
      })}
    </div>
  );
}
