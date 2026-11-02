import { EffectPresetId, MotionStyle, SceneType } from "@/types";

export interface StyleThemeProfile {
  id: MotionStyle;
  name: string;
  shortName: string;
  shortLabel: string;
  tagline: string;
  description: string;
  inspiration: string;
  palette: {
    canvas: string;
    surface: string;
    accent: string;
    primaryAccent: string;
    secondaryAccent: string;
    gridColor: string;
    textPrimary: string;
    textMuted: string;
    paperBg: string;
  };
  typography: {
    headingFont: string;
    monoFont: string;
    letterSpacing: string;
  };
  signatureOverlay: string;
  signatureOverlays: string[];
  defaultEffects: EffectPresetId[];
  aiDirectives: string;
}

export interface EffectPresetSpec {
  id: EffectPresetId;
  name: string;
  badge: string;
  category: "Atmosphere" | "Telemetry" | "Editorial" | "Optical";
  recommendedStyles: MotionStyle[];
  bestForScenes: SceneType[];
  badgeColor: string;
  description: string;
  whenToUse: string;
}

export interface SceneEngineSpec {
  id: SceneType;
  name: string;
  shortLabel: string;
  description: string;
  defaultEffectByStyle: Record<MotionStyle, EffectPresetId>;
  whenToUse: string;
}

export const STYLE_THEMES: Record<MotionStyle, StyleThemeProfile> = {
  magnates: {
    id: "magnates",
    name: "Magnates Noir",
    shortName: "Magnates Noir",
    shortLabel: "Noir Cinema",
    tagline: "Dark Investigative Cinema & Monopoly Thrillers",
    description:
      "Chiaroscuro corporate thriller aesthetics with 2.39:1 anamorphic letterbox framing, volumetric amber spotlights, 35mm archival grain, and crimson forensic evidence boards.",
    inspiration: "MagnatesMedia / Fincher Noir",
    palette: {
      canvas: "#050608",
      surface: "#0e1017",
      accent: "#f59e0b",
      primaryAccent: "#f59e0b",
      secondaryAccent: "#ef4444",
      gridColor: "rgba(245, 158, 11, 0.25)",
      textPrimary: "#ffffff",
      textMuted: "#a1a1aa",
      paperBg: "#ebe4d5",
    },
    typography: {
      headingFont: "var(--font-grotesk), sans-serif",
      monoFont: "var(--font-mono), monospace",
      letterSpacing: "3px",
    },
    signatureOverlay: "2.39:1 Anamorphic Letterbox + Volumetric Amber Spotlight",
    signatureOverlays: [
      "2.39:1 Anamorphic Letterbox",
      "Volumetric Amber Spotlight",
      "35mm Archival Film Grain",
      "Forensic Red-String Nexus",
    ],
    defaultEffects: [
      "dust-vignette",
      "spotlight-sweep",
      "film-grain-35mm",
      "red-string-pulse",
    ],
    aiDirectives:
      "Frame the topic as a high-stakes corporate thriller, secret cartel, or covert empire. Favor 'dust-vignette' on character portraits, 'spotlight-sweep' on leaked press clippings, 'film-grain-35mm' on historical milestones, and 'red-string-pulse' on shell-company networks.",
  },
  fern: {
    id: "fern",
    name: "Fern Economic",
    shortName: "Fern Telemetry",
    shortLabel: "3D Telemetry",
    tagline: "Minimalist 3D Grid, Geopolitical & Quantitative Telemetry",
    description:
      "Precision technical intelligence featuring isometric CAD coordinate grids, phosphor CRT telemetry counters, orbital radar sweeps, and declassified microfiche overlays.",
    inspiration: "Fern / Bloomberg Originals",
    palette: {
      canvas: "#03070e",
      surface: "#091322",
      accent: "#06b6d4",
      primaryAccent: "#06b6d4",
      secondaryAccent: "#d4ff00",
      gridColor: "rgba(6, 182, 212, 0.28)",
      textPrimary: "#f8fafc",
      textMuted: "#94a3b8",
      paperBg: "#0b1626",
    },
    typography: {
      headingFont: "var(--font-grotesk), sans-serif",
      monoFont: "var(--font-mono), monospace",
      letterSpacing: "2px",
    },
    signatureOverlay: "Isometric Coordinate Grid + Live HUD Corner Telemetry",
    signatureOverlays: [
      "Isometric Coordinate Grid",
      "Live HUD Corner Telemetry",
      "Orbital Radar Sweep",
      "Declassified Microfiche Scan",
    ],
    defaultEffects: [
      "crt-telemetry",
      "radar-sweep",
      "thermal-blueprint",
      "microfiche-grid",
    ],
    aiDirectives:
      "Frame the topic as a precision systems breakdown driven by hard numbers, supply-chain logistics, and market mechanics. Favor 'crt-telemetry' on data counters, 'radar-sweep' on geopolitical maps, 'thermal-blueprint' on structural diagrams, and 'microfiche-grid' on archival leaks.",
  },
  vox: {
    id: "vox",
    name: "Vox Editorial",
    shortName: "Vox Explainer",
    shortLabel: "Editorial Print",
    tagline: "Tactile Newsprint Halftone, Marker Callouts & Collage",
    description:
      "Investigative newsroom visual journalism combining tactile halftone dot matrices, electric-lime marker strokes, archival broadsheet cutouts, and kinetic map trajectories.",
    inspiration: "Vox Borders / Johnny Harris / NYT Visual Investigations",
    palette: {
      canvas: "#101114",
      surface: "#1a1b20",
      accent: "#d4ff00",
      primaryAccent: "#d4ff00",
      secondaryAccent: "#3b82f6",
      gridColor: "rgba(212, 255, 0, 0.25)",
      textPrimary: "#fafaf9",
      textMuted: "#a8a29e",
      paperBg: "#f5f2eb",
    },
    typography: {
      headingFont: "var(--font-grotesk), sans-serif",
      monoFont: "var(--font-mono), monospace",
      letterSpacing: "1px",
    },
    signatureOverlay: "Print Halftone Matrix + Acid-Lime Marker Callouts",
    signatureOverlays: [
      "Newsprint Halftone Matrix",
      "Acid-Lime Marker Callouts",
      "Broadsheet Cutout Collage",
      "Anamorphic Lens Streak",
    ],
    defaultEffects: [
      "halftone-editorial",
      "highlighter-beam",
      "anamorphic-flare",
      "chromatic-glitch",
    ],
    aiDirectives:
      "Frame the topic as an investigative journalistic explainer with tactile paper cutouts, bold neon marker underlines, and map trajectories. Favor 'halftone-editorial' on portraits, 'highlighter-beam' on documents, 'anamorphic-flare' on key stats, and 'radar-sweep' on maps.",
  },
};

