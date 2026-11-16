import { AnalysisResult } from '../types';
import { getDemoData } from './demoData';

interface ApiConfig {
  apiKey?: string;
  baseUrl?: string;
}

export async function analyzeAd(
  url: string,
  config?: ApiConfig
): Promise<{ result: AnalysisResult; isDemo: boolean }> {
  // Validate URL
  try {
    new URL(url);
  } catch {
    throw new Error('Please enter a valid URL');
  }

  const { apiKey, baseUrl } = config || {};

  // Try website API first if baseUrl provided
  if (baseUrl) {
    try {
      const response = await fetch(`${baseUrl}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch {
      // Fall through to demo
    }
  }

  // Try direct Groq if key starts with gsk_
  if (apiKey && apiKey.startsWith('gsk_')) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b',
          messages: [
            {
              role: 'system',
              content:
                'You are an expert UGC ad analyst. Analyze the ad URL and return a JSON object with fields: hookScore, hookType, emotionalTrigger, openingHook, platform, estimatedDuration, pacing, targetAudience, ctaType, scriptStructure (array of {label, duration, content, note}), soraPrompts (5 items), ugcScript. Return ONLY valid JSON.',
            },
            { role: 'user', content: `Analyze this viral ad: ${url}` },
          ],
          response_format: { type: 'json_object' },
        }),
      });
      if (response.ok) {
        const data = await response.json();
        const parsed = JSON.parse(data.choices[0].message.content);
        return {
          result: {
            id: `groq_${Date.now()}`,
            url,
            analyzedAt: new Date().toISOString(),
            ...parsed,
          },
          isDemo: false,
        };
      }
    } catch {
      // Fall through to demo
    }
  }

  // Try direct OpenAI if API key provided
  if (apiKey && !apiKey.startsWith('sk-your') && apiKey.startsWith('sk-')) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content:
                'You are an expert UGC ad analyst. Analyze the ad URL and return a JSON object with fields: hookScore, hookType, emotionalTrigger, openingHook, platform, estimatedDuration, pacing, targetAudience, ctaType, scriptStructure (array of {label, duration, content, note}), soraPrompts (5 items), ugcScript. Return ONLY valid JSON.',
            },
            { role: 'user', content: `Analyze this viral ad: ${url}` },
          ],
          response_format: { type: 'json_object' },
        }),
      });
      if (response.ok) {
        const data = await response.json();
        const parsed = JSON.parse(data.choices[0].message.content);
        return {
          result: {
            id: `analysis_${Date.now()}`,
            url,
            analyzedAt: new Date().toISOString(),
            ...parsed,
          },
          isDemo: false,
        };
      }
    } catch {
      // Fall through to demo
    }
  }

  // Demo mode
  await new Promise((r) => setTimeout(r, 2000)); // Simulate loading
  const demoData = getDemoData(url);
  return {
    result: {
      id: `demo_${Date.now()}`,
      url,
      analyzedAt: new Date().toISOString(),
      ...demoData,
    },
    isDemo: true,
  };
}
