"use client";
import { useState } from "react";
import SocialLinks from "@/components/SocialLinks";

export default function Footer() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const legalContent: Record<string, { title: string; content: string }> = {
    privacy: {
      title: "Privacy Policy",
      content:
        "AdSpyAI.com respects your privacy. We do not store, distribute, or sell user-submitted ad URLs. URLs submitted to the analyzer are parsed exclusively in-memory for the duration of the analysis request. No video files or personal media are retained on our servers without explicit user consent.",
    },
    terms: {
      title: "Terms of Service",
      content:
        "By utilizing AdSpyAI.com, you agree that you are analyzing publicly accessible video marketing links for competitive research, educational, and creative strategy purposes. Users are responsible for ensuring that their downstream content creation adheres to all platform guidelines and copyright standards.",
    },
    apidocs: {
      title: "API Documentation",
      content:
        "AdSpyAI.com provides a RESTful endpoint at /api/analyze accepting JSON payloads with { url: string }. Authentication is passed via Bearer tokens or standard session headers. Rate limits in Open Beta are set to 60 requests per minute per IP.",
    },
  };

  const scrollToPreview = (e: React.MouseEvent) => {
    e.preventDefault();
    const elem = document.getElementById("preview");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
      const input = document.getElementById("ad-url-input");
      if (input) setTimeout(() => input.focus(), 600);
    }
  };

  return (
    <>
      {/* Conversion Final CTA Section with Dimensional 3D Blue Visual Accent */}
      <section
        aria-label="Final Call to Action"
        className="py-24 relative overflow-hidden section-transition"
        style={{ background: "radial-gradient(ellipse 90% 70% at 50% 30%, #0c2759 0%, #071329 55%, #050B1A 100%)" }}
      >
        <div className="absolute inset-0 section-glow pointer-events-none" />

        {/* Studio Blueprint Subtle Background Texture */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#00b4ff 1px, transparent 1px), linear-gradient(90deg, #00b4ff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          {/* Dimensional 3D Cube & Clapperboard Visual Icon Badge */}
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 via-[#0066FF] to-cyan-400 p-1 mx-auto mb-6 shadow-2xl shadow-blue-500/40 transform hover:rotate-3 transition-transform">
            <div className="w-full h-full bg-[#071329] rounded-[22px] flex items-center justify-center text-3xl border border-cyan-300/40 shadow-inner">
              🎲
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B172E] border border-cyan-400/40 shadow-lg shadow-blue-500/20 mb-6">
            <span className="text-xs font-black tracking-wider text-cyan-300 uppercase">
              🚀 Elevate Your Creative Velocity
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-[1.08] tracking-tight">
            Stop Guessing. <br />
            <span className="bg-gradient-to-r from-[#00D4FF] via-[#0088FF] to-[#00D4FF] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(0,180,255,0.5)]">
              Start Scaling Viral Ads
            </span>{" "}
            <span className="text-white">10X Faster.</span>
          </h2>

          <p className="text-slate-200 text-base sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
            Explore the analysis workflow, inspect sample output, and adapt the project for a model-backed ad research tool.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={scrollToPreview}
              className="glow-button px-10 py-4 rounded-xl font-black text-white text-base sm:text-lg inline-flex items-center justify-center gap-2.5 shadow-2xl shadow-blue-600/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              Analyze Your First Ad Free →
            </button>
          </div>

          <p className="text-slate-400 text-xs sm:text-sm mt-4 font-semibold">
            Instant online analysis · No credit card required · Open Beta Pass Available
          </p>
        </div>
      </section>

      {/* Main Footer */}
      <footer role="contentinfo" className="border-t border-white/10 py-16" style={{ background: "#050B1A" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-xl flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <span className="text-2xl font-bold text-white">
                  AdSpyAI<span className="text-cyan-400">.com</span>
                </span>
              </div>
              <p className="text-slate-200 text-base leading-relaxed mb-4 max-w-sm">
                Next-generation ad reverse-engineering platform. Dissect hooks, decode pacing, and generate high-conversion UGC scripts with Sora 2 prompts.
              </p>
              <div className="text-sm text-slate-300 font-medium">
                Engineered for Creators, Media Buyers & Growth Agencies.
              </div>

              {/* Social Channels Row: TikTok, LinkedIn, Instagram, Substack */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <span className="text-xs font-black uppercase tracking-wider text-cyan-300 block mb-2.5">
                  Follow & Read Teardowns
                </span>
                <SocialLinks showLabels />
              </div>
            </div>

            {/* Navigation Column */}
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider mb-4">Product</h3>
              <ul className="space-y-3 text-base">
                <li>
                  <a href="#features" className="text-slate-200 hover:text-cyan-300 font-medium transition-colors py-0.5 inline-block">
                    Capabilities
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-slate-200 hover:text-cyan-300 font-medium transition-colors py-0.5 inline-block">
                    5-Step Pipeline
                  </a>
                </li>
                <li>
                  <a href="#preview" className="text-slate-200 hover:text-cyan-300 font-medium transition-colors py-0.5 inline-block">
                    Live Analyzer
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-slate-200 hover:text-cyan-300 font-medium transition-colors py-0.5 inline-block">
                    Pricing Plans
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider mb-4">Resources</h3>
              <ul className="space-y-3 text-base">
                <li>
                  <button
                    onClick={() => setActiveModal("apidocs")}
                    className="text-slate-200 hover:text-cyan-300 font-medium transition-colors text-left py-0.5 inline-block"
                  >
                    REST API Spec
                  </button>
                </li>
                <li>
                  <a href="#use-cases" className="text-slate-200 hover:text-cyan-300 font-medium transition-colors py-0.5 inline-block">
                    Creator Playbook
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-slate-200 hover:text-cyan-300 font-medium transition-colors py-0.5 inline-block">
                    Sora 2 Integration
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider mb-4">Legal & Trust</h3>
              <ul className="space-y-3 text-base">
                <li>
                  <button
                    onClick={() => setActiveModal("privacy")}
                    className="text-slate-200 hover:text-cyan-300 font-medium transition-colors text-left py-0.5 inline-block"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal("terms")}
                    className="text-slate-200 hover:text-cyan-300 font-medium transition-colors text-left py-0.5 inline-block"
                  >
                    Terms of Service
                  </button>
                </li>
                <li className="text-slate-300 text-sm font-medium pt-1">
                  Security: SSRF Protected
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-300 font-medium">
            <p>© 2026 AdSpyAI.com Platform. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mr-1 hidden sm:inline">Connect:</span>
              <SocialLinks />
            </div>
            <p className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
              All Systems Operational · Open Beta Release
            </p>
          </div>
        </div>
      </footer>

      {/* Legal & Info Dialog Modal */}
      {activeModal && legalContent[activeModal] && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="glass-card-blue p-6 sm:p-8 rounded-2xl max-w-lg w-full border border-cyan-400/40 shadow-2xl relative">
            <button
              onClick={() => setActiveModal(null)}
              type="button"
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2"
              aria-label="Close dialog"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-white mb-3">
              {legalContent[activeModal].title}
            </h3>
            <p className="text-slate-200 text-sm leading-relaxed mb-6 whitespace-pre-line">
              {legalContent[activeModal].content}
            </p>
            <button
              onClick={() => setActiveModal(null)}
              type="button"
              className="glow-button px-5 py-2 rounded-xl text-sm font-bold text-white"
            >
              Close Window
            </button>
          </div>
        </div>
      )}
    </>
  );
}
