"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SocialLinks from "@/components/SocialLinks";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#features", label: "Capabilities" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#preview", label: "Live Analyzer" },
    { href: "#use-cases", label: "Use Cases" },
    { href: "#pricing", label: "Pricing" },
  ];

  const handleScrollToPreview = (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileOpen(false);
    const target = document.getElementById("preview");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
      const input = document.getElementById("ad-url-input");
      if (input) {
        setTimeout(() => input.focus(), 600);
      }
    }
  };

  return (
    <header
      role="banner"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#050B1A]/95 backdrop-blur-xl border-b border-blue-500/20 shadow-lg shadow-black/40"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-1"
            aria-label="AdSpyAI.com Home"
          >
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-xl opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5" aria-hidden="true">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-xl opacity-30 blur-md group-hover:opacity-60 transition-opacity" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-white">AdSpyAI</span>
              <span className="text-cyan-400">.com</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-slate-200 hover:text-white transition-colors relative py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="#pricing"
              className="text-sm font-semibold text-slate-300 hover:text-white transition-colors py-2 px-3 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              Plans
            </a>
            <button
              onClick={handleScrollToPreview}
              className="glow-button px-5 py-2.5 rounded-xl text-sm font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              Analyze Viral Ad →
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-slate-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#071126] border-b border-blue-500/20 px-6 py-6"
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-semibold text-slate-200 hover:text-cyan-400 py-2 border-b border-white/5"
                >
                  {link.label}
                </a>
              ))}
              <button
                onClick={handleScrollToPreview}
                className="glow-button text-center py-3 rounded-xl font-bold text-white mt-2 w-full"
              >
                Launch Free Analyzer →
              </button>

              <div className="pt-4 border-t border-white/10 mt-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                  Official Channels
                </span>
                <SocialLinks />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
