import { AnalysisResult } from "@/types";

/**
 * Validate URL and protect against Server-Side Request Forgery (SSRF)
 */
export function validateAndSanitizeUrl(inputUrl: string): { valid: boolean; error?: string; cleanUrl?: string } {
  if (!inputUrl || typeof inputUrl !== "string") {
    return { valid: false, error: "Please enter an ad link." };
  }

  const trimmed = inputUrl.trim();
  if (trimmed.length > 2048) {
    return { valid: false, error: "URL exceeds maximum allowed length of 2048 characters." };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { valid: false, error: "Please enter a valid URL including http:// or https://" };
  }

  // Enforce HTTP / HTTPS only
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { valid: false, error: "Only HTTP and HTTPS URLs are supported." };
  }

  const hostname = parsed.hostname.toLowerCase();

  // SSRF Protection: Deny localhost, private RFC1918 IPs, link-local, cloud metadata
  const forbiddenPatterns = [
    /^localhost$/i,
    /^127\.\d+\.\d+\.\d+$/,
    /^0\.0\.0\.0$/,
    /^10\.\d+\.\d+\.\d+$/,
    /^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/,
    /^192\.168\.\d+\.\d+$/,
    /^169\.254\.\d+\.\d+$/, // AWS / GCP / Azure Instance Metadata
    /^fc00:/i, // IPv6 Unique Local
    /^fe80:/i, // IPv6 Link-Local
    /^::1$/,   // IPv6 Loopback
    /\.local$/i,
    /\.internal$/i,
    /\.onion$/i,
  ];

  for (const pattern of forbiddenPatterns) {
    if (pattern.test(hostname)) {
      return { valid: false, error: "Requests to private, loopback, or internal networks are blocked." };
    }
  }

  return { valid: true, cleanUrl: parsed.toString() };
}

