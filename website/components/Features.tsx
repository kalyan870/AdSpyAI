"use client";
import { motion } from "framer-motion";

export default function Features() {
  return (
    <section
      id="features"
      aria-labelledby="features-heading"
      className="py-24 relative section-transition"
      style={{ background: "#050B1A" }}
    >
      {/* Background Soft Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-blue-600/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B172E] border border-cyan-400/30 shadow-md shadow-blue-500/10 mb-4">
            <span className="text-xs font-black tracking-wider text-cyan-300 uppercase">
              ✦ Creative Intelligence Suite
            </span>
          </div>
          <h2
            id="features-heading"
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4"
          >
            A Guided Look at Short-Form Ad Structure
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Explore a structured prototype for ad-hook review, script outlines, creative prompts, and UGC-style rewrites. Video frames and audio are not analyzed.
          </p>
        </div>

        {/* Editorial Bento Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* FEATURE 1: WIDE FEATURE CARD - AD LINK ANALYZER */}
          <div className="md:col-span-2 glass-card p-7 sm:p-9 rounded-3xl border border-white/10 hover:border-cyan-400/40 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-300 bg-blue-900/40 px-3 py-1 rounded-full border border-blue-400/30">
                  Input Engine · Multi-Platform
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  Structured Sample Output
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
                  Public Ad URL Context
              </h3>
              <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-2xl mb-6">
                  Enter a public link from a supported platform as text context. This prototype validates the URL but does not fetch video, audio, frames, or captions.
              </p>
            </div>

            {/* Micro-Illustration: Platform Chips & Interactive Input Simulator */}
            <div className="rounded-2xl bg-black/50 p-4 sm:p-5 border border-white/10 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-pink-500/15 border border-pink-500/30 text-pink-300">
                  <span>📸</span> Instagram Reels
                </span>
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                  <span>🎵</span> TikTok Ad Library
                </span>
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-500/15 border border-red-500/30 text-red-300">
                  <span>▶️</span> YouTube Shorts
                </span>
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300">
                  <span>♾️</span> Meta Ad Library
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-xs sm:text-sm font-mono text-slate-300">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-cyan-400 font-bold">GET</span>
                  <span className="truncate text-slate-200">https://instagram.com/reel/C8_viral_ad_teardown</span>
                </div>
                <span className="shrink-0 text-emerald-400 font-bold text-xs bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-400/30">
                  Sample URL · not fetched
                </span>
              </div>
            </div>
          </div>

          {/* FEATURE 2: HOOK DECODER */}
          <div className="glass-card p-7 rounded-3xl border border-white/10 hover:border-cyan-400/40 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-300 bg-blue-900/40 px-3 py-1 rounded-full border border-blue-400/30 mb-4 inline-block">
                Cognitive Psychology
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
                0-3s Hook Decoder
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                Shows an illustrative 0-100 hook score, sample hook labels, and a possible emotional framing.
              </p>
            </div>

            {/* Micro-Illustration: Hook Retention Gauge & Trigger */}
            <div className="rounded-2xl bg-black/50 p-4 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Sample hook score</span>
                <span className="text-sm font-black text-cyan-300">94 / 100</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 h-full w-[94%]" />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
                <span>Pattern Interrupt</span>
                <span className="text-emerald-400 font-bold">Contrarian Shock</span>
              </div>
            </div>
          </div>

          {/* FEATURE 3: SCRIPT ARCHITECTURE */}
          <div className="glass-card p-7 rounded-3xl border border-white/10 hover:border-cyan-400/40 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-300 bg-blue-900/40 px-3 py-1 rounded-full border border-blue-400/30 mb-4 inline-block">
                Narrative Anatomy
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
                Script Architecture
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                Deconstructs the narrative into timed structural blocks with director pacing cues and cut velocity ratios.
              </p>
            </div>

            {/* Micro-Illustration: Timeline Block Segments */}
            <div className="rounded-2xl bg-black/50 p-4 border border-white/10 space-y-2.5">
              <div className="grid grid-cols-4 gap-1 text-[10px] font-bold text-center">
                <span className="p-1 rounded bg-blue-600/40 text-cyan-300 border border-blue-400/30">HOOK (0-3s)</span>
                <span className="p-1 rounded bg-purple-600/30 text-purple-200 border border-purple-400/30">PAIN (3-10s)</span>
                <span className="p-1 rounded bg-indigo-600/30 text-indigo-200 border border-indigo-400/30">PROOF (10-22s)</span>
                <span className="p-1 rounded bg-emerald-600/30 text-emerald-200 border border-emerald-400/30">CTA (22-30s)</span>
              </div>
              <div className="text-xs text-slate-300 flex items-center justify-between pt-1">
                <span>Example script sections</span>
                <span className="text-cyan-400 font-mono font-bold">Illustrative timing</span>
              </div>
            </div>
          </div>

          {/* FEATURE 4: AUDIENCE DEMOGRAPHIC INTELLIGENCE */}
          <div className="glass-card p-7 rounded-3xl border border-white/10 hover:border-cyan-400/40 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-300 bg-blue-900/40 px-3 py-1 rounded-full border border-blue-400/30 mb-4 inline-block">
                Buyer Intelligence
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
                Audience Persona Profiling
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                Reveals the target demographic angle, underlying pain trigger, and psychological buying motivation behind the creative.
              </p>
            </div>

            {/* Micro-Illustration: Persona Card */}
            <div className="rounded-2xl bg-black/50 p-4 border border-white/10 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs font-bold border border-cyan-400/30">
                  🎯
                </span>
                <div className="text-xs font-bold text-white">Target Persona Detected</div>
              </div>
              <div className="text-xs text-slate-300 bg-white/5 p-2 rounded-lg font-mono">
                SaaS Founders / Growth Marketers (24-42)
              </div>
              <div className="flex flex-wrap gap-1.5 text-[10px] font-semibold">
                <span className="bg-blue-500/20 text-cyan-300 px-2 py-0.5 rounded">High Intent</span>
                <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">CAC Sensitive</span>
              </div>
            </div>
          </div>

          {/* FEATURE 5: WIDE FEATURE CARD - SORA 2 VIDEO PROMPT GENERATOR */}
          <div className="md:col-span-2 glass-card p-7 sm:p-9 rounded-3xl border border-cyan-500/40 bg-gradient-to-br from-blue-950/30 to-[#071329] hover:border-cyan-400/60 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-300 bg-gradient-to-r from-blue-600 to-cyan-500 px-3.5 py-1 rounded-full text-white shadow-md shadow-blue-500/30">
                  ✦ Generative AI Cinematography
                </span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Sora 2 Pipeline Ready
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
                5 Structured Sora 2 Video Prompts
              </h3>
              <p className="text-slate-200 text-base sm:text-lg leading-relaxed max-w-2xl mb-6">
                Automatically extracts lighting ratios, camera angles, focal lengths, and scene motions, synthesizing 5 cinematographic prompts ready to generate hyper-realistic b-roll and actor clips.
              </p>
            </div>

            {/* Micro-Illustration: Cinematic Camera Parameters & Prompt Preview */}
            <div className="rounded-2xl bg-black/60 p-4 sm:p-5 border border-cyan-500/30 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded bg-white/10 text-cyan-300 border border-white/10">
                  🎥 35mm Anamorphic
                </span>
                <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded bg-white/10 text-cyan-300 border border-white/10">
                  ☀️ Golden Hour Rim Light
                </span>
                <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded bg-white/10 text-cyan-300 border border-white/10">
                  📐 Slow Dolly Push-In
                </span>
                <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  4K 60fps Hyper-realistic
                </span>
              </div>

              <div className="p-3 rounded-xl bg-black/80 border border-white/10 text-xs sm:text-sm font-mono text-slate-200 leading-relaxed">
                <span className="text-cyan-400 font-bold">[SCENE 1 PROMPT]:</span> A tech creator sitting at a modern desk reacts in disbelief to a glowing laptop screen. Cinematic depth of field, shallow focus, natural desk lamp flare.
              </div>
            </div>
          </div>

          {/* FEATURE 6: CAMERA-READY UGC SCRIPT */}
          <div className="glass-card p-7 rounded-3xl border border-white/10 hover:border-cyan-400/40 transition-all duration-300 flex flex-col justify-between group md:col-span-2 lg:col-span-1">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-300 bg-blue-900/40 px-3 py-1 rounded-full border border-blue-400/30 mb-4 inline-block">
                Production Output
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
                Camera-Ready UGC Script
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                Outputs an adapted, brand-aligned UGC script formatted for human creators or avatar engines, complete with verbal cues and gestures.
              </p>
            </div>

            {/* Micro-Illustration: Script Teleprompter Card */}
            <div className="rounded-2xl bg-black/50 p-4 border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5 font-bold text-white">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Teleprompter Cue
                </span>
                <span className="font-mono text-cyan-300 font-bold">142 Words · 28s</span>
              </div>
              <p className="text-xs text-slate-200 font-sans italic bg-white/5 p-2.5 rounded-lg border border-white/5 leading-relaxed">
                &ldquo;[Hold product directly to lens] Stop wasting thousands on ads that nobody watches past 2 seconds...&rdquo;
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
