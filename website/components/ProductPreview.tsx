"use client";
import { useState, useRef } from "react";
import { AnalysisResult } from "@/types";

type ResultTab = "hook" | "script" | "sora" | "ugc";

interface AlternativeHook {
  hook: string;
  type: string;
  retentionScore: number;
}

interface AlternativeScript {
  title: string;
  pacing: string;
  outline: string;
}

function HookScoreMeter({ score }: { score: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let scoreTier = "Good";
  let tierColor = "text-yellow-400";
  if (score >= 90) {
    scoreTier = "High sample score";
    tierColor = "text-emerald-400";
  } else if (score >= 80) {
    scoreTier = "Strong sample score";
    tierColor = "text-cyan-400";
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6 p-6 glass-card border border-cyan-500/30">
      <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 100 100" className="w-28 h-28 -rotate-90">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="9"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="url(#meterGrad)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="meterGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0066ff" />
              <stop offset="100%" stopColor="#00d4ff" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-white leading-none">{score}</span>
          <span className="text-xs text-slate-300 font-semibold mt-0.5">/ 100</span>
        </div>
      </div>

      <div className="text-center sm:text-left">
        <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-1">
          Hook Score · Generated Heuristic
        </div>
        <div className={`text-base sm:text-lg font-bold ${tierColor} mb-1.5`}>
          {scoreTier}
        </div>
        <p className="text-slate-300 text-sm leading-relaxed max-w-md">
          The score and labels are generated examples or model estimates; they are not measured audience-retention data.
        </p>
      </div>
    </div>
  );
}

function CopyBtn({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <button
      onClick={handleCopy}
      type="button"
      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
        copied
          ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
          : "glass-card text-cyan-300 hover:text-white hover:border-cyan-400 border border-white/10"
      }`}
      aria-label={`${label} to clipboard`}
    >
      {copied ? (
        <>
          <span>✓</span> Copied
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

export default function ProductPreview() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [demoNote, setDemoNote] = useState("");
  const [provider, setProvider] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<ResultTab>("hook");
  const inputRef = useRef<HTMLInputElement>(null);

  const [alternativeHooks, setAlternativeHooks] = useState<AlternativeHook[]>([]);
  const [generatingHooks, setGeneratingHooks] = useState(false);
  const [hookGenError, setHookGenError] = useState("");

  const [alternativeScripts, setAlternativeScripts] = useState<AlternativeScript[]>([]);
  const [generatingScripts, setGeneratingScripts] = useState(false);
  const [scriptGenError, setScriptGenError] = useState("");

  const [fullReportCopied, setFullReportCopied] = useState(false);

  const sampleUrls = [
    { label: "SaaS & Productivity", url: "https://www.instagram.com/reel/C8_SaaS_ViralAd/" },
    { label: "DTC Tech Gadget", url: "https://www.tiktok.com/@techgadgets/video/73912345678" },
    { label: "Skincare & Beauty", url: "https://www.youtube.com/shorts/skincare_formula_demo" },
  ];

  const handleAnalyze = async (overrideUrl?: string) => {
    const targetUrl = (overrideUrl || url).trim();
    if (!targetUrl || loading) return;

    setError("");
    setLoading(true);
    setAlternativeHooks([]);
    setAlternativeScripts([]);
    setHookGenError("");
    setScriptGenError("");

    let entitlementToken = "";
    try {
      const stored = localStorage.getItem("adspy_active_entitlement");
      if (stored) {
        const parsed = JSON.parse(stored);
        entitlementToken = parsed.token || "";
      }
    } catch {
      // Storage fallback
    }

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(entitlementToken ? { "x-adspy-entitlement": entitlementToken } : {}),
        },
        body: JSON.stringify({ url: targetUrl, entitlementToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed to complete.");
      }

      setResult(data.result);
      setIsDemo(Boolean(data.isDemo));
      setDemoNote(data.note || "");
      setProvider(data.provider || "");
      setActiveTab("hook");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateHooks = async () => {
    if (!result || generatingHooks) return;
    setGeneratingHooks(true);
    setHookGenError("");
    try {
      const res = await fetch("/api/alternatives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: result.url || url,
          type: "hooks",
          currentHook: result.openingHook,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate hooks");
      if (data.alternatives) {
        setAlternativeHooks(data.alternatives);
      }
    } catch (err: unknown) {
      setHookGenError(err instanceof Error ? err.message : "Error generating alternative hooks");
    } finally {
      setGeneratingHooks(false);
    }
  };

  const handleGenerateScripts = async () => {
    if (!result || generatingScripts) return;
    setGeneratingScripts(true);
    setScriptGenError("");
    try {
      const res = await fetch("/api/alternatives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: result.url || url,
          type: "scripts",
          currentScript: result.ugcScript,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate script angles");
      if (data.concepts) {
        setAlternativeScripts(data.concepts);
      }
    } catch (err: unknown) {
      setScriptGenError(err instanceof Error ? err.message : "Error generating script angles");
    } finally {
      setGeneratingScripts(false);
    }
  };

  const handleCopyFullReport = async () => {
    if (!result) return;
    const formatted = `=== AI UGC ADS SPY GENERATOR REPORT ===
Source URL: ${result.url || url}
Analysis ID: ${result.id}
Date: ${result.analyzedAt}

[RETENTION & HOOK METRICS]
Hook Retention Score: ${result.hookScore}/100
Hook Formula: ${result.hookType}
Psychological Trigger: ${result.emotionalTrigger}
Visual Pacing: ${result.pacing}
Target Audience: ${result.targetAudience}

[OPENING HOOK (0-3s)]
"${result.openingHook}"

[CHRONOLOGICAL SCRIPT BREAKDOWN]
${result.scriptStructure.map((s, i) => `${i + 1}. [${s.label} - ${s.duration}]\n${s.content}\nDirector Note: ${s.note || "N/A"}`).join("\n\n")}

[5 SORA 2 GENERATIVE PROMPTS]
${result.soraPrompts.map((p, i) => `Scene ${i + 1}:\n${p}`).join("\n\n")}

[REBUILT PRODUCTION UGC SCRIPT]
${result.ugcScript}
=======================================`;

    try {
      await navigator.clipboard.writeText(formatted);
      setFullReportCopied(true);
      setTimeout(() => setFullReportCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleDownloadReport = () => {
    if (!result) return;
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `adspy-analysis-${result.id}.json`;
    a.click();
    URL.revokeObjectURL(downloadUrl);
  };

  const handleReset = () => {
    setResult(null);
    setUrl("");
    setError("");
    setAlternativeHooks([]);
    setAlternativeScripts([]);
    setHookGenError("");
    setScriptGenError("");
    if (inputRef.current) inputRef.current.focus();
  };

  const tabs: { id: ResultTab; label: string }[] = [
    { id: "hook", label: "🎣 Hook Diagnostic" },
    { id: "script", label: "📋 Script Architecture" },
    { id: "sora", label: "🎬 5 Sora 2 Prompts" },
    { id: "ugc", label: "✅ Rebuilt UGC Script" },
  ];

  return (
    <section
      id="preview"
      aria-labelledby="preview-heading"
      className="py-24 relative section-transition"
      style={{ background: "linear-gradient(180deg, #08162F 0%, #050B1A 100%)" }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 glass-card-blue px-4 py-2 rounded-full mb-4 border border-cyan-500/30">
            <span className="text-xs font-bold tracking-wider text-cyan-300 uppercase">
              🔬 Interactive Product Engine
            </span>
          </div>
          <h2
            id="preview-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4"
          >
            Try a Sample <span className="gradient-text">Analysis</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Enter a public ad link or select a sample demo profile to inspect the output format.
          </p>
        </div>

        {/* Main Analyzer Card */}
        <div className="glass-card-blue p-6 sm:p-8 rounded-3xl border border-cyan-500/30 shadow-2xl">
          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAnalyze();
            }}
            className="mb-6"
          >
            <label
              htmlFor="ad-url-input"
              className="block text-sm font-bold text-slate-200 mb-2"
            >
              Viral Ad URL (Instagram, TikTok, YouTube Shorts, or Video Link)
            </label>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="ad-url-input"
                ref={inputRef}
                type="url"
                required
                disabled={loading}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.instagram.com/reel/... or https://tiktok.com/@..."
                className="glow-input flex-1 px-4 py-3.5 rounded-xl text-base disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="glow-button px-7 py-3.5 rounded-xl font-bold text-white text-base shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeOpacity="0.25" strokeWidth="3" />
                      <path d="M12 2a10 10 0 0 1 10 10" strokeWidth="3" />
                    </svg>
                    Analyzing Ad...
                  </span>
                ) : (
                  "Analyze Video →"
                )}
              </button>
            </div>

            {/* Quick Sample Chips */}
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <span className="text-xs sm:text-sm text-slate-300 font-semibold">Or load a sample demo profile:</span>
              {sampleUrls.map((sample) => (
                <button
                  key={sample.label}
                  type="button"
                  onClick={() => {
                    setUrl(sample.url);
                    handleAnalyze(sample.url);
                  }}
                  disabled={loading}
                  className="text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl bg-blue-900/40 text-cyan-300 hover:text-white hover:bg-blue-800/60 border border-blue-400/40 transition-colors min-h-[42px] flex items-center gap-1.5"
                >
                  <span>⚡</span> {sample.label}
                </button>
              ))}
            </div>
          </form>

          {/* Error Banner with Retry */}
          {error && (
            <div
              role="alert"
              className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-sm flex items-start justify-between gap-3"
            >
              <div>
                <strong className="font-bold text-red-400 block mb-0.5">Analysis Notice:</strong>
                {error}
              </div>
              <button
                type="button"
                onClick={() => handleAnalyze()}
                className="px-3 py-1 rounded bg-red-800/50 hover:bg-red-700/60 text-white text-xs font-bold shrink-0 border border-red-400/40"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full border-3 border-cyan-400 border-t-transparent animate-spin mx-auto" />
              <div className="text-white font-bold text-base">
                Deconstructing viral video framework...
              </div>
              <p className="text-slate-300 text-sm max-w-sm mx-auto">
                Preparing a hook summary, script outline, and creative prompt ideas.
              </p>
            </div>
          )}

          {/* Mode Transparency Banner */}
          {result && !loading && !isDemo && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-200 text-sm flex items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">⚡</span>
                <span>
                  <strong>Live AI Engine Active:</strong> Generated in real-time by <strong className="text-white font-bold">{provider || "Groq AI"}</strong>.
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold border border-emerald-500/30 shrink-0">
                Live LLM
              </span>
            </div>
          )}

          {result && !loading && isDemo && (
            <div className="mb-6 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-base">ℹ️</span>
                <span>
                  <strong>Demo Mode:</strong> This is an illustrative sample result, not an analysis of the linked video's actual frames or audio. Configure <code className="bg-black/30 px-1 py-0.5 rounded text-cyan-300">GROQ_API_KEY</code> or <code className="bg-black/30 px-1 py-0.5 rounded text-cyan-300">OPENAI_API_KEY</code> for model-generated text analysis of the submitted URL.
                </span>
              </div>
            </div>
          )}

          {/* Results Presentation */}
          {result && !loading && (
            <div className="space-y-6">
              {/* Actions & Tab Navigation Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div role="tablist" aria-label="Analysis Sections" className="flex flex-wrap gap-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      role="tab"
                      id={`tab-${tab.id}`}
                      aria-selected={activeTab === tab.id}
                      aria-controls={`panel-${tab.id}`}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2.5 rounded-xl text-sm sm:text-base font-bold transition-all min-h-[44px] ${
                        activeTab === tab.id ? "tab-active" : "tab-inactive"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
                  <button
                    onClick={handleCopyFullReport}
                    type="button"
                    className={`text-xs sm:text-sm font-bold px-4 py-2 rounded-xl min-h-[40px] flex items-center gap-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                      fullReportCopied
                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                        : "glass-card text-cyan-300 hover:text-white hover:border-cyan-400 border border-white/20"
                    }`}
                  >
                    {fullReportCopied ? (
                      <>
                        <span>✓</span> Report Copied!
                      </>
                    ) : (
                      <>
                        <span>📋</span> Copy Full Report
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDownloadReport}
                    type="button"
                    className="text-xs sm:text-sm font-bold px-4 py-2 rounded-xl glass-card text-slate-200 hover:text-white border border-white/20 min-h-[40px] flex items-center gap-1.5"
                  >
                    <span>📥</span> Download JSON
                  </button>
                  <button
                    onClick={handleReset}
                    type="button"
                    className="text-xs sm:text-sm font-bold px-4 py-2 rounded-xl glass-card text-slate-200 hover:text-white border border-white/20 min-h-[40px]"
                  >
                    Analyze Another ↻
                  </button>
                </div>
              </div>

              {/* TAB 1: HOOK */}
              {activeTab === "hook" && (
                <div id="panel-hook" role="tabpanel" aria-labelledby="tab-hook" className="space-y-4">
                  <HookScoreMeter score={result.hookScore} />

                  <div className="glass-card p-6 border border-white/15">
                    <div className="text-xs sm:text-sm font-bold text-cyan-400 uppercase tracking-wider mb-2">
                      Opening Hook Transcription (First 3 Seconds)
                    </div>
                    <blockquote className="text-white text-base sm:text-xl font-medium italic border-l-3 border-cyan-400 pl-4 py-1 leading-relaxed">
                      {result.openingHook}
                    </blockquote>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="glass-card p-5 border border-white/15">
                      <div className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Hook Formula Type
                      </div>
                      <div className="text-white font-extrabold text-base sm:text-lg">{result.hookType}</div>
                    </div>
                    <div className="glass-card p-5 border border-white/15">
                      <div className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Psychological Trigger
                      </div>
                      <div className="text-cyan-300 font-extrabold text-base sm:text-lg">{result.emotionalTrigger}</div>
                    </div>
                    <div className="glass-card p-5 border border-white/15">
                      <div className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Visual Pacing & Cut Velocity
                      </div>
                      <div className="text-slate-100 text-sm sm:text-base font-semibold">{result.pacing}</div>
                    </div>
                    <div className="glass-card p-5 border border-white/15">
                      <div className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Target Audience Persona
                      </div>
                      <div className="text-slate-100 text-sm sm:text-base font-semibold">{result.targetAudience}</div>
                    </div>
                  </div>

                  {/* GENERATE ALTERNATIVE HOOKS SECTION */}
                  <div className="glass-card p-6 border border-cyan-500/30 rounded-2xl bg-cyan-950/20 space-y-4 mt-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                          <span className="text-xl">⚡</span> Dynamic Hook Engine (Groq LPU)
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                          Need A/B test ideas? Generate three draft hook variations to review and test with your audience.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleGenerateHooks}
                        disabled={generatingHooks}
                        className="glow-button px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shrink-0 inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                      >
                        {generatingHooks ? (
                          <>
                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <circle cx="12" cy="12" r="10" strokeOpacity="0.25" strokeWidth="3" />
                              <path d="M12 2a10 10 0 0 1 10 10" strokeWidth="3" />
                            </svg>
                            Synthesizing Hooks...
                          </>
                        ) : (
                          <>
                            <span>⚡</span> Generate 3 Alternative Hooks
                          </>
                        )}
                      </button>
                    </div>

                    {hookGenError && (
                      <div className="text-xs text-red-300 bg-red-950/40 p-3 rounded-lg border border-red-500/40">
                        {hookGenError}
                      </div>
                    )}

                    {alternativeHooks.length > 0 && (
                      <div className="grid gap-3 pt-2">
                        {alternativeHooks.map((alt, idx) => (
                          <div
                            key={idx}
                            className="glass-card p-4 rounded-xl border border-white/10 hover:border-cyan-400/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-black/30"
                          >
                            <div className="space-y-1.5 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-cyan-300 uppercase px-2 py-0.5 rounded bg-blue-900/50 border border-blue-400/30">
                                  {alt.type}
                                </span>
                                <span className="text-xs font-bold text-emerald-400">
                                  Model Estimate: {alt.retentionScore}%
                                </span>
                              </div>
                              <p className="text-white text-sm sm:text-base font-medium italic">
                                {alt.hook}
                              </p>
                            </div>
                            <div className="shrink-0">
                              <CopyBtn text={alt.hook} label="Copy Hook" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: SCRIPT ARCHITECTURE */}
              {activeTab === "script" && (
                <div id="panel-script" role="tabpanel" aria-labelledby="tab-script" className="space-y-4">
                  <div className="text-sm text-slate-200 font-medium mb-1">
                    Chronological script breakdown with timing intervals and creative rationale:
                  </div>

                  {result.scriptStructure.map((sec, i) => (
                    <div
                      key={i}
                      className="glass-card p-6 border border-white/15 rounded-xl space-y-3 hover:border-cyan-400/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded text-xs sm:text-sm font-black tracking-wider uppercase bg-blue-600/40 text-cyan-300 border border-blue-400/40">
                          {sec.label}
                        </span>
                        <span className="text-sm font-mono font-bold text-slate-200 bg-black/40 px-2 py-0.5 rounded border border-white/10">
                          {sec.duration}
                        </span>
                      </div>
                      <p className="text-white text-base sm:text-lg leading-relaxed font-medium">
                        {sec.content}
                      </p>
                      {sec.note && (
                        <div className="text-sm text-cyan-200 bg-cyan-950/50 p-3.5 rounded-lg border border-cyan-500/30">
                          💡 <strong>Director Note:</strong> {sec.note}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: 5 SORA 2 PROMPTS */}
              {activeTab === "sora" && (
                <div id="panel-sora" role="tabpanel" aria-labelledby="tab-sora" className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <p className="text-sm sm:text-base text-slate-200 font-medium">
                      5 structured video generation prompts ready to paste into OpenAI Sora 2:
                    </p>
                    <CopyBtn
                      text={result.soraPrompts.map((p, i) => `[Scene ${i + 1}]\n${p}`).join("\n\n")}
                      label="Copy All Prompts"
                    />
                  </div>

                  {result.soraPrompts.map((prompt, i) => (
                    <div key={i} className="glass-card p-6 border border-white/15 rounded-xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-bold text-cyan-300 bg-blue-900/40 px-2.5 py-1 rounded border border-blue-500/30">
                          SCENE {i + 1}
                        </span>
                        <CopyBtn text={prompt} label="Copy Scene" />
                      </div>
                      <p className="text-slate-100 text-sm sm:text-base leading-relaxed font-mono bg-black/40 p-4 rounded-lg border border-white/5">
                        {prompt}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: REBUILT UGC SCRIPT */}
              {activeTab === "ugc" && (
                <div id="panel-ugc" role="tabpanel" aria-labelledby="tab-ugc" className="space-y-4">
                  <div className="glass-card p-6 border border-white/15 rounded-xl space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                      <div>
                        <h4 className="text-lg font-bold text-white">Production UGC Script</h4>
                        <span className="text-sm text-slate-200 font-medium">
                          {result.ugcScript.split(" ").length} words · Estimated duration: 28-32s
                        </span>
                      </div>
                      <CopyBtn text={result.ugcScript} label="Copy Script" />
                    </div>

                    <pre className="text-slate-100 text-base sm:text-lg leading-relaxed whitespace-pre-wrap font-sans bg-black/40 p-5 rounded-xl border border-white/5">
                      {result.ugcScript}
                    </pre>
                  </div>

                  {/* GENERATE ALTERNATIVE SCRIPT ANGLES */}
                  <div className="glass-card p-6 border border-cyan-500/30 rounded-2xl bg-cyan-950/20 space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                          <span className="text-xl">🎬</span> Alternative Narrative Angles (Groq LPU)
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                          Explore different storytelling structures (Confession, Split-screen, Unboxing, Founder Story).
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleGenerateScripts}
                        disabled={generatingScripts}
                        className="glow-button px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shrink-0 inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                      >
                        {generatingScripts ? (
                          <>
                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <circle cx="12" cy="12" r="10" strokeOpacity="0.25" strokeWidth="3" />
                              <path d="M12 2a10 10 0 0 1 10 10" strokeWidth="3" />
                            </svg>
                            Drafting Angles...
                          </>
                        ) : (
                          <>
                            <span>🎬</span> Generate Script Angles
                          </>
                        )}
                      </button>
                    </div>

                    {scriptGenError && (
                      <div className="text-xs text-red-300 bg-red-950/40 p-3 rounded-lg border border-red-500/40">
                        {scriptGenError}
                      </div>
                    )}

                    {alternativeScripts.length > 0 && (
                      <div className="grid gap-3 pt-2">
                        {alternativeScripts.map((concept, idx) => (
                          <div
                            key={idx}
                            className="glass-card p-5 rounded-xl border border-white/10 hover:border-cyan-400/40 transition-all space-y-2 bg-black/30"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <h5 className="text-base font-bold text-white flex items-center gap-2">
                                <span className="text-cyan-400">Angle {idx + 1}:</span> {concept.title}
                              </h5>
                              <span className="text-xs font-mono font-bold text-slate-300 bg-white/5 px-2 py-0.5 rounded border border-white/10 shrink-0">
                                ⏱️ {concept.pacing}
                              </span>
                            </div>
                            <p className="text-slate-200 text-sm sm:text-base leading-relaxed bg-black/40 p-3.5 rounded-lg border border-white/5 font-sans">
                              {concept.outline}
                            </p>
                            <div className="flex justify-end pt-1">
                              <CopyBtn
                                text={`[${concept.title} - ${concept.pacing}]\n${concept.outline}`}
                                label="Copy Concept Outline"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Premium Creative Tool Empty State */}
          {!result && !loading && !error && (
            <div className="text-center py-12 px-6 border-2 border-dashed border-cyan-500/20 rounded-3xl bg-black/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 via-transparent to-transparent pointer-events-none" />

              {/* Magnifying Glass & Viral Ad Wireframe Micro-Illustration */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 p-0.5 mx-auto mb-5 shadow-xl shadow-blue-500/20">
                <div className="w-full h-full bg-[#071329] rounded-[14px] flex items-center justify-center text-3xl">
                  🔍
                </div>
              </div>

              <h4 className="text-xl sm:text-2xl font-black text-white mb-2 tracking-tight">
                Ready to Reverse-Engineer Competitor Ad Creative
              </h4>
              <p className="text-slate-300 text-sm sm:text-base max-w-md mx-auto mb-6 leading-relaxed">
                Paste a public ad URL to review a generated hook summary, script outline, prompt ideas, and UGC-style draft.
              </p>

              {/* Verified Feature Capabilities Ribbon */}
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-slate-300">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-cyan-400">⚡</span> Groq LPU Instant Inference
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-emerald-400">✓</span> 0-3s Hook Diagnostic
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-purple-400">🎬</span> 5 Sora 2 Cinematography Prompts
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-yellow-400">📋</span> Production UGC Script
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