// Rich industry-specific demo datasets calibrated from viral ads
const industryProfiles: Record<string, Omit<AnalysisResult, "id" | "url" | "analyzedAt">> = {
  saas: {
    hookScore: 94,
    hookType: "Pattern Interrupt + Problem Agitate",
    emotionalTrigger: "FOMO + Cognitive Relief",
    openingHook: '"Wait — you\'re still spending 3 hours doing competitor research the manual way? Look at this screen right now..."',
    platform: "Instagram Reels / TikTok",
    estimatedDuration: "28 seconds",
    pacing: "Fast-paced (2.2 cuts/sec during hook, settling into structured walkthrough)",
    targetAudience: "Growth Marketers, Founders & Agencies (Age 22-42)",
    ctaType: "Frictionless Free Value (Link in Bio / Comment trigger)",
    scriptStructure: [
      {
        label: "HOOK",
        duration: "0–3s",
        content: "High-contrast visual interrupt: Creator points at a glowing analytics screen with dramatic facial expression.",
        note: "Captures attention in the first 1.2s before swipe threshold.",
      },
      {
        label: "PROBLEM",
        duration: "3–10s",
        content: "Empathy agitate: 'You watch 50 competitor ads, scribble messy notes in Notion, and still have no idea why their ad scaled.'",
        note: "Names the exact everyday frustration in creator's own vocabulary.",
      },
      {
        label: "SOLUTION",
        duration: "10–22s",
        content: "Fast-motion demonstration: AdSpy AI extracts the hook formula, 5 Sora video prompts, and camera-ready script in 60s.",
        note: "Features concrete proof of speed rather than vague promises.",
      },
      {
        label: "CTA",
        duration: "22–28s",
        content: "Comment 'SPY' or tap the link in bio to analyze your first ad 100% free.",
        note: "Single unambiguous call-to-action reduces decision fatigue.",
      },
    ],
    soraPrompts: [
      "Cinematic close-up of a modern growth marketer at an electric-blue backlit desk, smartphone showing skyrocketing ROAS graphs, neon holographic UI floating above screen, 4K quality, 8 seconds, smooth pan.",
      "High-energy split screen: Left side shows overwhelmed creative surrounded by messy sticky notes; Right side shows streamlined creator smiling at completed Sora ad pipeline, dramatic lighting transition.",
      "Studio macro shot of a sleek smartphone interface rendering a 3D deconstructed video ad into glowing labeled nodes (Hook, Problem, Solution, CTA), cinematic depth of field, 10 seconds.",
      "Handheld authentic UGC style: Creator holding phone towards camera in daylight office, pointing at live metrics dashboard showing 4.2x ROAS spike, casual enthusiastic delivery.",
      "Abstract cinematic motion graphic: Golden kinetic energy threads deconstructing viral video clips and weaving into an optimized storyboard with cyan light rays, 8 seconds.",
    ],
    ugcScript: `[HOOK — 0:00 - 0:03]
🎬 "Stop spending 3 hours guessing what makes competitor ads go viral..."

[PROBLEM — 0:03 - 0:10]
Most marketers spend their entire morning manually scrolling TikTok and Instagram, bookmarking winning ads, but never cracking the exact psychological framework behind them.

[SOLUTION — 0:10 - 0:21]
AdSpy AI reverse-engineers any viral ad link in under 90 seconds. It decodes the exact hook trigger, visual pacing, script structure, and instantly outputs 5 Sora 2 video prompts ready to shoot.

[CTA — 0:21 - 0:28]
🔗 Tap the link below right now. Paste your first competitor ad link and get the full analysis free.
Takes less than 2 minutes.`,
  },
  ecommerce: {
    hookScore: 91,
    hookType: "Curiosity Gap + Immediate Demonstration",
    emotionalTrigger: "Sensory Satisfaction + Urgency",
    openingHook: '"I tested the viral gadget everyone on my feed won\'t stop raving about, and honestly? It\'s not what I expected..."',
    platform: "TikTok / YouTube Shorts",
    estimatedDuration: "32 seconds",
    pacing: "Rapid dynamic cuts, upbeat rhythmic audio sync",
    targetAudience: "DTC Shoppers & Gadget Enthusiasts (Age 18-35)",
    ctaType: "Exclusive Discount Code (Limited Stock Urgency)",
    scriptStructure: [
      {
        label: "HOOK",
        duration: "0–4s",
        content: "Sensory macro shot: Unboxing or physical product action creating immediate visual curiosity.",
        note: "Avoids sounding like a sponsored pitch in opening frame.",
      },
      {
        label: "PROBLEM",
        duration: "4–11s",
        content: "Common pain point: Cheap alternatives break or don't deliver on promises.",
        note: "Builds contrast between commodity products and this solution.",
      },
      {
        label: "SOLUTION",
        duration: "11–24s",
        content: "Real-world test: Demonstrating 3 standout features with side-by-side proof.",
        note: "Clear visual payoff to the curiosity hook.",
      },
      {
        label: "CTA",
        duration: "24–32s",
        content: "Special 20% creator link active for the next 48 hours in bio.",
        note: "Clear deadline incentive encourages immediate checkout.",
      },
    ],
    soraPrompts: [
      "Ultra-detailed product reveal in warm studio lighting, slow-motion water droplets bouncing off matte titanium finish, soft blue rim light, 8 seconds.",
      "First-person POV opening package on modern marble countertop, natural daylight, authentic excitement, crisp 4K vertical video.",
      "Split comparison showing ordinary competitor failing stress test vs innovative product performing effortlessly, high dynamic range.",
      "Cinematic lifestyle b-roll: Young professional using product seamlessly on morning commute, sun flare through urban cafe window.",
      "3D exploded view of internal mechanics highlighting premium engineering, glowing electric blue accents, seamless loop.",
    ],
    ugcScript: `[HOOK — 0:00 - 0:04]
🎬 "I ordered that viral product everyone is talking about to see if it actually works..."

[PROBLEM — 0:04 - 0:11]
Every single cheap alternative I bought on Amazon broke within two weeks. I was convinced this was just another overhyped video ad.

[SOLUTION — 0:11 - 0:24]
I was completely wrong. This thing solved my daily hassle in literal seconds. The build quality is unbelievable, and it actually does what the ads claim.

[CTA — 0:24 - 0:32]
🛒 Use code VIRAL20 at the link in bio before the restock sells out again.`,
  },
  beauty: {
    hookScore: 96,
    hookType: "Before & After Transformation Shock",
    emotionalTrigger: "Aspiration + Aesthetic Relatability",
    openingHook: '"If your skincare routine isn\'t giving you glass skin in 14 days, you\'re using the wrong active ingredients..."',
    platform: "Instagram Reels",
    estimatedDuration: "30 seconds",
    pacing: "Smooth, intimate camera angles with crisp ASMR audio",
    targetAudience: "Skincare & Wellness Seekers (Age 20-40)",
    ctaType: "Free Routine Quiz + Starter Kit Link",
    scriptStructure: [
      {
        label: "HOOK",
        duration: "0–3s",
        content: "Macro bare-skin shot with natural glow; bold contrasting text overlay.",
        note: "Zero filter look establishes immediate credibility.",
      },
      {
        label: "PROBLEM",
        duration: "3–9s",
        content: "Layering 10 products that cancel each other out and damage skin barrier.",
        note: "Validates viewer frustration with complex routines.",
      },
      {
        label: "SOLUTION",
        duration: "9–22s",
        content: "Simplified 2-step formula showing texture application and immediate hydration.",
        note: "ASMR pump sound and texture glow.",
      },
      {
        label: "CTA",
        duration: "22–30s",
        content: "Take the 30-second skin quiz linked in bio for custom formulation.",
        note: "Low barrier to entry micro-commitment.",
      },
    ],
    soraPrompts: [
      "Golden hour bathroom mirror aesthetic, creator applying glowing serum with gentle tap motions, dew droplets catching warm sunlight, 4K 60fps feel.",
      "Microscopic close-up of clean botanical serum penetrating skin barrier, luminous cyan and pearl particles, medical grade aesthetic.",
      "Authentic side-by-side time-lapse progression of skin barrier smoothing over 14 days, daylight consistency.",
      "Flat lay aesthetic of minimalist skincare bottle with morning coffee and linen notebook, soft shadows, luxury editorial magazine feel.",
      "Creator smiling into camera, turning cheek to catch natural sunlight reflection, genuine confident expression, vertical 9:16.",
    ],
    ugcScript: `[HOOK — 0:00 - 0:03]
🎬 "Stop wasting money on 10-step routines that destroy your skin barrier..."

[PROBLEM — 0:03 - 0:09]
I spent hundreds on viral serums that left my face irritated and dry. More products does not mean better results.

[SOLUTION — 0:09 - 0:22]
This one balanced formulation replaced four steps in my morning routine. Within two weeks, my skin looked calm, bright, and genuinely hydrated all day.

[CTA — 0:22 - 0:30]
✨ Tap the link below to get your personalized starter kit with free shipping today.`,
  },
};

