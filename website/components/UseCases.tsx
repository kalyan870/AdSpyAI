"use client";
import AdPreviewCard from "@/components/AdPreviewCard";

export default function UseCases() {
  return (
    <section
      id="use-cases"
      aria-labelledby="use-cases-heading"
      className="py-24 relative section-transition"
      style={{ background: "linear-gradient(180deg, #050B1A 0%, #071329 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0B172E] border border-cyan-400/30 shadow-md shadow-blue-500/10 mb-4">
            <span className="text-xs font-black tracking-wider text-cyan-300 uppercase">
              🎯 Practical Production Workflows
            </span>
          </div>
          <h2
            id="use-cases-heading"
            className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4"
          >
            Engineered for <span className="bg-gradient-to-r from-[#00D4FF] to-[#0066FF] bg-clip-text text-transparent">Every High-Volume Team</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Whether you are researching creative directions or planning a home-studio shoot, AdSpy AI offers a structured place to explore sample ad-analysis outputs.
          </p>
        </div>

        {/* WORKFLOW 1: Performance Marketers & Media Buyers */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-14 items-center mb-20">
          {/* Text Side */}
          <div>
            <span className="inline-block text-xs font-black text-cyan-300 uppercase tracking-wider mb-3 bg-blue-900/40 px-3 py-1 rounded-full border border-blue-400/30">
              Media Buyers & Growth Marketers
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-4">
              Cut Creative Research from Hours to Minutes
            </h3>
            <p className="text-slate-200 text-base sm:text-lg leading-relaxed mb-6">
              Stop manually scrubbing through competitor ads and typing fragmented notes. Decode the exact psychological hooks and script tempos driving their spend, then recreate winning angles for your product.
            </p>

            <ul className="space-y-3.5 mb-7" aria-label="Media Buyer Benefits">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-600/30 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border border-blue-400/30">
                  ✓
                </span>
                <span className="text-slate-200 text-sm sm:text-base font-medium">
                  Diagnose pattern interrupts that lower thumb-stop and CPM costs
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-600/30 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border border-blue-400/30">
                  ✓
                </span>
                <span className="text-slate-200 text-sm sm:text-base font-medium">
                  Benchmark competitor cut frequency, caption sync, and CTA frameworks
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-600/30 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border border-blue-400/30">
                  ✓
                </span>
                <span className="text-slate-200 text-sm sm:text-base font-medium">
                  Rapidly brief video editors with structured storyboard notes
                </span>
              </li>
            </ul>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-bold">
              <span>⚡ Benchmark Impact:</span> 4.2X faster creative brief turnaround
            </div>
          </div>

          {/* Visual 1: Multi-Platform Ad Teardown & Real Video Player (LinkedIn, Instagram, Substack) */}
          <div className="relative">
            <AdPreviewCard />
          </div>
        </div>

        {/* WORKFLOW 2: UGC Creators & Video Producers (Reversed Layout) */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-14 items-center mb-20">
          {/* Visual 2: Creator Teleprompter & Storyboard Script Card */}
          <div className="order-2 lg:order-1 relative">
            <div className="w-full max-w-md mx-auto glass-card-blue p-6 rounded-3xl border-2 border-cyan-400/50 shadow-2xl shadow-blue-500/20 bg-[#08162F] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎬</span>
                  <span className="text-xs font-black text-white uppercase tracking-wider">Creator Teleprompter & Cue Card</span>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  Camera-Ready
                </span>
              </div>

              {/* Teleprompter Display Box */}
              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>SCENE 01 · 00:00 - 00:03.2</span>
                  <span className="text-cyan-300 font-bold">142 WPM Pace</span>
                </div>

                <div className="text-sm font-sans text-white font-medium bg-blue-950/40 p-3 rounded-xl border border-blue-400/20 leading-relaxed">
                  &ldquo;I spent \$12,000 testing TikTok hooks last month so you don&apos;t have to burn your creative budget...&rdquo;
                </div>

                <div className="text-xs text-cyan-200 bg-cyan-950/60 p-2.5 rounded-lg border border-cyan-500/30">
                  💡 <strong>Director Stage Cue:</strong> [Lean close into camera lens, rapid head shake, tap phone screen]
                </div>
              </div>

              {/* B-Roll Prompt Synchronizer */}
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1.5">
                <div className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span>🎥</span> Sora 2 B-Roll Prompt Attached
                </div>
                <p className="text-xs text-slate-300 font-mono">
                  A high-contrast macro shot of a creator scrolling through ad metrics on a glowing smartphone. Shallow depth of field.
                </p>
              </div>
            </div>
          </div>

          {/* Text Side */}
          <div className="order-1 lg:order-2">
            <span className="inline-block text-xs font-black text-cyan-300 uppercase tracking-wider mb-3 bg-blue-900/40 px-3 py-1 rounded-full border border-blue-400/30">
              UGC Creators & Video Producers
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-4">
              Never Run Out of High-Retention Script Concepts
            </h3>
            <p className="text-slate-200 text-base sm:text-lg leading-relaxed mb-6">
              Explore a sample workflow that organizes a public ad URL into a hook summary, time-coded script outline, and creator-facing rewrite. Demo output is illustrative and does not report measured campaign performance.
            </p>

            <ul className="space-y-3.5 mb-7" aria-label="Creator Benefits">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-600/30 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border border-blue-400/30">
                  ✓
                </span>
                <span className="text-slate-200 text-sm sm:text-base font-medium">
                  Timestamped delivery notes for natural cadence and vocal emphasis
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-600/30 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border border-blue-400/30">
                  ✓
                </span>
                <span className="text-slate-200 text-sm sm:text-base font-medium">
                  Curiosity gap frameworks mathematically modeled to stop the scroll
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-600/30 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border border-blue-400/30">
                  ✓
                </span>
                <span className="text-slate-200 text-sm sm:text-base font-medium">
                  5 cinematic Sora 2 prompts for automated AI b-roll generation
                </span>
              </li>
            </ul>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-bold">
              <span>⚡ Output:</span> Hook, script structure, and creative prompts
            </div>
          </div>
        </div>

        {/* WORKFLOW 3: Agencies & Growth Teams */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-14 items-center">
          {/* Text Side */}
          <div>
            <span className="inline-block text-xs font-black text-cyan-300 uppercase tracking-wider mb-3 bg-blue-900/40 px-3 py-1 rounded-full border border-blue-400/30">
              Agencies & Creative Strategists
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-4">
              Deliver Data-Backed Creative Direction to Clients
            </h3>
            <p className="text-slate-200 text-base sm:text-lg leading-relaxed mb-6">
              Equip your creative strategists with instant competitor teardowns. Produce polished creative audits and script variants in client meetings without tedious manual research.
            </p>

            <ul className="space-y-3.5 mb-7" aria-label="Agency Benefits">
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-600/30 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border border-blue-400/30">
                  ✓
                </span>
                <span className="text-slate-200 text-sm sm:text-base font-medium">
                  Exportable client-ready teardown reports in structured JSON & text
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-600/30 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border border-blue-400/30">
                  ✓
                </span>
                <span className="text-slate-200 text-sm sm:text-base font-medium">
                  Multi-angle hook variants ready for rapid split-testing in Meta Ads Manager
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-blue-600/30 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border border-blue-400/30">
                  ✓
                </span>
                <span className="text-slate-200 text-sm sm:text-base font-medium">
                  Standardized creative production pipeline for high-spend accounts
                </span>
              </li>
            </ul>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs sm:text-sm font-bold">
              <span>⚡ Sample output:</span> Creative angles and script drafts
            </div>
          </div>

          {/* Visual 3: Multi-Variant Split-Testing Matrix */}
          <div className="relative">
            <div className="w-full max-w-md mx-auto glass-card-blue p-6 rounded-3xl border-2 border-cyan-400/50 shadow-2xl shadow-blue-500/20 bg-[#08162F] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-black text-white uppercase tracking-wider">
                  Client Creative Matrix (A/B Variations)
                </span>
                <span className="text-[11px] font-bold text-cyan-300 bg-blue-900/60 px-2.5 py-0.5 rounded-full border border-blue-400/40">
                  3 Variants Ready
                </span>
              </div>

              {/* 3 Variant Cards */}
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-black/50 border border-emerald-500/40 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-400">Angle A: Contrarian Shock</span>
                    <span className="font-mono text-white font-bold">Illustrative demo result</span>
                  </div>
                  <p className="text-xs text-slate-300 italic">
                    &ldquo;Stop scrolling if you&apos;re still trying to scale ads without testing this...&rdquo;
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-cyan-300">Angle B: High Proof & Value</span>
                    <span className="font-mono text-white font-bold">Illustrative demo result</span>
                  </div>
                  <p className="text-xs text-slate-300 italic">
                    &ldquo;I spent \$45,000 testing TikTok hooks last month so you don&apos;t have to...&rdquo;
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-300">Angle C: Relatable Confession</span>
                    <span className="font-mono text-white font-bold">Illustrative demo result</span>
                  </div>
                  <p className="text-xs text-slate-300 italic">
                    &ldquo;Everyone said UGC was dead in 2026. Here is why the top 1% are laughing...&rdquo;
                  </p>
                </div>
              </div>

              {/* Client Export Action Bar */}
              <div className="pt-2 flex items-center justify-between text-xs font-bold text-slate-300 border-t border-white/10">
                <span>Format: PDF / JSON Brief</span>
                <span className="text-cyan-400 flex items-center gap-1">
                  <span>📥</span> Ready to Export
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
