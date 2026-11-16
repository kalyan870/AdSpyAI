export interface ScriptSection {
  label: "HOOK" | "PROBLEM" | "SOLUTION" | "CTA";
  duration: string;
  content: string;
  note?: string;
}

export interface AnalysisResult {
  id: string;
  url: string;
  analyzedAt: string;
  hookScore: number;
  hookType: string;
  emotionalTrigger: string;
  openingHook: string;
  scriptStructure: ScriptSection[];
  pacing: string;
  targetAudience: string;
  ctaType: string;
  soraPrompts: string[];
  ugcScript: string;
  platform: string;
  estimatedDuration: string;
}

export interface PricingTier {
  id?: "free" | "pro" | "agency";
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted: boolean;
  cta: string;
}