export const EFFECT_PRESETS: EffectPresetSpec[] = [
  {
    id: "dust-vignette",
    name: "Noir Dust & Vignette",
    badge: "NOIR DUST",
    category: "Atmosphere",
    recommendedStyles: ["magnates"],
    bestForScenes: ["parallax", "conspiracy-board"],
    badgeColor: "#f59e0b",
    description:
      "Floating illuminated amber dust motes with deep 2.39:1 cinema vignette.",
    whenToUse:
      "Cold opens, founder profiles, and atmospheric character introductions.",
  },
  {
    id: "spotlight-sweep",
    name: "Interrogation Spotlight",
    badge: "SPOTLIGHT",
    category: "Optical",
    recommendedStyles: ["magnates", "vox"],
    bestForScenes: ["newspaper", "parallax", "conspiracy-board"],
    badgeColor: "#eab308",
    description:
      "Dynamic volumetric light cone sweeping across archival evidence.",
    whenToUse:
      "Revealing leaked documents, smoking-gun contracts, or secret clauses.",
  },
  {
    id: "film-grain-35mm",
    name: "35mm Archival Film",
    badge: "35MM FILM",
    category: "Atmosphere",
    recommendedStyles: ["magnates", "vox"],
    bestForScenes: ["parallax", "newspaper"],
    badgeColor: "#d97706",
    description:
      "Procedural celluloid flicker, vertical frame scratches, and warm sepia grade.",
    whenToUse: "Historical flashbacks, origin stories, and 20th-century archives.",
  },
  {
    id: "red-string-pulse",
    name: "Forensic Nexus Pulse",
    badge: "NEXUS PULSE",
    category: "Atmosphere",
    recommendedStyles: ["magnates"],
    bestForScenes: ["conspiracy-board", "map"],
    badgeColor: "#ef4444",
    description:
      "Pulsing crimson target reticles and forensic laser scanlines.",
    whenToUse:
      "Connecting shell companies, monopolies, and boardroom conspiracies.",
  },
  {
    id: "crt-telemetry",
    name: "CRT Terminal Scanlines",
    badge: "CRT SCAN",
    category: "Telemetry",
    recommendedStyles: ["fern"],
    bestForScenes: ["kinetic-stat", "map"],
    badgeColor: "#06b6d4",
    description:
      "High-frequency horizontal phosphor scanlines with live frame telemetry.",
    whenToUse:
      "Financial metrics, algorithmic trading, and market-share surges.",
  },
  {
    id: "radar-sweep",
    name: "Orbital Radar Sweep",
    badge: "RADAR",
    category: "Telemetry",
    recommendedStyles: ["fern", "vox"],
    bestForScenes: ["map", "kinetic-stat", "conspiracy-board"],
    badgeColor: "#10b981",
    description:
      "Rotating 360-degree geopolitical radar beam with concentric range rings.",
    whenToUse:
      "Global supply chains, flight paths, territory control, and trade routes.",
  },
  {
    id: "thermal-blueprint",
    name: "Blueprint Crosshair Grid",
    badge: "BLUEPRINT",
    category: "Telemetry",
    recommendedStyles: ["fern"],
    bestForScenes: ["kinetic-stat", "parallax", "map"],
    badgeColor: "#38bdf8",
    description:
      "Precision CAD measurement ticks, engineering crosshairs, and cyan aura.",
    whenToUse:
      "Explaining industrial engineering, unit economics, or cost breakdowns.",
  },
  {
    id: "microfiche-grid",
    name: "Declassified Microfiche",
    badge: "MICROFICHE",
    category: "Telemetry",
    recommendedStyles: ["fern", "magnates"],
    bestForScenes: ["newspaper", "conspiracy-board"],
    badgeColor: "#22d3ee",
    description:
      "Optical reader calibration marks, document index stamps, and cold scan sweep.",
    whenToUse:
      "Regulatory filings, SEC disclosures, and intelligence briefings.",
  },
  {
    id: "halftone-editorial",
    name: "Print Halftone Matrix",
    badge: "HALFTONE",
    category: "Editorial",
    recommendedStyles: ["vox"],
    bestForScenes: ["parallax", "newspaper"],
    badgeColor: "#d4ff00",
    description:
      "Tactile newsprint dot-matrix overlay with high-contrast editorial framing.",
    whenToUse:
      "Journalistic explainers, cultural shifts, and media breakdowns.",
  },
  {
    id: "highlighter-beam",
    name: "Neon Marker Callout",
    badge: "MARKER",
    category: "Editorial",
    recommendedStyles: ["vox", "magnates"],
    bestForScenes: ["newspaper", "kinetic-stat"],
    badgeColor: "#a3e635",
    description:
      "Animated electric-lime marker strokes emphasizing key quotes and figures.",
    whenToUse:
      "Highlighting contradictions, fine-print traps, or decisive statistics.",
  },
  {
    id: "anamorphic-flare",
    name: "Anamorphic Lens Streak",
    badge: "LENS FLARE",
    category: "Optical",
    recommendedStyles: ["vox", "fern", "magnates"],
    bestForScenes: ["parallax", "kinetic-stat"],
    badgeColor: "#60a5fa",
    description:
      "Horizontal cinema lens flare streak moving across the focal plane.",
    whenToUse: "Climax reveals, billion-dollar valuations, and hero statements.",
  },
  {
    id: "chromatic-glitch",
    name: "Signal Aberration",
    badge: "GLITCH RGB",
    category: "Optical",
    recommendedStyles: ["fern", "vox"],
    bestForScenes: ["conspiracy-board", "kinetic-stat"],
    badgeColor: "#f43f5e",
    description:
      "Subtle RGB channel split and digital sync lines for cyber or crisis beats.",
    whenToUse:
      "Market crashes, cyber heists, fraud collapses, and systemic shocks.",
  },
];

