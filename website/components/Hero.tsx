"use client";
import { motion } from "framer-motion";

function Hero3DComposition() {
  return (
    <div className="relative w-full max-w-xl mx-auto" aria-hidden="true">
      {/* Dimensional Ambient Backlight */}
      <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/30 via-cyan-500/20 to-blue-500/10 rounded-[2.5rem] blur-2xl opacity-75 -z-10" />

      {/* 3D Main Scene Container */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-cyan-400/60 shadow-[0_25px_80px_rgba(0,102,255,0.45)] bg-[#071329]">
        {/* Rendered 3D Scene */}
        <div className="relative aspect-[16/9] w-full">
          <img
            src="/images/hero-3d-reference.jpg"
            alt="AI UGC Ads Spy 3D Creator Teardown Scene"
            className="w-full h-full object-cover object-center transform hover:scale-[1.02] transition-transform duration-700"
          />
          {/* Subtle glossy gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050B1A]/85 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* In-Scene Live Telemetry Bar */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-[#050B1A]/95 backdrop-blur-md border border-cyan-500/40 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00b4ff]" />
            <span className="text-xs font-black text-white uppercase tracking-wider">
              Sample UI Preview
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold">
            <span className="bg-blue-600/50 text-cyan-300 px-2 py-0.5 rounded border border-blue-400/40">
              Hook 94
            </span>
            <span className="bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/40">
              5 Sora Prompts
            </span>
          </div>
        </div>
      </div>

      {/* Floating 3D Badge: Hook Score */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-3 sm:-top-5 left-1 sm:-left-6 p-3 sm:p-4 rounded-2xl glass-card-blue border-2 border-cyan-400/70 shadow-2xl shadow-cyan-500/30 z-20 backdrop-blur-xl"
      >
        <div className="text-[10px] sm:text-[11px] font-extrabold text-cyan-300 uppercase tracking-wider">
          Retention Diagnostic
        </div>
        <div className="text-xl sm:text-2xl font-black text-white mt-0.5 flex items-baseline gap-1">
          94<span className="text-[10px] sm:text-xs text-slate-300 font-semibold">/100</span>
        </div>
        <div className="text-[11px] sm:text-xs text-emerald-400 font-extrabold mt-0.5 flex items-center gap-1">
          <span>●</span> Sample analysis preview
        </div>
      </motion.div>

      {/* Floating 3D Badge: UGC Script Ready */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute -bottom-3 sm:-bottom-5 right-1 sm:-right-6 p-3 sm:p-4 rounded-2xl glass-card-blue border-2 border-cyan-400/70 shadow-2xl shadow-blue-600/30 z-20 backdrop-blur-xl"
      >
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 border border-cyan-300 flex items-center justify-center text-white text-base sm:text-lg shadow-md shadow-blue-500/40">
            🎬
          </div>
          <div>
            <div className="text-xs sm:text-sm font-black text-white">Output Ready</div>
            <div className="text-[10px] sm:text-xs text-cyan-300 font-bold">5 Sora 2 Prompts + Script</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function Hero() {
  const scrollToAnalyzer = (e: React.MouseEvent) => {
    e.preventDefault();
    const elem = document.getElementById("preview");
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth" });
      const input = document.getElementById("ad-url-input");
      if (input) {
        setTimeout(() => input.focus(), 600);
      }
    }
  };

  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative min-h-[90vh] flex items-center pt-24 pb-16 overflow-hidden"
      style={{
        background: "radial-gradient(ellipse 90% 65% at 50% 0%, #0d2757 0%, #08162f 55%, #050b1a 100%)",
      }}
    >
      {/* Creative Studio Blueprint Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#00b4ff 1px, transparent 1px), linear-gradient(90deg, #00b4ff 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Atmospheric Soft Light Orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16 grid lg:grid-cols-2 gap-12 lg:gap-14 items-center">
        {/* Left Column: Bold Marketing Teardown Typography */}
        <div className="text-center lg:text-left z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#0B172E] border-2 border-cyan-400/40 shadow-lg shadow-cyan-500/20 mb-6">
            <span className="bg-yellow-400 text-black text-xs font-black px-2 py-0.5 rounded shadow-sm">
              AI
            </span>
            <span className="text-xs sm:text-sm font-black tracking-wider uppercase text-cyan-300">
              UGC ADS SPY GENERATOR
            </span>
            <span className="text-base" aria-hidden="true">🕵️‍♂️</span>
          </div>

          {/* Headline Matching Reference Composition */}
          <h1
            id="hero-heading"
            className="text-3xl sm:text-5xl lg:text-[4.25rem] font-black leading-[1.08] tracking-tight mb-6 text-white"
          >
            Explore ad<br />
            <span
              className="bg-gradient-to-r from-[#00D4FF] via-[#0088FF] to-[#00D4FF] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,180,255,0.6)]"
              style={{
                textShadow: "0 0 25px rgba(0,180,255,0.4)",
              }}
            >
              creative ideas
            </span>{" "}
            <span className="bg-gradient-to-r from-white via-cyan-200 to-[#00D4FF] bg-clip-text text-transparent">
              with AI.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-200 text-sm sm:text-base lg:text-lg font-normal leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
            Explore a structured sample ad breakdown with a hook summary, timed script outline, creative prompts, and a UGC-style rewrite. Demo outputs are illustrative; model-generated results require configured provider credentials.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
            <a
              href="#preview"
              onClick={scrollToAnalyzer}
              className="glow-button px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl font-black text-white text-base sm:text-lg inline-flex items-center justify-center gap-2.5 shadow-xl shadow-blue-600/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 min-h-[48px] cursor-pointer"
            >
              Try a Sample Analysis →
            </a>
            <a
              href="#how-it-works"
              className="px-6 py-3.5 sm:py-4 rounded-xl font-bold text-slate-200 border-2 border-white/20 hover:border-cyan-400/60 hover:bg-white/5 transition-all inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 text-base min-h-[48px] cursor-pointer"
            >
              View 5-Step Pipeline ↓
            </a>
          </div>

          {/* Checklist Highlights */}
          <div className="p-4 rounded-2xl glass-card border border-cyan-500/30 max-w-md mx-auto lg:mx-0 shadow-lg shadow-black/40">
            <div className="flex items-center gap-2 mb-2 text-xs font-black tracking-wider text-cyan-300 uppercase">
              <span aria-hidden="true">📋</span> CHECKLIST INCLUDED:
            </div>
            <div className="space-y-1.5 text-xs sm:text-sm font-semibold text-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-cyan-500/30 text-cyan-300 flex items-center justify-center text-xs font-bold border border-cyan-400/50">
                  ✓
                </span>
                <span>Rebuild with brand messaging</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-cyan-500/30 text-cyan-300 flex items-center justify-center text-xs font-bold border border-cyan-400/50">
                  ✓
                </span>
                <span>Output UGC ads ready to film</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Scene Asset */}
        <div className="z-10">
          <Hero3DComposition />
        </div>
      </div>
    </section>
  );
}
