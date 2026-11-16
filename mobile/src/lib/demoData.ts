import { AnalysisResult } from '../types';

const demoResults: Omit<AnalysisResult, 'id' | 'url' | 'analyzedAt'>[] = [
  {
    hookScore: 94,
    hookType: 'Pattern Interrupt + Problem Agitate',
    emotionalTrigger: 'FOMO + Social Proof',
    openingHook: '"Wait — you\'re still doing this the HARD way? 3 seconds and I\'ll show you..."',
    platform: 'Instagram Reels',
    estimatedDuration: '28s',
    pacing: 'Fast-cut, 2-3 scenes per second at peak',
    targetAudience: 'Aspiring entrepreneurs & freelancers, age 22-38',
    ctaType: 'Urgency + Scarcity',
    scriptStructure: [
      {
        label: 'HOOK',
        duration: '0–3s',
        content: 'Visual pattern interrupt — bold text overlay, creator appears surprised/shocked',
        note: 'Must capture attention in first 1.5s or lose viewer',
      },
      {
        label: 'PROBLEM',
        duration: '3–10s',
        content: 'Empathy loop: name the pain point explicitly. Show viewer struggling with the old way.',
        note: "Use 'you' language — makes it personal",
      },
      {
        label: 'SOLUTION',
        duration: '10–22s',
        content: 'Demo the transformation. Show before/after. Use social proof (testimonials, stats).',
        note: 'This is where credibility is built',
      },
      {
        label: 'CTA',
        duration: '22–28s',
        content: 'Single clear action: link in bio, comment keyword, or swipe up. Create urgency.',
        note: 'Remove all friction — one action only',
      },
    ],
    soraPrompts: [
      'Cinematic close-up of a young entrepreneur at a modern desk, phone showing viral ad metrics skyrocketing, electric blue data streams, dramatic lighting with cyan glow, 4K, 8 seconds, fast-paced dynamic edit',
      'Split-screen: left side frustrated marketer drowning in spreadsheets, right side same person smiling at glowing success dashboard, dramatic transformation reveal, dark studio with blue rim light, 10 seconds',
      'Aerial drone shot transitioning to smartphone showing AdSpy AI interface with glowing analysis results, floating particle text, modern tech aesthetic, 12 seconds, cinematic grade',
      'Testimonial-style UGC: authentic creator holding phone showing 10x ROAS results, casual home office, warm lighting with product screen casting blue glow, 15 seconds, handheld authentic feel',
      'Abstract viral ad being deconstructed — golden threads pulling apart into HOOK/PROBLEM/SOLUTION/CTA labels, reassembling into new script, dark background with neon blue elements, 8 seconds, motion graphics',
    ],
    ugcScript: `[HOOK — 0-3s]
🎬 "Stop spending 3 hours researching competitor ads..."

[PROBLEM — 3-10s]
Most marketers waste their entire morning manually watching competitor content, taking notes, trying to guess what makes an ad go viral.

[SOLUTION — 10-22s]
AdSpy AI analyzes any viral UGC ad in under 2 minutes. It decodes the exact hook structure, identifies the emotional trigger, breaks down the script format — then writes you a brand-new UGC script AND generates Sora video prompts ready to film.

[CTA — 22-28s]
🔗 Paste your first competitor ad link below. Get your full analysis FREE.
↓ Link in bio — takes 90 seconds.`,
  },
  {
    hookScore: 87,
    hookType: 'Curiosity Gap + Transformation',
    emotionalTrigger: 'Aspiration + Fear of Missing Out',
    openingHook: '"This ONE thing changed how I create content forever..."',
    platform: 'TikTok',
    estimatedDuration: '35s',
    pacing: 'Medium-paced, story-driven with fast climax',
    targetAudience: 'Content creators & social media managers, age 18-32',
    ctaType: 'Value Exchange (Comment for free resource)',
    scriptStructure: [
      {
        label: 'HOOK',
        duration: '0–4s',
        content: 'Teaser statement implying secret knowledge. Creator looks directly at camera.',
        note: 'Curiosity gap must be genuine — deliver on the promise',
      },
      {
        label: 'PROBLEM',
        duration: '4–12s',
        content: 'Relatability moment — creator shares their own struggle (authentic, not scripted-sounding).',
        note: 'First-person vulnerability builds trust rapidly',
      },
      {
        label: 'SOLUTION',
        duration: '12–28s',
        content: 'Step-by-step reveal with screen recording or demo. Numbers and specifics add credibility.',
        note: 'Show real results, not generic claims',
      },
      {
        label: 'CTA',
        duration: '28–35s',
        content: 'Comment a keyword to get free resource. Creates engagement signal for algorithm.',
        note: 'Comment CTAs boost reach significantly',
      },
    ],
    soraPrompts: [
      'Content creator at aesthetic desk setup, phone propped showing viral video stats, warm ambient light with cool blue monitor glow, authentic casual vibe, looking excitedly at camera, 8 seconds',
      'Screen recording of AdSpy AI analyzing a viral TikTok, insights appearing one by one, hook score climbing to 94, electric blue interface on dark background, 10 seconds',
      'Time-lapse of content creation: empty script → AI-generated script → filming → published video with views counter exploding, 12 seconds, blue and white color scheme',
      'Creator holding phone with before/after: left 200 views, right 2.3M views, genuine surprised expression, bright ring-light setup, 8 seconds, vertical format',
      'Overhead shot of creative workspace with glowing connections between notebook, phone, laptop like a mind-map, 10 seconds, flat lay aesthetic',
    ],
    ugcScript: `[HOOK — 0-4s]
🎬 "I analyzed 500 viral ads so you don't have to. Here's what they all have in common..."

[PROBLEM — 4-12s]
Six months ago my content was getting 200 views max. Good lighting, good audio — nothing worked. I was invisible.

[SOLUTION — 12-28s]
Then I found AdSpy AI. I pasted my top competitor's best-performing ad and got back the ENTIRE blueprint in 90 seconds.
My next video hit 2.3M views using the same framework.

[CTA — 28-35s]
💬 Comment "SPY" below and I'll DM you the free analysis tool.`,
  },
];

export function getDemoData(url: string): Omit<AnalysisResult, 'id' | 'url' | 'analyzedAt'> {
  const index = url.length % demoResults.length;
  return demoResults[index];
}
