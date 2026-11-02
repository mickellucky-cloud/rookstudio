"use client";

import React, { useState, useEffect, useRef } from "react";
import { Header, WorkspaceSection } from "@/components/Header";
import { ScriptDirector } from "@/components/ScriptDirector";
import { VideoCanvas } from "@/components/VideoCanvas";
import { ShotCards } from "@/components/ShotCards";
import { TimelineTracks } from "@/components/TimelineTracks";
import { SettingsModal } from "@/components/SettingsModal";
import { ExportModal } from "@/components/ExportModal";
import {
  EffectPresetId,
  NvidiaModel,
  MotionStyle,
  ShotDirection,
} from "@/types";
import { AVAILABLE_MODELS } from "@/lib/nvidia";
import {
  STYLE_THEMES,
  EFFECT_PRESET_LIST,
  getDefaultEffectForScene,
} from "@/lib/effectsLibrary";
import {
  Plus,
  Sparkles,
  RectangleHorizontal,
  ArrowUp,
  ChevronRight,
  Cpu,
  RotateCcw,
  Check,
  Loader2,
  X,
  Wand2,
  Layers,
} from "lucide-react";

const STORAGE_KEY_PROJECT = "ROOKSTUDIO_PROJECT_STATE_V1";
const STORAGE_KEY_API = "ROOKSTUDIO_NVIDIA_KEY";

const DEFAULT_TOPIC = "The Secret Monopoly of Luxottica";
const DEFAULT_HOOK =
  "You think you have a choice when buying sunglasses. In reality, you've been buying from one man for 40 years.";
const DEFAULT_THINKING =
  "DeepSeek-R1 Retention Analysis:\n1. Hook: Attack the illusion of free consumer choice ($500 designer vs $20 frames have identical $4 factory costs).\n2. Narrative Tension: Escalating hostile takeovers of Oakley & LensCrafters.\n3. Climax: Reveal the global pricing cartel controlling 84% of department store optical shelves.";
const DEFAULT_SCRIPT = `[0:00 - 0:15] [SFX: Cinematic sub-bass rumble]\n"Walk into any shopping mall in America or Europe, and you'll see dozens of competing brands. Ray-Ban, Oakley, Chanel, Prada, Oliver Peoples.\n\n[0:15 - 0:35] [SFX: Typewriter click + paper rustle]\nWhat 99% of consumers never realize is that behind almost every single pair sits one single conglomerate in Milan, Italy.\n\n[0:35 - 1:00] [SFX: Clean digital telemetry chirp]\nThey don't just own the brands. They own the retail stores, the optical insurance, and the factories.\n\n[1:00 - 1:30] [SFX: Heavy typewriter slam]\nThis is the secret monopoly that quietly took over 80% of what the world sees."`;

const DEFAULT_SHOTS: ShotDirection[] = [
  {
    id: "shot-1",
    timestamp: "0:00 - 0:04",
    duration: 4,
    title: "The Cold Open Hook",
    sceneType: "parallax",
    effectPreset: "spotlight-sweep",
    narration:
      "How one Italian workshop silently took over 80% of the eyewear on Earth.",
    visualPrompt:
      "2.5D monochrome photo zoom with vintage amber lighting and floating dust particles",
    cameraMovement: "Slow 2.5D push-in on subject eye line",
    sfx: "Sub bass pulse + tape hiss",
    headlineText: "LEONARDO DEL VECCHIO",
  },
  {
    id: "shot-2",
    timestamp: "0:04 - 0:08",
    duration: 4,
    title: "The Exclusive Leak",
    sceneType: "newspaper",
    effectPreset: "highlighter-beam",
    narration:
      "Internal documents reveal competitor brands were systematically acquired or wiped out.",
    visualPrompt:
      "Archival Financial Times masthead with yellow highlighter sweep animation",
    cameraMovement: "Camera tilt and zoom to text",
    sfx: "Paper rustle + typewriter click",
    headlineText: "SECRET AGREEMENT EXPOSES 80% EYEWEAR MONOPOLY",
  },
  {
    id: "shot-3",
    timestamp: "0:08 - 0:12",
    duration: 4,
    title: "The Economic Reality",
    sceneType: "kinetic-stat",
    effectPreset: "anamorphic-flare",
    narration:
      "A single conglomerate controlling 84.2% of global retail points.",
    visualPrompt:
      "Minimalist Fern grid with animated percentage counter and rising curve",
    cameraMovement: "Subtle drift",
    sfx: "Clean digital telemetry chirp",
    statValue: "84.2",
  },
  {
    id: "shot-4",
    timestamp: "0:12 - 0:16",
    duration: 4,
    title: "The Conspiracy Board",
    sceneType: "conspiracy-board",
    effectPreset: "red-string-pulse",
    narration:
      "Behind dozens of household brand names sat the exact same boardroom.",
    visualPrompt:
      "Red strings connecting retail contracts to offshore shell subsidiaries",
    cameraMovement: "Pan across evidence cards",
    sfx: "Heavy typewriter slam",
    headlineText: "LUXOTTICA GROUP",
  },
];