export function getDemoResult(url: string): Omit<AnalysisResult, "id" | "url" | "analyzedAt"> {
  const lower = url.toLowerCase();
  if (lower.includes("beauty") || lower.includes("skin") || lower.includes("cream") || lower.includes("glow")) {
    return industryProfiles.beauty;
  }
  if (lower.includes("shop") || lower.includes("product") || lower.includes("gadget") || lower.includes("amazon") || lower.includes("buy")) {
    return industryProfiles.ecommerce;
  }
  return industryProfiles.saas;
}

export async function analyzeAdWithGroq(
  url: string,
  apiKey: string
): Promise<Omit<AnalysisResult, "id" | "url" | "analyzedAt">> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: `You are an elite UGC Ad Director, Viral Video Psychologist, and Creative Strategist.
Analyze the provided viral ad URL or concept and output a comprehensive reverse-engineered blueprint.
Return ONLY a valid JSON object matching this exact schema without any markdown wrapping or extra text:
{
  "hookScore": number (integer between 0 and 100),
  "hookType": string,
  "emotionalTrigger": string,
  "openingHook": string,
  "platform": string,
  "estimatedDuration": string,
  "pacing": string,
  "targetAudience": string,
  "ctaType": string,
  "scriptStructure": [
    { "label": "HOOK" | "PROBLEM" | "SOLUTION" | "CTA", "duration": string, "content": string, "note": string }
  ],
  "soraPrompts": [5 detailed, cinematic Sora 2 prompts],
  "ugcScript": string (full word-for-word production script with timestamps)
}`,
        },
        {
          role: "user",
          content: `Analyze this viral ad: ${url}`,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API returned status ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

export async function analyzeAdWithOpenAI(
  url: string,
  apiKey: string
): Promise<Omit<AnalysisResult, "id" | "url" | "analyzedAt">> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an elite UGC Ad Director and Creative Strategist.
Analyze the provided viral ad URL or concept and output a comprehensive reverse-engineered blueprint.
Return ONLY a valid JSON object matching this exact schema:
{
  "hookScore": number (0-100),
  "hookType": string,
  "emotionalTrigger": string,
  "openingHook": string,
  "platform": string,
  "estimatedDuration": string,
  "pacing": string,
  "targetAudience": string,
  "ctaType": string,
  "scriptStructure": [
    { "label": "HOOK" | "PROBLEM" | "SOLUTION" | "CTA", "duration": string, "content": string, "note": string }
  ],
  "soraPrompts": [5 detailed, cinematic Sora 2 prompts],
  "ugcScript": string (full word-for-word production script with timestamps)
}`,
        },
        {
          role: "user",
          content: `Analyze this viral ad: ${url}`,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API returned status ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}
