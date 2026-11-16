"use client";
import React, { useState, useRef, useEffect } from "react";

export type AdPlatform = "instagram" | "linkedin" | "substack";

interface AdPreviewCardProps {
  initialPlatform?: AdPlatform;
}

export default function AdPreviewCard({ initialPlatform = "instagram" }: AdPreviewCardProps) {
  const [platform, setPlatform] = useState<AdPlatform>(initialPlatform);

  // Video Player State
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string>("");
  const [videoError, setVideoError] = useState(false);
  const [customVideoUploaded, setCustomVideoUploaded] = useState(false);

  // Audio Note State for Substack
  const [audioPlaying, setAudioPlaying] = useState(false);

  // Platform-specific defaults
  useEffect(() => {
    // Check if user set custom video URL via public paths
    const defaultPaths: Record<AdPlatform, string> = {
      instagram: "/videos/instagram-sample.mp4",
      linkedin: "/videos/linkedin-sample.mp4",
      substack: "",
    };

    if (!customVideoUploaded) {
      const targetSrc = defaultPaths[platform] || "/videos/ad-sample.mp4";
      setVideoSrc(targetSrc);
      setVideoError(false);
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [platform, customVideoUploaded]);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn("Playback error:", err);
        setVideoError(true);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setVideoError(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    setCurrentTime(targetTime);
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
    }
  };

  const handleVolumeToggle = () => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    videoRef.current.muted = newMuted;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setVideoSrc(objectUrl);
      setCustomVideoUploaded(true);
      setVideoError(false);
      setIsPlaying(false);
      if (videoRef.current) {
        videoRef.current.load();
      }
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds <= 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full max-w-md mx-auto glass-card-blue p-5 sm:p-6 rounded-3xl border-2 border-cyan-400/50 shadow-2xl shadow-blue-500/20 bg-[#08162F]">
      {/* Header: Platform Selector Tabs (LinkedIn, Instagram, Substack) */}
      <div className="pb-4 border-b border-white/10">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-black tracking-wider uppercase text-cyan-300">
            Select Ad Channel:
          </span>
          {platform === "instagram" && (
            <span className="font-mono text-cyan-300 font-bold bg-blue-900/60 px-2 py-0.5 rounded text-xs border border-blue-400/30">
              Hook Score 94
            </span>
          )}
          {platform === "linkedin" && (
            <span className="font-mono text-blue-300 font-bold bg-blue-900/60 px-2 py-0.5 rounded text-xs border border-blue-400/30">
              Hook Score 91
            </span>
          )}
          {platform === "substack" && (
            <span className="font-mono text-amber-300 font-bold bg-amber-950/60 px-2 py-0.5 rounded text-xs border border-amber-400/30">
              Sample creative · Example data
            </span>
          )}
        </div>

        {/* 3 Platform Tabs: LinkedIn, Instagram, Substack */}
        <div role="tablist" aria-label="Ad Preview Platform Selection" className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10">
          {/* Instagram Button */}
          <button
            type="button"
            role="tab"
            aria-selected={platform === "instagram"}
            onClick={() => setPlatform("instagram")}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-black transition-all ${
              platform === "instagram"
                ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md shadow-pink-500/30 border border-pink-400/40"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            <span>Instagram</span>
          </button>

          {/* LinkedIn Button */}
          <button
            type="button"
            role="tab"
            aria-selected={platform === "linkedin"}
            onClick={() => setPlatform("linkedin")}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-black transition-all ${
              platform === "linkedin"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/30 border border-blue-400/50"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
            </svg>
            <span>LinkedIn</span>
          </button>

          {/* Substack Button */}
          <button
            type="button"
            role="tab"
            aria-selected={platform === "substack"}
            onClick={() => setPlatform("substack")}
            className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-black transition-all ${
              platform === "substack"
                ? "bg-amber-600 text-white shadow-md shadow-amber-500/30 border border-amber-400/50"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
            </svg>
            <span>Substack</span>
          </button>
        </div>
      </div>

      {/* PLATFORM 1 & 2: INSTAGRAM & LINKEDIN VIDEO PLAYER */}
      {(platform === "instagram" || platform === "linkedin") && (
        <div>
          {/* Video Container Window */}
          <div className={`my-4 relative rounded-2xl overflow-hidden bg-black border border-white/10 flex flex-col justify-between ${
            platform === "instagram" ? "aspect-[9/13]" : "aspect-[16/11]"
          }`}>
            {/* Real HTML5 Video Element */}
            <video
              ref={videoRef}
              src={videoSrc}
              poster="/images/hero-3d-reference.jpg"
              playsInline
              preload="metadata"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onEnded={() => setIsPlaying(false)}
              onError={() => setVideoError(true)}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Gradient Overlay for controls legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/60 pointer-events-none" />

            {/* Top Video Overlay Bar */}
            <div className="relative z-10 p-3 flex items-center justify-between">
              <span className="bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-white flex items-center gap-1.5 border border-white/10">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                {platform === "instagram" ? "Instagram Reel Sample" : "LinkedIn Video Sample"}
              </span>

              <span className="bg-emerald-500/90 text-black font-black text-[10px] px-2 py-0.5 rounded-full uppercase">
                {platform === "instagram" ? "Hook example" : "Audience example"}
              </span>
            </div>

            {/* Center Area: Play Button or "Video Not Configured" State */}
            <div className="relative z-10 flex-1 flex items-center justify-center p-4">
              {videoError ? (
                /* Clear "Video not configured" state per prompt requirements */
                <div className="text-center bg-[#071329]/95 backdrop-blur-md p-4 rounded-2xl border border-cyan-500/40 shadow-xl max-w-xs space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-cyan-300 flex items-center justify-center mx-auto text-lg border border-cyan-400/40">
                    🎬
                  </div>
                  <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                    Video Asset Not Configured
                  </h5>
                  <p className="text-[11px] text-slate-300 leading-snug">
                    Place an MP4 at <code className="text-cyan-300 font-mono text-[10px] bg-black/40 px-1 py-0.5 rounded">public/videos/ad-sample.mp4</code> or test with a local file:
                  </p>
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id={`video-upload-${platform}`}
                    />
                    <label
                      htmlFor={`video-upload-${platform}`}
                      className="glow-button px-3 py-1.5 rounded-lg text-xs font-bold text-white cursor-pointer inline-flex items-center gap-1 shadow-md"
                    >
                      <span>📂</span> Choose Local Video
                    </label>
                  </div>
                </div>
              ) : (
                /* Central Play / Pause Button */
                <button
                  type="button"
                  onClick={handlePlayPause}
                  aria-label={isPlaying ? "Pause video" : "Play video"}
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-xl shadow-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    isPlaying
                      ? "bg-black/60 text-white border border-white/20 hover:scale-110"
                      : "bg-cyan-400 text-black shadow-cyan-400/40 hover:scale-110 hover:bg-cyan-300"
                  }`}
                >
                  {isPlaying ? "⏸" : "▶"}
                </button>
              )}
            </div>

            {/* Bottom Real Playback Controls */}
            <div className="relative z-10 p-3 bg-black/90 backdrop-blur-md border-t border-white/10 space-y-2">
              {/* Scrubbable Seek Bar */}
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  value={currentTime}
                  onChange={handleSeek}
                  aria-label="Seek video playback"
                  className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                />
              </div>

              {/* Controls Toolbar: Play/Pause, Timestamp, Volume, Caption */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handlePlayPause}
                    aria-label={isPlaying ? "Pause video" : "Play video"}
                    className="text-white hover:text-cyan-400 font-bold focus-visible:outline-none"
                  >
                    {isPlaying ? "⏸" : "▶"}
                  </button>

                  <span className="font-mono text-cyan-300 text-[11px] font-bold">
                    {formatTime(currentTime)} / {formatTime(duration || 28)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleVolumeToggle}
                    aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                    className="text-slate-300 hover:text-white p-1 rounded"
                  >
                    {isMuted ? "🔇" : "🔊"}
                  </button>

                  {customVideoUploaded && (
                    <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/20 px-1.5 py-0.5 rounded">
                      Local Active
                    </span>
                  )}
                </div>
              </div>

              {/* Caption Preview */}
              <p className="text-[11px] text-slate-200 line-clamp-2 italic pt-1 border-t border-white/5">
                {platform === "instagram" ? (
                  <>&ldquo;@ad_creator: If you&apos;re still running broad ads without this 3-second hook structure, you are burning cash...&rdquo;</>
                ) : (
                  <>&ldquo;ScaleSaaS Growth Team: Why our B2B demo requests grew 340% after switching to UGC founder stories...&rdquo;</>
                )}
              </p>
            </div>
          </div>

          {/* Real-time Telemetry Pills */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
              <div className="text-[10px] text-slate-400 font-bold uppercase">
                {platform === "instagram" ? "Average Cut" : "Narrative Pacing"}
              </div>
              <div className="text-white font-black text-sm mt-0.5">
                {platform === "instagram" ? "2.1s Velocity" : "4.5s Deep Proof"}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
              <div className="text-[10px] text-slate-400 font-bold uppercase">
                {platform === "instagram" ? "Estimated ROAS" : "Enterprise Impact"}
              </div>
              <div className="text-emerald-400 font-black text-sm mt-0.5">
                {platform === "instagram" ? "Example script" : "Example pacing"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PLATFORM 3: SUBSTACK PUBLICATION TEARDOWN */}
      {platform === "substack" && (
        <div className="my-4 space-y-3">
          {/* Substack Newsletter Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#141E33] to-[#0A1224] border border-amber-500/30 shadow-xl space-y-3">
            {/* Newsletter Branding Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-white/10 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-[#FF6719] text-white flex items-center justify-center font-black text-[10px]">
                  S
                </span>
                <span className="font-bold text-white">The Ad Engineering Dispatch</span>
              </div>
              <span className="text-[10px] text-amber-300 font-mono font-bold bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                Editorial Teardown
              </span>
            </div>

            {/* Newsletter Article Headline */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Deep-Dive Case Study · 8 Min Read
              </span>
              <h4 className="text-sm sm:text-base font-black text-white leading-snug">
                Deconstructing the $100M UGC Ad Framework: The 4-Phase Hook Architecture
              </h4>
            </div>

            {/* Pull Quote */}
            <blockquote className="p-3 rounded-xl bg-black/50 border-l-2 border-amber-400 text-xs sm:text-sm text-slate-200 italic leading-relaxed">
              &ldquo;Most ads fail in the first 1.8 seconds because they pitch the solution before proving the emotional pain is real.&rdquo;
            </blockquote>

            {/* Embedded Audio Memo Snippet */}
            <div className="p-3 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setAudioPlaying(!audioPlaying)}
                  aria-label={audioPlaying ? "Pause audio breakdown" : "Play audio breakdown"}
                  className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center text-xs font-bold shadow-md hover:scale-105"
                >
                  {audioPlaying ? "⏸" : "▶"}
                </button>
                <div>
                  <div className="text-xs font-bold text-white">Director Audio Memo</div>
                  <div className="text-[10px] text-slate-400 font-mono">02:14 Breakdown snippet</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className={`w-1 h-3 bg-amber-400 rounded-full ${audioPlaying ? "animate-pulse" : ""}`} />
                <span className={`w-1 h-5 bg-amber-400 rounded-full ${audioPlaying ? "animate-pulse" : ""}`} />
                <span className={`w-1 h-2 bg-amber-400 rounded-full ${audioPlaying ? "animate-pulse" : ""}`} />
                <span className={`w-1 h-4 bg-amber-400 rounded-full ${audioPlaying ? "animate-pulse" : ""}`} />
              </div>
            </div>

            {/* Key Findings Checklist */}
            <div className="space-y-1.5 text-xs text-slate-200 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 font-bold">✓</span>
                <span>Opening 3-second pattern interrupt formula</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 font-bold">✓</span>
                <span>Word-for-word spoken script with timestamps</span>
              </div>
            </div>
          </div>

          {/* Substack Telemetry Stats */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Subscriber Base</div>
              <div className="text-white font-black text-sm mt-0.5">14,200 Growth</div>
            </div>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/10">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Newsletter Open Rate</div>
              <div className="text-amber-400 font-black text-sm mt-0.5">Sample output</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