function recalculateShotTimestamps(list: ShotDirection[]): ShotDirection[] {
  let cursorSec = 0;
  const fmt = (s: number) =>
    `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  return list.map((shot) => {
    const dur = Math.max(1, shot.duration ?? 4);
    const start = cursorSec;
    const end = cursorSec + dur;
    cursorSec = end;
    return {
      ...shot,
      duration: dur,
      timestamp: `${fmt(start)} - ${fmt(end)}`,
    };
  });
}

const TOPIC_PRESETS = [
  "The Secret Monopoly of Luxottica",
  "How Ryanair Secretly Became #1",
  "The Polymarket Billion Dollar Heist",
  "Why Red Bull is a Media Empire",
];

interface PersistedProjectState {
  topic: string;
  hook: string;
  thinkingTrace: string;
  fullScript: string;
  shots: ShotDirection[];
  style: MotionStyle;
  model: NvidiaModel;
  updatedAt: number;
}

export default function RookStudioHome() {
  const [model, setModel] = useState<NvidiaModel>("deepseek-ai/deepseek-r1");
  const [style, setStyle] = useState<MotionStyle>("magnates");
  const [apiKey, setApiKey] = useState<string>("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const [isStyleMenuOpen, setIsStyleMenuOpen] = useState(false);
  const [showPresetTray, setShowPresetTray] = useState(false);
  const [showEffectsLibrary, setShowEffectsLibrary] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [activeSection, setActiveSection] =
    useState<WorkspaceSection>("director");

  const composerRef = useRef<HTMLElement>(null);
  const storyboardRef = useRef<HTMLElement>(null);
  const monitorRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLElement>(null);

  // Project state
  const [topic, setTopic] = useState<string>(DEFAULT_TOPIC);
  const [hook, setHook] = useState<string>(DEFAULT_HOOK);
  const [thinkingTrace, setThinkingTrace] = useState<string>(DEFAULT_THINKING);
  const [fullScript, setFullScript] = useState<string>(DEFAULT_SCRIPT);
  const [shots, setShots] = useState<ShotDirection[]>(DEFAULT_SHOTS);

  const [activeShotIndex, setActiveShotIndex] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // 1. Hydrate project state & API key from localStorage on initial mount
  useEffect(() => {
    try {
      const savedKey = localStorage.getItem(STORAGE_KEY_API);
      if (savedKey) setApiKey(savedKey);

      const rawProject = localStorage.getItem(STORAGE_KEY_PROJECT);
      if (rawProject) {
        const parsed = JSON.parse(rawProject) as Partial<PersistedProjectState>;
        if (typeof parsed.topic === "string") setTopic(parsed.topic);
        if (typeof parsed.hook === "string") setHook(parsed.hook);
        if (typeof parsed.thinkingTrace === "string") {
          setThinkingTrace(parsed.thinkingTrace);
        }
        if (typeof parsed.fullScript === "string") {
          setFullScript(parsed.fullScript);
        }
        if (Array.isArray(parsed.shots) && parsed.shots.length > 0) {
          setShots(recalculateShotTimestamps(parsed.shots));
        }
        if (
          parsed.style === "magnates" ||
          parsed.style === "fern" ||
          parsed.style === "vox"
        ) {
          setStyle(parsed.style);
        }
        if (parsed.model) {
          setModel(parsed.model);
        }
        if (parsed.updatedAt) {
          setLastSavedTime(
            new Date(parsed.updatedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
          );
        }
      }
    } catch (err) {
      console.warn("Failed to restore project state from localStorage:", err);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // 2. Auto-save `shots` array and project state to localStorage on every change
  useEffect(() => {
    if (!isHydrated) return;

    try {
      const now = Date.now();
      const payload: PersistedProjectState = {
        topic,
        hook,
        thinkingTrace,
        fullScript,
        shots,
        style,
        model,
        updatedAt: now,
      };
      localStorage.setItem(STORAGE_KEY_PROJECT, JSON.stringify(payload));
      setLastSavedTime(
        new Date(now).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    } catch (err) {
      console.warn("Failed to auto-save project state to localStorage:", err);
    }
  }, [
    isHydrated,
    topic,
    hook,
    thinkingTrace,
    fullScript,
    shots,
    style,
    model,
  ]);

  const handleSaveKey = (key: string) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem(STORAGE_KEY_API, key);
    } else {
      localStorage.removeItem(STORAGE_KEY_API);
    }
  };

  const handleSelectStyleTheme = (nextStyle: MotionStyle) => {
    setStyle(nextStyle);
    // Sync each shot's effect preset with the new theme's recommended default for that scene engine
    setShots((prev) =>
      prev.map((shot) => ({
        ...shot,
        effectPreset: getDefaultEffectForScene(nextStyle, shot.sceneType),
      }))
    );
  };

  const handleApplyEffectToScene = (effectId: EffectPresetId) => {
    if (activeShotIndex !== null) {
      handleUpdateShot(activeShotIndex, { effectPreset: effectId });
    } else {
      // Apply to first shot and solo it so the user sees the effect immediately
      handleUpdateShot(0, { effectPreset: effectId });
      setActiveShotIndex(0);
    }
  };

  const handleUpdateShot = (
    index: number,
    updated: Partial<ShotDirection>
  ) => {
    setShots((prev) => {
      const next = prev.map((shot, idx) =>
        idx === index ? { ...shot, ...updated } : shot
      );
      return recalculateShotTimestamps(next);
    });
  };

  const handleReorderShots = (fromIndex: number, toIndex: number) => {
    if (
      fromIndex === toIndex ||
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= shots.length ||
      toIndex >= shots.length
    ) {
      return;
    }

    setShots((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return recalculateShotTimestamps(next);
    });

    setActiveShotIndex((prevActive) => {
      if (prevActive === null) return null;
      if (prevActive === fromIndex) return toIndex;
      if (
        fromIndex < toIndex &&
        prevActive > fromIndex &&
        prevActive <= toIndex
      ) {
        return prevActive - 1;
      }
      if (
        fromIndex > toIndex &&
        prevActive >= toIndex &&
        prevActive < fromIndex
      ) {
        return prevActive + 1;
      }
      return prevActive;
    });
  };

  const handleResetProject = () => {
    setTopic(DEFAULT_TOPIC);
    setHook(DEFAULT_HOOK);
    setThinkingTrace(DEFAULT_THINKING);
    setFullScript(DEFAULT_SCRIPT);
    setShots(DEFAULT_SHOTS);
    setStyle("magnates");
    setModel("deepseek-ai/deepseek-r1");
    setActiveShotIndex(null);
    setIsDrawerOpen(false);
  };

  const handleNavigateSection = (section: WorkspaceSection) => {
    setActiveSection(section);
    setIsDrawerOpen(false);
    if (section === "director") {
      composerRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else if (section === "storyboard") {
      storyboardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else if (section === "monitor") {
      monitorRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else if (section === "timeline") {
      timelineRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleGenerate = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          style,
          model,
          customApiKey: apiKey,
        }),
      });

      const data = await res.json();

      if (data.fallback) {
        setHook(data.fallback.hook || hook);
        setFullScript(data.fallback.fullScript || fullScript);
        setThinkingTrace(data.fallback.thinking || thinkingTrace);
        if (data.fallback.shots?.length) setShots(data.fallback.shots);
      } else {
        if (data.hook) setHook(data.hook);
        if (data.fullScript) setFullScript(data.fullScript);
        if (data.thinking) setThinkingTrace(data.thinking);
        if (data.shots?.length) setShots(data.shots);
      }
      setActiveShotIndex(null);
    } catch (err) {
      console.error("Generate error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentModelMeta = AVAILABLE_MODELS.find((m) => m.id === model);
  const currentTheme = STYLE_THEMES[style] || STYLE_THEMES.magnates;

  return (
    <div
      id="workspace-top"
      className="min-h-screen bg-[#0a0a0c] flex flex-col text-zinc-100"
    >
      {/* Higgsfield Minimalist Top Bar */}
      <Header
        activeSection={activeSection}
        onNavigateSection={handleNavigateSection}
        hasCustomKey={Boolean(apiKey)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onToggleDrawer={() => setIsDrawerOpen((prev) => !prev)}
      />

      {/* Slide-Over Quick Navigation & Project Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setIsDrawerOpen(false)}
          />
          <aside className="relative z-10 w-72 max-w-[85vw] bg-[#121216] border-r border-white/[0.08] p-5 flex flex-col justify-between h-full">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#d4ff00] flex items-center justify-center text-black font-extrabold">
                    R
                  </div>
                  <span className="font-heading text-lg font-bold text-white">
                    Rook Studio
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  aria-label="Close drawer"
                  className="min-h-[36px] min-w-[36px] rounded-full text-zinc-400 hover:text-white flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-1">
                <div className="text-[11px] font-mono text-zinc-500 px-3 pb-1">
                  STUDIO SECTIONS
                </div>
                {(
                  [
                    { id: "director", label: "Prompt Director" },
                    { id: "storyboard", label: "Scene Cards Showcase" },
                    { id: "monitor", label: "Cinema Monitor (60 FPS)" },
                    { id: "timeline", label: "Sequence Timeline & Script" },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavigateSection(item.id)}
                    className={`w-full min-h-[42px] px-3.5 py-2 rounded-xl text-left text-sm font-medium transition-colors flex items-center justify-between ${
                      activeSection === item.id
                        ? "bg-[#222228] text-[#d4ff00]"
                        : "text-zinc-300 hover:bg-white/[0.04]"
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </button>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-white/[0.07]">
                <div className="text-[11px] font-mono text-zinc-500 px-3">
                  DOCUMENTARY PRESETS
                </div>
                {TOPIC_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setTopic(preset);
                      setIsDrawerOpen(false);
                    }}
                    className="w-full px-3 py-2 rounded-xl text-left text-xs text-zinc-300 hover:text-white hover:bg-white/[0.04] transition-colors truncate"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/[0.07]">
              {lastSavedTime && (
                <div className="px-3 py-1.5 text-xs font-mono tabular-nums text-zinc-400 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#d4ff00]" />
                  <span>Auto-saved {lastSavedTime}</span>
                </div>
              )}
              <button
                type="button"
                onClick={handleResetProject}
                className="w-full min-h-[40px] px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-zinc-300 flex items-center gap-2 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Default Project</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content Container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10 sm:space-y-12">
        {/* SECTION 1: HIGGSFIELD-STYLE CENTERED HERO PROMPT COMPOSER */}
        <section
          ref={composerRef}
          className="max-w-2xl mx-auto flex flex-col items-center text-center pt-2 sm:pt-4"
        >
          {/* Centered Brand Mark & Title Lockup (Matching Higgsfield Ref) */}
          <div className="flex items-center justify-center gap-3 mb-6 sm:mb-7">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-[14px] bg-[#d4ff00] flex items-center justify-center shadow-sm shrink-0">
              <svg
                viewBox="0 0 32 32"
                className="w-7 h-7 text-zinc-950"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12 C 11 4, 15 24, 21 10 C 24 4, 26 24, 27 20" />
              </svg>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Rook Studio
            </h1>
          </div>

          {/* Rounded-3xl Dark Matte Omnibox Prompt Composer */}
          <div className="w-full bg-[#18181c] border border-white/[0.08] focus-within:border-white/[0.18] rounded-[28px] p-4 sm:p-5 shadow-2xl transition-colors text-left">
            <label htmlFor="documentary-topic-input" className="sr-only">
              Documentary prompt or topic
            </label>
            <textarea
              suppressHydrationWarning
              id="documentary-topic-input"
              rows={2}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
              placeholder="Create an investigative documentary trailer for..."
              className="w-full bg-transparent text-base sm:text-lg text-zinc-100 placeholder-zinc-500 focus:outline-none resize-none leading-snug mb-3"
            />

            {/* Optional Expandable Preset Chips Tray (Triggered by '+' Button) */}
            {showPresetTray && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-2 border-b border-white/[0.06] scrollbar-none">
                {TOPIC_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setTopic(preset);
                      setShowPresetTray(false);
                    }}
                    className={`min-h-[30px] px-3 py-1 rounded-full text-xs whitespace-nowrap shrink-0 transition-colors ${
                      topic === preset
                        ? "bg-[#d4ff00] text-zinc-950 font-semibold"
                        : "bg-[#25252b] text-zinc-300 hover:bg-[#2f2f36]"
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            )}

            {/* Composer Bottom Action Bar: [+] [✦ Style Theme] [▯ 16:9 · Model] ---> [↑] */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2 flex-wrap">
                {/* '+' Preset Trigger Button */}
                <button
                  type="button"
                  onClick={() => setShowPresetTray((prev) => !prev)}
                  title="Choose documentary topic preset"
                  aria-label="Choose documentary topic preset"
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                    showPresetTray
                      ? "bg-white text-zinc-950"
                      : "bg-[#25252b] hover:bg-[#303038] text-zinc-200"
                  }`}
                >
                  <Plus className="w-5 h-5" />
                </button>

                {/* '✦ Style Theme' Dropdown Pill (All 3 Themes: Magnates Noir, Fern Economic, Vox Editorial) */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsStyleMenuOpen((prev) => !prev)}
                    aria-expanded={isStyleMenuOpen}
                    aria-haspopup="listbox"
                    title="Select documentary graphic theme and effects profile"
                    className="min-h-[40px] px-3.5 py-2 rounded-full bg-[#25252b] hover:bg-[#303038] text-xs sm:text-sm font-medium text-zinc-100 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                  >
                    <Sparkles
                      className="w-3.5 h-3.5 shrink-0"
                      style={{ color: currentTheme.palette.accent }}
                    />
                    <span>{currentTheme.name}</span>
                  </button>

                  {isStyleMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setIsStyleMenuOpen(false)}
                      />
                      <div
                        role="listbox"
                        aria-label="Video Style Themes"
                        className="absolute left-0 mt-2 w-72 bg-[#18181c] border border-white/[0.12] rounded-2xl shadow-2xl py-1.5 z-40"
                      >
                        {(["magnates", "fern", "vox"] as MotionStyle[]).map(
                          (themeId) => {
                            const t = STYLE_THEMES[themeId];
                            const isSelected = style === themeId;
                            return (
                              <button
                                key={themeId}
                                type="button"
                                role="option"
                                aria-selected={isSelected}
                                onClick={() => {
                                  handleSelectStyleTheme(themeId);
                                  setIsStyleMenuOpen(false);
                                }}
                                className={`w-full px-3.5 py-2.5 text-left text-xs transition-colors flex flex-col gap-0.5 ${
                                  isSelected
                                    ? "bg-[#d4ff00]/15 text-[#d4ff00]"
                                    : "text-zinc-200 hover:bg-white/[0.05]"
                                }`}
                              >
                                <div className="flex items-center justify-between font-mono font-semibold">
                                  <span className="flex items-center gap-2">
                                    <span
                                      className="w-2.5 h-2.5 rounded-full"
                                      style={{
                                        backgroundColor: t.palette.accent,
                                      }}
                                    />
                                    <span>{t.name}</span>
                                  </span>
                                  <span className="text-[10px] text-zinc-400">
                                    {t.shortLabel}
                                  </span>
                                </div>
                                <span className="text-[11px] text-zinc-400 line-clamp-1">
                                  {t.tagline}
                                </span>
                              </button>
                            );
                          }
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* '▯ 16:9 · Model' Pill Picker */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsModelMenuOpen((prev) => !prev)}
                    aria-expanded={isModelMenuOpen}
                    aria-haspopup="listbox"
                    className="min-h-[40px] px-3.5 py-2 rounded-full bg-[#25252b] hover:bg-[#303038] text-xs sm:text-sm font-medium text-zinc-100 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
                  >
                    <RectangleHorizontal className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                    <span>16:9 · {currentModelMeta?.name}</span>
                  </button>

                  {isModelMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setIsModelMenuOpen(false)}
                      />
                      <div
                        role="listbox"
                        aria-label="NVIDIA NIM Reasoning Models"
                        className="absolute left-0 mt-2 w-64 bg-[#18181c] border border-white/[0.12] rounded-2xl shadow-2xl py-1.5 z-40"
                      >
                        {AVAILABLE_MODELS.map((m) => {
                          const isSelected = m.id === model;
                          return (
                            <button
                              key={m.id}
                              type="button"
                              role="option"
                              aria-selected={isSelected}
                              onClick={() => {
                                setModel(m.id);
                                setIsModelMenuOpen(false);
                              }}
                              className={`w-full px-3.5 py-2.5 text-left text-xs transition-colors flex flex-col gap-0.5 ${
                                isSelected
                                  ? "bg-[#d4ff00]/15 text-[#d4ff00]"
                                  : "text-zinc-200 hover:bg-white/[0.05]"
                              }`}
                            >
                              <div className="flex items-center justify-between font-mono font-semibold">
                                <span>{m.name}</span>
                                <span className="text-[10px] text-zinc-400">
                                  {m.tag}
                                </span>
                              </div>
                              <span className="text-[11px] text-zinc-400 line-clamp-1">
                                {m.desc}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Signature Acid-Lime Circular Submit Arrow Button */}
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                title="Direct documentary script and scenes"
                aria-label="Direct documentary script and scenes"
                className="w-11 h-11 rounded-full bg-[#d4ff00] hover:bg-[#e2ff42] active:scale-95 text-zinc-950 flex items-center justify-center transition-all disabled:opacity-50 shrink-0 shadow-md"
              >
                {isGenerating ? (
                  <Loader2 className="w-5 h-5 animate-spin stroke-[2.5]" />
                ) : (
                  <ArrowUp className="w-5 h-5 stroke-[2.5]" />
                )}
              </button>
            </div>
          </div>

          {/* Centered Status / Integration & Effects Library Toggle Below Composer */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="min-h-[40px] px-4 py-2 rounded-full bg-[#16161a] hover:bg-[#1e1e24] border border-white/[0.07] text-xs sm:text-sm text-zinc-200 flex items-center gap-2.5 transition-colors"
            >
              <Cpu className="w-4 h-4 text-zinc-400 shrink-0" />
              <span>
                NVIDIA NIM Inference{" "}
                <span className="text-zinc-500 hidden xs:inline">
                  · {currentModelMeta?.name}
                </span>
              </span>
              <span className="text-[#d4ff00] font-semibold inline-flex items-center gap-0.5">
                <span>{apiKey ? "Connected" : "Connect"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </button>

            <button
              type="button"
              onClick={() => setShowEffectsLibrary((prev) => !prev)}
              className={`min-h-[40px] px-4 py-2 rounded-full border text-xs sm:text-sm flex items-center gap-2 transition-colors ${
                showEffectsLibrary
                  ? "bg-[#1e1e24] border-[#d4ff00]/40 text-white"
                  : "bg-[#16161a] hover:bg-[#1e1e24] border-white/[0.07] text-zinc-300"
              }`}
            >
              <Layers className="w-4 h-4 text-[#d4ff00]" />
              <span>Theme &amp; Effects Library</span>
              <span className="font-mono text-[11px] text-[#d4ff00]">
                12 FX
              </span>
            </button>
          </div>
        </section>

        {/* SECTION 1.5: INTERACTIVE THEME GRAPHICS & VISUAL EFFECTS LIBRARY */}
        {showEffectsLibrary && (
          <section className="bg-[#141417] border border-white/[0.08] rounded-[24px] p-4 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-[#d4ff00]" />
                  <h2 className="font-heading text-base sm:text-lg font-bold text-white tracking-tight">
                    Video Style Themes &amp; AI Effects Library
                  </h2>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Each style theme injects its graphic architecture and 12
                  procedural Remotion effects into the AI Director whenever a
                  new video idea is provided.
                </p>
              </div>

              {/* 3 Style Theme Switcher Cards */}
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                {(["magnates", "fern", "vox"] as MotionStyle[]).map(
                  (themeId) => {
                    const t = STYLE_THEMES[themeId];
                    const active = style === themeId;
                    return (
                      <button
                        key={themeId}
                        type="button"
                        onClick={() => handleSelectStyleTheme(themeId)}
                        className={`px-3.5 py-2 rounded-xl border text-left transition-all shrink-0 flex items-center gap-2.5 ${
                          active
                            ? "bg-[#1e1e24] border-[#d4ff00] text-white"
                            : "bg-[#0d0d10] border-white/[0.07] text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: t.palette.accent }}
                        />
                        <div>
                          <div className="text-xs font-semibold leading-none">
                            {t.name}
                          </div>
                          <div className="text-[10px] font-mono text-zinc-500 mt-1">
                            {t.tagline}
                          </div>
                        </div>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Active Theme Graphic Architecture Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-[#0d0d10] rounded-2xl p-4 border border-white/[0.06]">
              <div className="lg:col-span-5 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-mono font-bold text-black uppercase"
                    style={{ backgroundColor: currentTheme.palette.accent }}
                  >
                    ACTIVE THEME
                  </span>
                  <span className="font-heading text-sm font-bold text-white">
                    {currentTheme.name}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {currentTheme.description}
                </p>
              </div>

              <div className="lg:col-span-7 flex flex-wrap gap-2">
                {currentTheme.signatureOverlays.map((overlay) => (
                  <span
                    key={overlay}
                    className="px-2.5 py-1 rounded-lg bg-[#16161b] border border-white/[0.07] text-[11px] font-mono text-zinc-300"
                  >
                    ✦ {overlay}
                  </span>
                ))}
              </div>
            </div>

            {/* 12 Procedural Effects Grid (Click to apply to active shot) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-zinc-400 uppercase tracking-wider text-[11px]">
                  Procedural Remotion Effect Presets (Click to apply to{" "}
                  {activeShotIndex !== null
                    ? `Scene 0${activeShotIndex + 1}`
                    : "Scene 01"}
                  )
                </span>
                <span className="font-mono text-[11px] text-[#d4ff00]">
                  Highlighted = Recommended for {currentTheme.name}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {EFFECT_PRESET_LIST.map((fx) => {
                  const isRecommended = fx.recommendedStyles.includes(style);
                  const targetIdx = activeShotIndex ?? 0;
                  const isApplied =
                    shots[targetIdx]?.effectPreset === fx.id ||
                    (!shots[targetIdx]?.effectPreset &&
                      getDefaultEffectForScene(
                        style,
                        shots[targetIdx]?.sceneType || "parallax"
                      ) === fx.id);

                  return (
                    <button
                      key={fx.id}
                      type="button"
                      onClick={() => handleApplyEffectToScene(fx.id)}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 ${
                        isApplied
                          ? "bg-[#d4ff00]/15 border-[#d4ff00] text-white"
                          : isRecommended
                          ? "bg-[#19191f] border-white/[0.15] hover:border-[#d4ff00]/60 text-zinc-200"
                          : "bg-[#101014] border-white/[0.06] hover:border-white/[0.16] text-zinc-400"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-white/[0.08] text-[#d4ff00]">
                          {fx.badge}
                        </span>
                        <span className="text-[9px] font-mono text-zinc-500 uppercase">
                          {fx.category}
                        </span>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-zinc-100 truncate">
                          {fx.name}
                        </div>
                        <p className="text-[10px] text-zinc-400 line-clamp-2 mt-0.5 leading-snug">
                          {fx.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* SECTION 2: HIGGSFIELD-STYLE SCENE CARDS SHOWCASE */}
        <section ref={storyboardRef} className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2.5">
              <h2 className="font-heading text-lg font-bold text-white tracking-tight">
                Generated Documentary Scenes
              </h2>
              <span className="text-xs font-mono tabular-nums text-zinc-500">
                {shots.length} setups · Theme: {currentTheme.name} · Drag cards
                to reorder
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              {lastSavedTime && (
                <span className="font-mono tabular-nums text-zinc-500 hidden sm:inline">
                  Saved {lastSavedTime}
                </span>
              )}
              <button
                type="button"
                onClick={handleResetProject}
                className="text-zinc-400 hover:text-white transition-colors"
              >
                Reset Default
              </button>
            </div>
          </div>

          <ShotCards
            shots={shots}
            style={style}
            activeShotIndex={activeShotIndex}
            onSelectShot={(idx) => {
              setActiveShotIndex(idx);
            }}
            onUpdateShot={handleUpdateShot}
            onReorderShots={handleReorderShots}
          />
        </section>

        {/* SECTION 3: LIVE REMOTION CINEMA MONITOR & TELEPROMPTER SPLIT */}
        <section
          ref={monitorRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch"
        >
          {/* Left on Desktop: Live Remotion 16:9 Cinema Monitor */}
          <div className="lg:col-span-7 flex flex-col lg:min-h-[560px]">
            <VideoCanvas
              shots={shots}
              topic={topic}
              style={style}
              activeShotIndex={activeShotIndex}
              onSelectShot={setActiveShotIndex}
              onUpdateShot={handleUpdateShot}
            />
          </div>

          {/* Right on Desktop: Voiceover Teleprompter & Retention Trace */}
          <div className="lg:col-span-5 flex flex-col lg:min-h-[560px]">
            <ScriptDirector
              topic={topic}
              setTopic={setTopic}
              hook={hook}
              setHook={setHook}
              thinkingTrace={thinkingTrace}
              fullScript={fullScript}
              setFullScript={setFullScript}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              modelName={currentModelMeta?.name || "DeepSeek-R1"}
            />
          </div>
        </section>

        {/* SECTION 4: MULTI-TRACK NLE SEQUENCE TIMELINE */}
        <section
          ref={timelineRef}
          className="bg-[#141417] border border-white/[0.08] rounded-[24px] p-4 sm:p-6"
        >
          <TimelineTracks
            shots={shots}
            style={style}
            activeShotIndex={activeShotIndex}
            onSelectShot={setActiveShotIndex}
          />
        </section>
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-white/[0.06] py-5 px-4 sm:px-6 lg:px-8 mt-6">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-500">
          <span>Rook Studio · Documentary Narrative & Motion Direction Suite</span>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleResetProject}
              className="hover:text-zinc-300 transition-colors"
            >
              Reset Default
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-zinc-300 transition-colors"
            >
              API Credentials
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setIsExportOpen(true)}
              className="hover:text-zinc-300 transition-colors"
            >
              Export Production Pack
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveKey={handleSaveKey}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        topic={topic}
        hook={hook}
        thinkingTrace={thinkingTrace}
        fullScript={fullScript}
        shots={shots}
        style={style}
        model={model}
        onImportProject={(imported) => {
          if (typeof imported.topic === "string") setTopic(imported.topic);
          if (typeof imported.hook === "string") setHook(imported.hook);
          if (typeof imported.thinkingTrace === "string") {
            setThinkingTrace(imported.thinkingTrace);
          }
          if (typeof imported.fullScript === "string") {
            setFullScript(imported.fullScript);
          }
          if (Array.isArray(imported.shots) && imported.shots.length > 0) {
            setShots(imported.shots);
          }
          if (imported.style) setStyle(imported.style);
          if (imported.model) setModel(imported.model);
          setActiveShotIndex(null);
        }}
      />
    </div>
  );
}
