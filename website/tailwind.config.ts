import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "electric-blue": "#0066FF",
        "cyan-glow": "#00B4FF",
        "neon-cyan": "#00D4FF",
        "navy-dark": "#050B1A",
        "navy-mid": "#0A1628",
        "navy-light": "#0D1F3C",
        "glass-white": "rgba(255,255,255,0.05)",
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
      },
      animation: {
        "float-slow": "floatSlow 6s ease-in-out infinite",
        "float-medium": "floatMedium 4s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
        "count-up": "countUp 2s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "gradient-shift": "gradientShift 8s ease infinite",
      },
      keyframes: {
        floatSlow: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        floatMedium: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-12px) rotate(2deg)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0,180,255,0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(0,180,255,0.8)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "blue-glow":
          "radial-gradient(ellipse at center, rgba(0,102,255,0.3) 0%, transparent 70%)",
        "hero-gradient":
          "linear-gradient(135deg, #050B1A 0%, #0A1628 50%, #0D1F3C 100%)",
      },
      boxShadow: {
        "glow-blue": "0 0 30px rgba(0,102,255,0.5)",
        "glow-cyan": "0 0 30px rgba(0,180,255,0.4)",
        "card-hover": "0 20px 60px rgba(0,102,255,0.25)",
        glass: "0 8px 32px rgba(0,0,0,0.3)",
      },
    },
  },
  plugins: [],
};
export default config;
