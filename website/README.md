# AdSpy AI — Web Application

> **Explore an AI-assisted ad analysis workflow**  
> Portfolio prototype for organizing a public ad URL into a hook summary, script outline, creative prompt ideas, and a UGC-style rewrite.

---

## 🚀 Features

- **Ad Link Input**: Accepts Instagram Reels, TikTok, and YouTube Shorts URLs. The current backend passes URL text to a configured model; it does not download or transcribe video media.
- **Hook Summary**: Returns a 0-100 sample score and hook labels. Demo-mode results are illustrative, not measured retention or campaign performance.
- **Script Breakdown**: Multi-section structure (`HOOK`, `PROBLEM`, `SOLUTION`, `CTA`) with timing and director notes.
- **5 Video Prompt Ideas**: Text suggestions that can be adapted for a video generation tool; this repository does not generate video.
- **UGC-Style Script**: A draft with sections and voice cues for a human to review and edit.
- **Demo Fallback**: The app returns fixed illustrative examples when no model key is configured.
- **Custom Design System**: Electric blue (`#0066FF`), cyan glow (`#00B4FF`), deep navy backgrounds, glassmorphism, and responsive layouts.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons & Graphics**: Custom SVG illustrations and CSS art

---

## 💻 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add a Groq key for the primary provider, or an OpenAI key for the fallback:
```env
OPENAI_API_KEY=sk-proj-...
```
*(If omitted or blank, the app returns illustrative demo content. Video frames and audio are not analyzed.)*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🌐 API Endpoint

### `POST /api/analyze`
**Request Payload:**
```json
{
  "url": "https://www.instagram.com/reel/C8xyz123/"
}
```

**Response Payload (illustrative shape; scores and copy are demo content, not measured results):**
```json
{
  "result": {
    "id": "analysis_1793190882",
    "url": "https://www.instagram.com/reel/C8xyz123/",
    "analyzedAt": "2026-10-28T18:00:00.000Z",
    "hookScore": 94,
    "hookType": "Pattern Interrupt + Problem Agitate",
    "emotionalTrigger": "FOMO + Social Proof",
    "openingHook": "\"Wait — you're still doing this the HARD way? 3 seconds and I'll show you...\"",
    "platform": "Instagram Reels",
    "estimatedDuration": "28s",
    "pacing": "Fast-cut, 2-3 scenes per second at peak",
    "targetAudience": "Aspiring entrepreneurs & freelancers, age 22-38",
    "ctaType": "Urgency + Scarcity",
    "scriptStructure": [
      {
        "label": "HOOK",
        "duration": "0–3s",
        "content": "Visual pattern interrupt...",
        "note": "Must capture attention in first 1.5s"
      }
    ],
    "soraPrompts": ["..."],
    "ugcScript": "..."
  },
  "isDemo": false
}
```

---

## 🚢 Deployment

Deploy in one click to **Vercel**:
```bash
npx vercel
```
Set the environment variable `OPENAI_API_KEY` in the Vercel project settings.