export const EFFECT_PRESET_LIST: EffectPresetSpec[] = EFFECT_PRESETS;

export const EFFECT_PRESET_MAP: Record<EffectPresetId, EffectPresetSpec> =
  EFFECT_PRESETS.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {} as Record<EffectPresetId, EffectPresetSpec>);

export const SCENE_ENGINES: SceneEngineSpec[] = [
  {
    id: "parallax",
    name: "2.5D Parallax Subject Portrait",
    shortLabel: "Parallax",
    description:
      "Multi-plane depth portrait with animated insignia, spotlight, and lower-third.",
    defaultEffectByStyle: {
      magnates: "dust-vignette",
      fern: "thermal-blueprint",
      vox: "halftone-editorial",
    },
    whenToUse: "Founders, CEOs, key protagonists, or iconic brand introductions.",
  },
  {
    id: "newspaper",
    name: "Archival Press & Document Reveal",
    shortLabel: "Press Leak",
    description:
      "3D tilted broadsheet or regulatory filing with animated highlighter and stamp.",
    defaultEffectByStyle: {
      magnates: "spotlight-sweep",
      fern: "microfiche-grid",
      vox: "highlighter-beam",
    },
    whenToUse:
      "Court filings, investigative journalism leaks, and historical headlines.",
  },
  {
    id: "kinetic-stat",
    name: "Kinetic Telemetry & Area Curve",
    shortLabel: "Kinetic Stat",
    description:
      "Spring-driven numeric counter paired with an animated vector growth curve.",
    defaultEffectByStyle: {
      magnates: "anamorphic-flare",
      fern: "crt-telemetry",
      vox: "highlighter-beam",
    },
    whenToUse:
      "Market share percentages, revenue multiples, and economic comparisons.",
  },
  {
    id: "conspiracy-board",
    name: "Forensic Evidence & Entity Nexus",
    shortLabel: "Evidence",
    description:
      "Interactive network linking a central holding entity to subsidiary nodes.",
    defaultEffectByStyle: {
      magnates: "red-string-pulse",
      fern: "chromatic-glitch",
      vox: "spotlight-sweep",
    },
    whenToUse:
      "Ownership webs, shell corporations, acquisitions, and cartel structures.",
  },
  {
    id: "map",
    name: "Geopolitical & Supply Chain Map",
    shortLabel: "Geo Map",
    description:
      "Vector world/regional coordinate map with animated trade arcs and target lock.",
    defaultEffectByStyle: {
      magnates: "red-string-pulse",
      fern: "radar-sweep",
      vox: "halftone-editorial",
    },
    whenToUse:
      "Global expansion, offshore tax havens, headquarters, and trade routes.",
  },
];

