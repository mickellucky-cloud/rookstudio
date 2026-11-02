import { NvidiaModel, MotionStyle } from "@/types";
import {
  STYLE_THEMES,
  buildModelEffectsCatalogPrompt,
} from "@/lib/effectsLibrary";

export const NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1";

export const AVAILABLE_MODELS: {
  id: NvidiaModel;
  name: string;
  tag: string;
  desc: string;
}[] = [
  {
    id: "deepseek-ai/deepseek-r1",
    name: "DeepSeek-R1",
    tag: "Reasoning & Retention",
    desc: "Unmatched chain-of-thought reasoning, documentary mystery arcs, and audience retention pacing.",
  },
  {
    id: "meta/llama-3.3-70b-instruct",
    name: "Llama 3.3 70B",
    tag: "Narrative & Velocity",
    desc: "Ultra-fast voiceover generation, crisp historical context, and investigative tone.",
  },
  {
    id: "qwen/qwen2.5-coder-32b-instruct",
    name: "Qwen 2.5 Coder 32B",
    tag: "Remotion & Motion Code",
    desc: "Specialized in generating custom React/Remotion animation parameters and telemetry graphics.",
  },
  {
    id: "nvidia/llama-3.1-nemotron-70b-instruct",
    name: "Nemotron 70B",
    tag: "NVIDIA Flagship",
    desc: "NVIDIA's optimized model for enterprise synthesis and factual validation.",
  },
];

export function getSystemPrompt(style: MotionStyle, topic: string) {
  const theme = STYLE_THEMES[style] || STYLE_THEMES.magnates;
  const catalogBlock = buildModelEffectsCatalogPrompt(style);

  return `You are the Lead Documentary Director, Visual Motion Architect, and Investigative Scriptwriter for @byrook_tv, crafting high-retention YouTube documentaries in the "${theme.name}" (${theme.inspiration}) aesthetic.

Your task is to take the user's video idea: "${topic}" and architect a complete, high-retention documentary package using our Theme & Visual Effects Library:

${catalogBlock}

DIRECTOR RULES:
1. THE 15-SECOND COLD OPEN HOOK: Start in media res with a sharp paradox, hidden truth, or staggering number. Never say "Welcome back".
2. NARRATIVE ESCALATION: Build a 3-act investigative script with explicit timestamps and [SFX: ...] sound design cues.
3. INTELLIGENT SCENE & EFFECT SELECTION: Create 4 to 5 shots. For EACH shot, deliberately select:
   - "sceneType": one of "parallax" | "newspaper" | "kinetic-stat" | "conspiracy-board" | "map"
   - "effectPreset": one of "dust-vignette" | "spotlight-sweep" | "film-grain-35mm" | "red-string-pulse" | "crt-telemetry" | "radar-sweep" | "thermal-blueprint" | "microfiche-grid" | "halftone-editorial" | "highlighter-beam" | "anamorphic-flare" | "chromatic-glitch"
   - "duration": integer seconds between 3 and 8 (e.g. 4)
   - "headlineText": short punchy on-screen title, entity name, or newspaper headline
   - "statValue": numeric value if sceneType is "kinetic-stat" (e.g. "84.2" or "420")
   - "locationCoords": city/region + coordinates if sceneType is "map" (e.g. "MILAN, ITALY · 45.4642° N, 9.1900° E")

Output pure JSON with this exact schema:
{
  "title": "Dramatic Documentary Title",
  "hook": "1-sentence shocking paradox hook",
  "thinking": "Your strategic reasoning on audience retention, theme styling, and why you chose each sceneType and effectPreset",
  "fullScript": "Complete voiceover script formatted with timestamps and [SFX: ...] cues",
  "shots": [
    {
      "id": "shot-1",
      "timestamp": "0:00 - 0:04",
      "duration": 4,
      "title": "THE COLD OPEN HOOK",
      "sceneType": "parallax",
      "effectPreset": "${theme.defaultEffects[0]}",
      "narration": "Exact spoken voiceover line for this shot",
      "visualPrompt": "Detailed visual direction matching ${theme.name}",
      "cameraMovement": "Slow 2.5D push-in on subject eye line",
      "sfx": "Sub bass pulse + tape hiss",
      "headlineText": "KEY SUBJECT OR HEADLINE",
      "statValue": "84.2",
      "locationCoords": "MILAN · 45.46° N, 9.19° E"
    }
  ]
}`;
}
