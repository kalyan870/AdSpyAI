import { NextRequest, NextResponse } from "next/server";
import { validateAndSanitizeUrl } from "@/lib/analyzeAd";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, type, currentHook, currentScript } = body;

    // Type can be 'hooks' or 'scripts'
    const groqApiKey = process.env.GROQ_API_KEY;

    if (!groqApiKey) {
      // Fallback alternatives
      if (type === "hooks") {
        return NextResponse.json({
          alternatives: [
            {
              hook: '"Stop scrolling if you\'re still trying to scale ads without testing this 3-second rule..."',
              type: "Pattern Interrupt + Authority",
              retentionScore: 95,
            },
            {
              hook: '"I spent $45,000 testing TikTok hooks last month so you don\'t have to burn your budget..."',
              type: "High Proof + Value Offer",
              retentionScore: 92,
            },
            {
              hook: '"Everyone says UGC is dead in 2026. Here is why the top 1% are laughing all the way to Stripe..."',
              type: "Contrarian Polarization",
              retentionScore: 96,
            },
          ],
        });
      } else {
        return NextResponse.json({
          concepts: [
            {
              title: "The Relatable Confession Angle",
              pacing: "Handheld selfie, casual morning routine, 24 seconds",
              outline: "Admit past failure -> Reveal competitor reverse-engineering shortcut -> Show live proof -> Low-friction link in bio CTA.",
            },
            {
              title: "The Split-Screen Teardown Angle",
              pacing: "Fast-motion montage, energetic cuts, 30 seconds",
              outline: "Side-by-side comparison: Old manual guesswork vs AdSpy AI automated pipeline -> 5 Sora scenes b-roll -> Direct urgency discount.",
            },
          ],
        });
      }
    }

    const systemPrompt =
      type === "hooks"
        ? `You are an elite UGC Ad Director. Given an existing ad concept or hook: "${currentHook || url}", generate 3 distinct high-retention alternative hook variations.
Return ONLY valid JSON matching this exact structure:
{
  "alternatives": [
    { "hook": string, "type": string, "retentionScore": number (88-98) }
  ]
}`
        : `You are an elite UGC Ad Director. Given an existing ad script: "${currentScript || url}", generate 2 distinct alternative narrative script concepts.
Return ONLY valid JSON matching this exact structure:
{
  "concepts": [
    { "title": string, "pacing": string, "outline": string }
  ]
}`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generate alternative UGC variations for: ${url}` },
        ],
        temperature: 0.8,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq alternatives failed: ${response.statusText}`);
    }

    const data = await response.json();
    const parsed = JSON.parse(data.choices[0].message.content);
    return NextResponse.json(parsed);
  } catch (err: unknown) {
    console.error("Alternatives error:", err);
    return NextResponse.json(
      { error: "Failed to generate alternatives. Please try again." },
      { status: 500 }
    );
  }
}