export function getDefaultEffectForScene(
  style: MotionStyle,
  sceneType: SceneType
): EffectPresetId {
  const engine = SCENE_ENGINES.find((e) => e.id === sceneType);
  if (engine) {
    return engine.defaultEffectByStyle[style];
  }
  return STYLE_THEMES[style].defaultEffects[0];
}

export function getEffectPresetById(id?: EffectPresetId): EffectPresetSpec {
  return (
    EFFECT_PRESETS.find((e) => e.id === id) ||
    EFFECT_PRESETS[0]
  );
}

export function buildModelEffectsCatalogPrompt(style: MotionStyle): string {
  const theme = STYLE_THEMES[style];
  const sceneLines = SCENE_ENGINES.map(
    (s) =>
      `  - "${s.id}" (${s.name}): ${s.whenToUse} [Recommended effect for ${theme.name}: "${s.defaultEffectByStyle[style]}"]`
  ).join("\n");

  const effectLines = EFFECT_PRESETS.map(
    (e) =>
      `  - "${e.id}" (${e.name} — ${e.category}): ${e.whenToUse}`
  ).join("\n");

  return `ACTIVE VIDEO STYLE THEME: ${theme.name} (${theme.tagline})
THEME DIRECTIVE: ${theme.aiDirectives}

AVAILABLE REMOTION SCENE ENGINES (choose variety across shots — include at least 4 distinct sceneType values):
${sceneLines}

AVAILABLE VISUAL EFFECT PRESETS (assign the best matching "effectPreset" ID to EVERY shot based on its narrative function):
${effectLines}`;
}
