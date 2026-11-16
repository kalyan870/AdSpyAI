"use client";

const steps = [
  {
    step: 1,
    title: "Input Viral Ad Link",
    desc: "Paste any Instagram Reel, TikTok, or YouTube Shorts URL",
    icon: (
      <svg className="w-8 h-8 text-[#0066FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
  {
    step: 2,
    title: "Analyze Hook Script Format",
    desc: "AI dissects the thumb-stopping opener and timing blocks",
    icon: (
      <svg className="w-8 h-8 text-[#0066FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <circle cx="11" cy="14" r="3" />
        <line x1="13.5" y1="16.5" x2="16" y2="19" />
      </svg>
    ),
  },
  {
    step: 3,
    title: "Get Insights",
    desc: "Extracts psychological triggers, pacing, and audience angles",
    icon: (
      <svg className="w-8 h-8 text-[#0066FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6" />
        <path d="M10 22h4" />
        <path d="M12 2v1" />
        <path d="M12 7a5 5 0 0 1 5 5c0 2-1 3.5-2 4.5H9c-1-1-2-2.5-2-4.5a5 5 0 0 1 5-5z" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="19.78" y1="4.22" x2="18.36" y2="5.64" />
      </svg>
    ),
  },
  {
    step: 4,
    title: "Generate 5 Sora 2 Prompts",
    desc: "Creates structured, cinematography-grade Sora prompts",
    icon: (
      <svg className="w-8 h-8 text-[#0066FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        <path d="M19 12l2 2-2 2" />
      </svg>
    ),
  },
  {
    step: 5,
    title: "Create UGC Ready to Use",
    desc: "Outputs camera-ready script rebuilt with your brand messaging",
    icon: (
      <svg className="w-8 h-8 text-[#0066FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        <polygon points="10 11 15 14 10 17 10 11" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="steps-heading"
      className="py-20 relative bg-[#F8FAFC] text-[#0B132B] border-y border-slate-200"
    >
      {/* Blueprint Grid Texture (matches reference image clean lower panel) */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#0066ff 1px, transparent 1px), linear-gradient(90deg, #0066ff 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Banner with burst lines matching reference: = STEPS: = */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-3">
            <span className="text-[#0066FF] font-black text-2xl tracking-tighter select-none">
              \\//
            </span>
            <div className="bg-[#0066FF] text-white px-6 py-2 rounded-xl shadow-lg shadow-blue-500/30">
              <span id="steps-heading" className="text-base sm:text-lg font-black tracking-widest uppercase">
                STEPS:
              </span>
            </div>
            <span className="text-[#0066FF] font-black text-2xl tracking-tighter select-none">
              //\\
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0B132B] mt-4 tracking-tight">
            A Five-Step Ad Review Walkthrough
          </h2>
          <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto mt-2">
            A guided walkthrough of the prototype's sample analysis flow.
          </p>
        </div>

        {/* 5 Connected Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {steps.map((item, index) => (
            <div key={item.step} className="flex flex-col items-center relative">
              {/* Card Container */}
              <div className="w-full h-full bg-white rounded-2xl p-6 border-2 border-slate-200/90 shadow-md hover:shadow-xl hover:border-[#0066FF] transition-all flex flex-col items-center text-center">
                {/* Blue Number Circle */}
                <div className="w-9 h-9 rounded-full bg-[#0066FF] text-white font-black text-sm flex items-center justify-center mb-4 shadow-md shadow-blue-500/20">
                  {item.step}
                </div>

                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 border border-blue-100">
                  {item.icon}
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-[#0B132B] mb-2 leading-snug">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Connecting Blue Arrow (Desktop horizontal, Mobile vertical) */}
              {index < steps.length - 1 && (
                <>
                  <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-[#0066FF] font-black text-xl">
                    ➔
                  </div>
                  <div className="flex md:hidden text-[#0066FF] font-black text-lg my-1">
                    ↓
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Card: Checklist Bar matching reference */}
        <div className="mt-12 bg-[#0B172E] text-white p-6 sm:p-8 rounded-3xl border border-cyan-400/30 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-2xl shadow-lg">
              📋
            </div>
            <div>
              <span className="text-xs font-black tracking-widest uppercase text-cyan-300 block mb-1">
                CHECKLIST:
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm sm:text-base font-bold text-white">
                <span className="flex items-center gap-2">
                  <span className="text-cyan-400 font-black">✓</span> Rebuild with brand messaging
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-cyan-400 font-black">✓</span> Output UGC ads ready
                </span>
              </div>
            </div>
          </div>

          <a
            href="#preview"
            className="glow-button px-6 py-3 rounded-xl text-sm font-black text-white shrink-0"
          >
            Run Blueprint Now →
          </a>
        </div>
      </div>
    </section>
  );
}
