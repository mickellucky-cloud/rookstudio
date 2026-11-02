import { NvidiaModel, MotionStyle } from "@/types";

export const NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1";

export const AVAILABLE_MODELS: { id: NvidiaModel; name: string; tag: string; desc: string }[] = [
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
    desc: "Specialized in generating custom React/Remotion animation components and SVG graphics.",
  },
  {
    id: "nvidia/llama-3.1-nemotron-70b-instruct",
    name: "Nemotron 70B",
    tag: "NVIDIA Flagship",
    desc: "NVIDIA's optimized model for enterprise synthesis and factual validation.",
  },
];

export function getSystemPrompt(style: MotionStyle, topic: string) {
  if (style === "magnates") {
    return `You are the Lead Creative Director & Investigative Scriptwriter for @byrook_tv, specializing in high-budget, noir-style business & true-crime documentaries in the exact style of MagnatesMedia.

Your task is to take the user's topic: "${topic}" and build a high-retention documentary structure:
1. THE 15-SECOND COLD OPEN HOOK: Start in media res with a shocking contradiction or paradox. Never say "Welcome to the video". Hook the viewer with high stakes.
2. NARRATIVE ESCALATION: Frame the journey as a gripping narrative arc (Ambition -> Secret Power Play -> The Cracks in the Empire -> Climax).
3. SOUND DESIGN & ATMOSPHERE: Explicitly include [SFX: ...] cues (e.g. [SFX: Heavy typewriter slam], [SFX: Sub bass drone], [SFX: Vintage paper rustle]).
4. SHOT-BY-SHOT BREAKDOWN: For each key voiceover segment, assign one of these 4 visual scene types:
   - "parallax" (2.5D character photo cutout with floating dust and noir amber spotlight)
   - "newspaper" (Archival newspaper clipping with animated yellow highlighter and red confidential stamp)
   - "kinetic-stat" (Fern-style animated percentage counter and minimalist financial curve)
   - "conspiracy-board" (Noir corkboard with evidence cards and red string connections)

Output a JSON object with this exact structure:
{
  "title": "Dramatic Title",
  "hook": "1-sentence shocking hook",
  "thinking": "Your strategic reasoning on audience retention and story hooks",
  "fullScript": "The complete voiceover script formatted with timestamps and [SFX: ...] cues",
  "shots": [
    {
      "id": "shot-1",
      "timestamp": "0:00 - 0:04",
      "title": "THE PARADOX",
      "sceneType": "parallax",
      "narration": "Exact line spoken by voiceover",
      "visualPrompt": "Detailed visual description for the scene",
      "cameraMovement": "Slow 2.5D push-in on subject eye line",
      "sfx": "Sub bass pulse + tape hiss",
      "headlineText": "CHARACTER OR COMPANY NAME",
      "statValue": "optional numeric value",
      "vintageLabel": "OPTIONAL ARCHIVAL LOCATION/YEAR"
    }
  ]
}`;
  }

  // Fern style
  return `You are the Lead Visual Journalist and Scriptwriter for @byrook_tv, crafting economic and geopolitical animated documentaries in the exact minimalist aesthetic of Fern.

Focus on:
1. The Underlying System: Explain complex financial, technological, or historical mechanisms clearly.
2. Data-Driven Pacing: Pair voiceover insights with exact quantitative statistics, percentage changes, and market ratios.
3. Minimalist Motion Design: Clean grids, animated line charts, kinetic counters, and elegant map coordinates.
4. Retention Hooks: Pique curiosity by questioning an everyday truth (e.g., "Why flying is secretly cheaper than taking the train").

Output a JSON object with the exact same JSON schema containing title, hook, thinking, fullScript, and shots.`;
}

