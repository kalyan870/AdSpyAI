"use client";

const productCapabilities = [
  { value: "URL", label: "Ad link input", detail: "Instagram, TikTok, or Shorts" },
  { value: "Hook", label: "Opening analysis", detail: "Score and framing" },
  { value: "Script", label: "Beat breakdown", detail: "Hook, problem, solution, CTA" },
  { value: "Web + App", label: "Two interfaces", detail: "Next.js and Expo companion" },
];

export default function Stats() {
  return (
    <section
      aria-label="Product capabilities"
      className="py-16 relative section-transition"
      style={{ background: "#050B1A" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">
            Product Capabilities
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {productCapabilities.map((stat) => (
            <div
              key={stat.label}
              className="glass-card p-6 text-center border border-white/10 hover:border-cyan-500/30 transition-colors"
            >
              <div className="text-3xl sm:text-4xl font-black gradient-text mb-1 tracking-tight">
                {stat.value}
              </div>
              <div className="text-white font-bold text-sm sm:text-base mb-1">
                {stat.label}
              </div>
              <div className="text-slate-400 text-xs">
                {stat.detail}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6 max-w-xl mx-auto">
          Analysis content is illustrative in demo mode; connect a model provider for live generated results.
        </p>
      </div>
    </section>
  );
}
