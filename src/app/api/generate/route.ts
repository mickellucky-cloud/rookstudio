import { NextRequest, NextResponse } from "next/server";
import { getSystemPrompt, NVIDIA_BASE_URL } from "@/lib/nvidia";
import {
  EFFECT_PRESETS,
  STYLE_THEMES,
  getDefaultEffectForScene,
} from "@/lib/effectsLibrary";
import { EffectPresetId, MotionStyle, SceneType, ShotDirection } from "@/types";

export const maxDuration = 60;

const VALID_SCENES: SceneType[] = [
  "parallax",
  "newspaper",
  "kinetic-stat",
  "conspiracy-board",
  "map",
];

const VALID_EFFECTS = new Set<string>(EFFECT_PRESETS.map((e) => e.id));

function normalizeShots(
  rawShots: any[],
  style: MotionStyle,
  topic: string
): ShotDirection[] {
  let cursorSec = 0;
  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return rawShots.map((s, idx) => {
    const sceneType: SceneType = VALID_SCENES.includes(s.sceneType)
      ? s.sceneType
      : VALID_SCENES[idx % VALID_SCENES.length];

    const effectPreset: EffectPresetId =
      s.effectPreset && VALID_EFFECTS.has(s.effectPreset)
        ? (s.effectPreset as EffectPresetId)
        : getDefaultEffectForScene(style, sceneType);

    const duration =
      typeof s.duration === "number" && s.duration >= 1 && s.duration <= 60
        ? Math.round(s.duration)
        : 4;

    const start = cursorSec;
    const end = cursorSec + duration;
    cursorSec = end;

    return {
      id: s.id || `shot-${idx + 1}`,
      timestamp: `${fmt(start)} - ${fmt(end)}`,
      duration,
      title: s.title || `Scene 0${idx + 1}`,
      sceneType,
      effectPreset,
      narration:
        s.narration ||
        `Investigative breakdown of ${topic} in ${STYLE_THEMES[style].name}.`,
      visualPrompt:
        s.visualPrompt ||
        `${STYLE_THEMES[style].name} composition with ${effectPreset} overlay`,
      cameraMovement: s.cameraMovement || "Precision 2.5D camera push-in",
      sfx: s.sfx || "Sub bass pulse + telemetry click",
      headlineText: s.headlineText || topic.toUpperCase(),
      statValue: s.statValue ? String(s.statValue) : "84.2",
      locationCoords: s.locationCoords || "GLOBAL HUB · 45.46° N, 9.19° E",
    };
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      topic = "The Secret Monopoly of Luxottica",
      style = "magnates",
      model = "deepseek-ai/deepseek-r1",
      customApiKey,
    } = body as {
      topic?: string;
      style?: MotionStyle;
      model?: string;
      customApiKey?: string;
    };

    const validStyle: MotionStyle =
      style === "fern" || style === "vox" || style === "magnates"
        ? style
        : "magnates";

    const apiKey =
      customApiKey?.trim() ||
      req.headers.get("x-nvidia-key") ||
      process.env.NVIDIA_API_KEY;

    if (!apiKey) {
      return NextResponse.json(getFallbackProject(topic, validStyle));
    }

    const systemPrompt = getSystemPrompt(validStyle, topic);

    const response = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Generate a complete high-retention documentary explainer for @byrook_tv on this topic: "${topic}" using the "${STYLE_THEMES[validStyle].name}" theme. Provide a captivating 3-act script with timestamps, sound effects, and 4 to 5 shots that each specify a sceneType and effectPreset from the library. Output pure JSON only.`,
          },
        ],
        temperature: 0.6,
        max_tokens: 3500,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("NVIDIA API Error:", errorText);
      return NextResponse.json(
        {
          error: `NVIDIA API responded with status ${response.status}: ${errorText}`,
          fallback: getFallbackProject(topic, validStyle),
        },
        { status: 200 }
      );
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || "";

    let thinking = "";
    let cleanJson = rawContent;

    const thinkMatch = rawContent.match(/<think>([\s\S]*?)<\/think>/);
    if (thinkMatch) {
      thinking = thinkMatch[1].trim();
      cleanJson = rawContent.replace(/<think>[\s\S]*?<\/think>/, "").trim();
    }

    try {
      const jsonStart = cleanJson.indexOf("{");
      const jsonEnd = cleanJson.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1) {
        cleanJson = cleanJson.slice(jsonStart, jsonEnd + 1);
      }
      const parsed = JSON.parse(cleanJson);
      const normalizedShots = Array.isArray(parsed.shots)
        ? normalizeShots(parsed.shots, validStyle, topic)
        : getFallbackProject(topic, validStyle).shots;

      return NextResponse.json({
        ...parsed,
        shots: normalizedShots,
        thinking:
          thinking ||
          parsed.thinking ||
          `${STYLE_THEMES[validStyle].name} retention & visual effect routing applied.`,
      });
    } catch (parseErr) {
      console.warn(
        "JSON Parse Error on raw model output, using fallback:",
        parseErr
      );
      return NextResponse.json(getFallbackProject(topic, validStyle));
    }
  } catch (err: any) {
    console.error("Route error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}

function getFallbackProject(topic: string, style: MotionStyle) {
  const theme = STYLE_THEMES[style] || STYLE_THEMES.magnates;
  const upperTopic = (topic || "THE UNTOUCHABLE MONOPOLY").toUpperCase();

  const rawShots = [
    {
      id: "shot-1",
      duration: 4,
      title: "The Cold Open Paradox",
      sceneType: "parallax" as SceneType,
      effectPreset: getDefaultEffectForScene(style, "parallax"),
      narration: `How ${topic} silently rewrote the rules of global power while hiding in plain sight.`,
      visualPrompt: `${theme.name} 2.5D subject portrait with ${getDefaultEffectForScene(style, "parallax")} atmosphere`,
      cameraMovement: "Slow 2.5D push-in on subject eye line",
      sfx: "Sub bass pulse + analog tape hiss",
      headlineText: upperTopic.slice(0, 28),
    },
    {
      id: "shot-2",
      duration: 4,
      title: "The Unsealed Filing",
      sceneType: "newspaper" as SceneType,
      effectPreset: getDefaultEffectForScene(style, "newspaper"),
      narration:
        "Internal disclosures reveal how competitors were systematically acquired or locked out of distribution.",
      visualPrompt: `${theme.name} archival press reveal with ${getDefaultEffectForScene(style, "newspaper")}`,
      cameraMovement: "Dutch tilt and zoom to highlighted clause",
      sfx: "Paper rustle + heavy typewriter click",
      headlineText: `CONFIDENTIAL DOSSIER: ${upperTopic.slice(0, 24)}`,
    },
    {
      id: "shot-3",
      duration: 4,
      title: "The Quantitative Reality",
      sceneType: "kinetic-stat" as SceneType,
      effectPreset: getDefaultEffectForScene(style, "kinetic-stat"),
      narration:
        "A single dominant architecture capturing 84.2% of total industry margin.",
      visualPrompt: `${theme.name} telemetry counter with ${getDefaultEffectForScene(style, "kinetic-stat")}`,
      cameraMovement: "Orbital grid drift",
      sfx: "Clean digital telemetry chirp",
      statValue: "84.2",
    },
    {
      id: "shot-4",
      duration: 4,
      title: "Global Footprint & Corridors",
      sceneType: "map" as SceneType,
      effectPreset: getDefaultEffectForScene(style, "map"),
      narration:
        "From European headquarters to offshore clearing houses, every supply corridor connects back to one hub.",
      visualPrompt: `${theme.name} geopolitical vector map with ${getDefaultEffectForScene(style, "map")}`,
      cameraMovement: "Satellite descend onto primary coordinate hub",
      sfx: "Sonar ping + data stream hum",
      headlineText: upperTopic.slice(0, 24),
      locationCoords: "MILAN · ZURICH · NEW YORK",
    },
    {
      id: "shot-5",
      duration: 4,
      title: "The Controlling Nexus",
      sceneType: "conspiracy-board" as SceneType,
      effectPreset: getDefaultEffectForScene(style, "conspiracy-board"),
      narration:
        "Behind dozens of seemingly independent names sits the exact same boardroom.",
      visualPrompt: `${theme.name} forensic entity network with ${getDefaultEffectForScene(style, "conspiracy-board")}`,
      cameraMovement: "Forensic pan across connected nodes",
      sfx: "Heavy dossier slam + low synth drone",
      headlineText: upperTopic.slice(0, 22),
    },
  ];

  return {
    title: topic,
    hook: `Everything you've been told about ${topic} is an engineered illusion—and the numbers prove it.`,
    thinking: `Theme & Effects Routing (${theme.name}):\n1. Selected "${theme.defaultEffects.join('", "')}" from the Effects Library to match ${theme.inspiration}.\n2. Sequenced 5 distinct Remotion engines (Parallax -> Newspaper -> Kinetic Stat -> Geo Map -> Evidence Nexus) for maximum visual retention.`,
    fullScript: `[0:00 - 0:04] [SFX: Cinematic sub-bass rumble]\n"How did ${topic} silently capture an entire industry while convincing the public they still had a choice?"\n\n[0:04 - 0:08] [SFX: Typewriter click + paper rustle]\n"Unsealed filings show a calculated strategy of vertical integration and quiet buyouts."\n\n[0:08 - 0:12] [SFX: Clean digital telemetry chirp]\n"At peak consolidation, over 84.2% of market distribution flowed through a single bottleneck."\n\n[0:12 - 0:16] [SFX: Sonar ping + data hum]\n"Across three continents, supply corridors and retail networks were locked into exclusive agreements."\n\n[0:16 - 0:20] [SFX: Heavy typewriter slam]\n"Behind dozens of competing storefronts sat the exact same boardroom."`,
    shots: normalizeShots(rawShots, style, topic),
  };
}
