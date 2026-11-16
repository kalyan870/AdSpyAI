import { NextRequest, NextResponse } from "next/server";
import { getDemoResult, analyzeAdWithGroq, analyzeAdWithOpenAI, validateAndSanitizeUrl } from "@/lib/analyzeAd";
import { AnalysisResult } from "@/types";
import { verifyEntitlementToken } from "@/lib/plans";

// In-memory free tier IP usage tracker (5 analyses per day per IP)
const freeUsageTracker = new Map<string, { count: number; resetAt: number }>();

function checkFreeRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const ONE_DAY = 24 * 60 * 60 * 1000;
  const record = freeUsageTracker.get(ip);

  if (!record || now > record.resetAt) {
    freeUsageTracker.set(ip, { count: 1, resetAt: now + ONE_DAY });
    return { allowed: true, remaining: 4 };
  }

  if (record.count >= 5) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  return { allowed: true, remaining: 5 - record.count };
}

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON request payload." },
        { status: 400 }
      );
    }

    const { url, entitlementToken } = body;

    // Check entitlement token from header or body
    const headerToken = request.headers.get("x-adspy-entitlement") || entitlementToken;
    let activeEntitlement = headerToken ? verifyEntitlementToken(headerToken) : null;

    // If not on a verified paid plan, enforce Free Tier rate limit (5 analyses per day)
    if (!activeEntitlement) {
      const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
      const rateCheck = checkFreeRateLimit(clientIp);

      if (!rateCheck.allowed) {
        return NextResponse.json(
          {
            error: "Free Beta daily limit reached (5/5 analyses used today). Upgrade to Pro Creator or Agency for unlimited high-velocity teardowns.",
            isLimitReached: true,
          },
          { status: 429 }
        );
      }
    }

    // Validate and sanitize against SSRF and bad protocols
    const validation = validateAndSanitizeUrl(url);
    if (!validation.valid || !validation.cleanUrl) {
      return NextResponse.json(
        { error: validation.error || "Invalid URL provided." },
        { status: 400 }
      );
    }

    const cleanUrl = validation.cleanUrl;
    const groqApiKey = process.env.GROQ_API_KEY;
    const openAiApiKey = process.env.OPENAI_API_KEY;
    let resultData: Omit<AnalysisResult, "id" | "url" | "analyzedAt">;
    let isDemo = false;
    let note = "";
    let provider = "demo";

    // 1. Try Groq first if key exists
    if (groqApiKey && groqApiKey.startsWith("gsk_")) {
      try {
        resultData = await analyzeAdWithGroq(cleanUrl, groqApiKey);
        provider = "Groq (Llama 3.3 70B)";
        note = "Live AI analysis powered by Groq Llama 3.3 70B.";
      } catch (err: unknown) {
        console.error("Groq analysis error, trying fallback:", err);
        // Fallback to OpenAI if available
        if (openAiApiKey && openAiApiKey.startsWith("sk-")) {
          try {
            resultData = await analyzeAdWithOpenAI(cleanUrl, openAiApiKey);
            provider = "OpenAI (GPT-4o)";
            note = "Live AI analysis powered by OpenAI GPT-4o.";
          } catch {
            resultData = getDemoResult(cleanUrl);
            isDemo = true;
            note = "AI providers rate-limited or unreachable; calibrated benchmark model returned.";
          }
        } else {
          resultData = getDemoResult(cleanUrl);
          isDemo = true;
          note = "Groq API error; calibrated benchmark model returned.";
        }
      }
    } else if (openAiApiKey && openAiApiKey.startsWith("sk-")) {
      try {
        resultData = await analyzeAdWithOpenAI(cleanUrl, openAiApiKey);
        provider = "OpenAI (GPT-4o)";
        note = "Live AI analysis powered by OpenAI GPT-4o.";
      } catch (err: unknown) {
        console.error("OpenAI analysis failed, falling back to verified demo profile:", err);
        resultData = getDemoResult(cleanUrl);
        isDemo = true;
        note = "OpenAI service unreachable or rate-limited; calibrated benchmark model returned.";
      }
    } else {
      // Calibrated benchmark profile
      await new Promise((resolve) => setTimeout(resolve, 800));
      resultData = getDemoResult(cleanUrl);
      isDemo = true;
      note = "Running in Calibrated Demo Mode. Set GROQ_API_KEY or OPENAI_API_KEY in .env.local for live AI parsing.";
    }

    const result: AnalysisResult = {
      id: `analysis_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      url: cleanUrl,
      analyzedAt: new Date().toISOString(),
      ...resultData,
    };

    return NextResponse.json(
      {
        result,
        isDemo,
        note,
        provider,
        entitlement: activeEntitlement
          ? {
              planName: activeEntitlement.planName,
              email: activeEntitlement.email,
              unlimited: true,
            }
          : {
              planName: "Free Beta",
              dailyLimit: 5,
            },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error: unknown) {
    console.error("Unhandled analysis error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during ad processing. Please try again." },
      { status: 500 }
    );
  }
}
