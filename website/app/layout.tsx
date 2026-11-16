import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#050B1A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "AdSpy AI — AI-Assisted Ad Analysis Prototype",
  description:
    "A portfolio prototype for exploring ad links through structured hook summaries, script outlines, creative prompt ideas, and UGC-style rewrites. Demo results are illustrative.",
  keywords: [
    "AdSpyAI.com",
    "AdSpy AI",
    "UGC ads",
    "ad spy tool",
    "viral ad reverse engineering",
    "Sora prompts generator",
    "TikTok ad analyzer",
    "Instagram reels ad teardown",
    "creative strategy SaaS",
  ],
  authors: [{ name: "AdSpyAI.com Team" }],
  openGraph: {
    title: "AdSpy AI — AI-Assisted Ad Analysis Prototype",
    description:
      "Paste any ad URL to decode the winning hook, timing structure, and generate 5 cinematic Sora 2 prompts with film-ready UGC scripts.",
    type: "website",
    locale: "en_US",
    siteName: "AdSpyAI.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "AdSpy AI — AI-Assisted Ad Analysis Prototype",
    description:
      "AdSpyAI.com — AI-powered UGC ad spy tool. Analyze hooks, decode scripts, and generate Sora 2 prompts in seconds.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${spaceGrotesk.variable} font-sans antialiased bg-[#050B1A] text-white`}>
        {children}
      </body>
    </html>
  );
}
