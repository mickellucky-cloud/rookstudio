"use client";

import React, { useState } from "react";
import { EffectPresetId, MotionStyle, ShotDirection } from "@/types";
import {
  EFFECT_PRESET_LIST,
  STYLE_THEMES,
  getDefaultEffectForScene,
  getEffectPresetById,
} from "@/lib/effectsLibrary";
import {
  Play,
  Sparkles,
  TrendingUp,
  Newspaper,
  Network,
  Globe,
  GripVertical,
  ArrowLeft,
  ArrowRight,
  Wand2,
} from "lucide-react";

interface ShotCardsProps {
  shots: ShotDirection[];
  style?: MotionStyle;
  activeShotIndex: number | null;
  onSelectShot: (index: number | null) => void;
  onUpdateShot?: (index: number, updated: Partial<ShotDirection>) => void;
  onReorderShots?: (fromIndex: number, toIndex: number) => void;
}

const SCENE_TYPES: { id: ShotDirection["sceneType"]; label: string }[] = [
  { id: "parallax", label: "Parallax" },
  { id: "newspaper", label: "Press Leak" },
  { id: "kinetic-stat", label: "Kinetic Stat" },
  { id: "conspiracy-board", label: "Evidence" },
  { id: "map", label: "Geo Map" },
];

export const ShotCards: React.FC<ShotCardsProps> = ({
  shots,
  style = "magnates",
  activeShotIndex,
  onSelectShot,
  onUpdateShot,
  onReorderShots,
}) => {
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [openFxCardIdx, setOpenFxCardIdx] = useState<number | null>(null);

  const theme = STYLE_THEMES[style] || STYLE_THEMES.magnates;

  const handleDragStart = (e: React.DragEvent<HTMLElement>, idx: number) => {
    setDraggedIdx(idx);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(idx));
  };

  const handleDragOver = (e: React.DragEvent<HTMLElement>, idx: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIdx !== idx) {
      setDragOverIdx(idx);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLElement>, targetIdx: number) => {
    e.preventDefault();
    const sourceIdx =
      draggedIdx !== null
        ? draggedIdx
        : parseInt(e.dataTransfer.getData("text/plain"), 10);

    setDraggedIdx(null);
    setDragOverIdx(null);

    if (
      !Number.isNaN(sourceIdx) &&
      sourceIdx !== targetIdx &&
      onReorderShots
    ) {
      onReorderShots(sourceIdx, targetIdx);
    }
  };

  const handleDragEnd = () => {
    setDraggedIdx(null);
    setDragOverIdx(null);
  };

  const renderSceneArtwork = (shot: ShotDirection) => {
    const effectId: EffectPresetId =
      shot.effectPreset || getDefaultEffectForScene(style, shot.sceneType);
    const effectMeta = getEffectPresetById(effectId);

    switch (shot.sceneType) {
      case "newspaper":
        return (
          <div
            className="w-full h-full p-4 flex flex-col justify-between relative overflow-hidden"
            style={{
              background:
                style === "vox"
                  ? "linear-gradient(145deg, #2b2923 0%, #171614 60%, #0e0e11 100%)"
                  : style === "fern"
                  ? "linear-gradient(145deg, #0d1f2d 0%, #0d141d 65%, #090b10 100%)"
                  : "linear-gradient(145deg, #24211b 0%, #161518 65%, #0c0c0f 100%)",
            }}
          >
            <div className="space-y-2 mt-7 opacity-90">
              <div className="h-2 w-20 bg-zinc-500/40 rounded-sm" />
              <div className="text-[11px] font-mono font-bold text-zinc-100 leading-tight line-clamp-2">
                {shot.headlineText || "CONFIDENTIAL MEMO EXPOSES MONOPOLY"}
              </div>
              <div className="relative py-1">
                <div
                  className="h-5 w-4/5 rounded-md -rotate-1 flex items-center px-2"
                  style={{
                    backgroundColor:
                      style === "fern"
                        ? "#06b6d4"
                        : style === "vox"
                        ? "#facc15"
                        : "#d4ff00",
                  }}
                >
                  <span className="text-[9px] font-mono font-bold text-black truncate">
                    {shot.timestamp} · {effectMeta?.badge || "PRESS LEAK"}
                  </span>
                </div>
              </div>
              <div className="space-y-1.5 pt-1">
                <div className="h-1.5 w-full bg-zinc-600/30 rounded-full" />
                <div className="h-1.5 w-5/6 bg-zinc-600/30 rounded-full" />
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-2 border-t border-white/[0.06]">
              <span>FX · {effectMeta?.name || "Highlighter"}</span>
              <Newspaper
                className="w-3.5 h-3.5"
                style={{ color: theme.palette.accent }}
              />
            </div>
          </div>
        );

      case "kinetic-stat":
        return (
          <div
            className="w-full h-full p-4 flex flex-col justify-between relative overflow-hidden"
            style={{
              background:
                style === "fern"
                  ? "linear-gradient(145deg, #0b2434 0%, #0f1622 65%, #090b10 100%)"
                  : style === "vox"
                  ? "linear-gradient(145deg, #282419 0%, #151519 65%, #0c0d10 100%)"
                  : "linear-gradient(145deg, #241d11 0%, #141318 65%, #0b0b0e 100%)",
            }}
          >
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `linear-gradient(to right, ${theme.palette.gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${theme.palette.gridColor} 1px, transparent 1px)`,
                backgroundSize: "18px 18px",
              }}
            />
            <div className="relative z-10 mt-7">
              <div
                className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums"
                style={{ color: theme.palette.accent }}
              >
                {shot.statValue || "84.2"}%
              </div>
              <div className="text-[11px] text-zinc-300 font-medium mt-1 line-clamp-1">
                {shot.headlineText || "Global Market Control"}
              </div>
              <svg
                viewBox="0 0 120 36"
                className="w-full h-9 mt-2 overflow-visible"
              >
                <path
                  d="M 2 32 Q 35 28, 55 18 T 118 4"
                  fill="none"
                  stroke={theme.palette.accent}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-2 border-t border-white/[0.06]">
              <span>FX · {effectMeta?.name || "Telemetry"}</span>
              <TrendingUp
                className="w-3.5 h-3.5"
                style={{ color: theme.palette.accent }}
              />
            </div>
          </div>
        );

      case "conspiracy-board":
        return (
          <div
            className="w-full h-full p-4 flex flex-col justify-between relative overflow-hidden"
            style={{
              background:
                style === "fern"
                  ? "linear-gradient(145deg, #1b1528 0%, #12141c 65%, #0a0b0e 100%)"
                  : "linear-gradient(145deg, #251419 0%, #151318 65%, #0c0c0f 100%)",
            }}
          >
            <div className="relative z-10 mt-7 space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2 py-1 rounded bg-white/[0.07] border border-white/[0.12] text-[9px] font-mono text-zinc-200 truncate">
                  SHELL CORP
                </span>
                <div
                  className="flex-1 h-0.5"
                  style={{ backgroundColor: theme.palette.secondaryAccent }}
                />
                <span
                  className="px-2 py-1 rounded text-[9px] font-mono font-bold text-black truncate"
                  style={{ backgroundColor: theme.palette.accent }}
                >
                  {shot.headlineText?.split(" ")[0] || "HOLDINGS"}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-black/50 border border-white/[0.08] text-[10px] font-mono text-zinc-300 line-clamp-2">
                {shot.narration}
              </div>
            </div>
            <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-2 border-t border-white/[0.06]">
              <span>FX · {effectMeta?.name || "Red String"}</span>
              <Network
                className="w-3.5 h-3.5"
                style={{ color: theme.palette.secondaryAccent }}
              />
            </div>
          </div>
        );

      case "map":
        return (
          <div
            className="w-full h-full p-4 flex flex-col justify-between relative overflow-hidden"
            style={{
              background:
                "linear-gradient(145deg, #0c222d 0%, #0f1620 65%, #080a0e 100%)",
            }}
          >
            <div className="relative z-10 mt-7 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-cyan-300">
                <span>GEO CORRIDOR</span>
                <span>{shot.locationCoords || "45.46° N, 9.19° E"}</span>
              </div>
              <svg
                viewBox="0 0 140 46"
                className="w-full h-11 overflow-visible"
              >
                <path
                  d="M 10 38 Q 70 4, 130 28"
                  fill="none"
                  stroke={theme.palette.accent}
                  strokeWidth="2.5"
                  strokeDasharray="4 3"
                />
                <circle cx="10" cy="38" r="4" fill={theme.palette.accent} />
                <circle
                  cx="130"
                  cy="28"
                  r="4.5"
                  fill={theme.palette.secondaryAccent}
                />
              </svg>
              <div className="text-xs font-bold text-white truncate">
                {shot.headlineText || shot.title}
              </div>
            </div>
            <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-2 border-t border-white/[0.06]">
              <span>FX · {effectMeta?.name || "Radar Sweep"}</span>
              <Globe
                className="w-3.5 h-3.5"
                style={{ color: theme.palette.accent }}
              />
            </div>
          </div>
        );

      case "parallax":
      default:
        return (
          <div
            className="w-full h-full p-4 flex flex-col justify-between relative overflow-hidden"
            style={{
              background:
                style === "fern"
                  ? "linear-gradient(145deg, #102530 0%, #13161d 65%, #0b0b0e 100%)"
                  : style === "vox"
                  ? "linear-gradient(145deg, #292516 0%, #16161b 65%, #0b0b0e 100%)"
                  : "linear-gradient(145deg, #252214 0%, #15161a 65%, #0b0b0e 100%)",
            }}
          >
            <div
              className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl pointer-events-none opacity-25"
              style={{ backgroundColor: theme.palette.accent }}
            />
            <div className="relative z-10 mt-7 space-y-2">
              <div
                className="text-[10px] font-mono uppercase tracking-wider"
                style={{ color: theme.palette.accent }}
              >
                2.5D Depth · {theme.shortLabel}
              </div>
              <div className="font-heading text-sm sm:text-base font-bold text-white leading-snug line-clamp-2">
                {shot.headlineText || shot.title}
              </div>
              <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                {shot.narration}
              </p>
            </div>
            <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-2 border-t border-white/[0.06]">
              <span>FX · {effectMeta?.name || "Dust & Vignette"}</span>
              <Sparkles
                className="w-3.5 h-3.5"
                style={{ color: theme.palette.accent }}
              />
            </div>
          </div>
        );
    }
  };

  const getBadgeStyle = (sceneType: ShotDirection["sceneType"]) => {
    switch (sceneType) {
      case "newspaper":
        return { text: "LEAK", bg: "bg-[#3b82f6] text-white" };
      case "kinetic-stat":
        return { text: "DATA", bg: "bg-[#ec4899] text-white" };
      case "conspiracy-board":
        return { text: "NEXUS", bg: "bg-[#f59e0b] text-black" };
      case "map":
        return { text: "GEO", bg: "bg-[#06b6d4] text-black" };
      case "parallax":
      default:
        return { text: "HOOK", bg: "bg-[#d4ff00] text-black" };
    }
  };

  return (
    <div>
      {/* Horizontal Snap Carousel on Mobile, Responsive Grid on Desktop */}
      <div className="flex lg:grid lg:grid-cols-4 gap-4 overflow-x-auto lg:overflow-visible snap-x snap-mandatory pb-2 scrollbar-none">
        {shots.map((shot, idx) => {
          const isSelected = activeShotIndex === idx;
          const isDragging = draggedIdx === idx;
          const isDropTarget =
            dragOverIdx === idx && draggedIdx !== null && draggedIdx !== idx;
          const badge = getBadgeStyle(shot.sceneType);
          const effectId: EffectPresetId =
            shot.effectPreset ||
            getDefaultEffectForScene(style, shot.sceneType);
          const effectMeta = getEffectPresetById(effectId);

          return (
            <article
              key={shot.id || idx}
              draggable={Boolean(onReorderShots)}
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragEnter={(e) => handleDragOver(e, idx)}
              onDrop={(e) => handleDrop(e, idx)}
              onDragEnd={handleDragEnd}
              onClick={() => onSelectShot(isSelected ? null : idx)}
              className={`w-[250px] sm:w-[265px] lg:w-auto shrink-0 snap-start group cursor-pointer flex flex-col transition-all duration-150 ${
                isDragging ? "opacity-45 scale-[0.97]" : "opacity-100"
              }`}
            >
              {/* Visual Thumbnail Container (Higgsfield Card Style) */}
              <div
                className={`relative aspect-[4/3.6] w-full rounded-[22px] overflow-hidden border transition-all duration-200 ${
                  isDropTarget
                    ? "border-[#d4ff00] ring-2 ring-[#d4ff00] scale-[1.02]"
                    : isSelected
                    ? "border-[#d4ff00] ring-2 ring-[#d4ff00]/30"
                    : "border-white/[0.09] group-hover:border-white/[0.22]"
                }`}
              >
                {renderSceneArtwork(shot)}

                {/* Top-Left Drag Handle + Editorial Slanted Tag */}
                <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
                  {onReorderShots && (
                    <span
                      title="Drag card to reorder scene"
                      className="w-6 h-6 rounded-md bg-black/70 border border-white/15 text-zinc-300 hover:text-[#d4ff00] flex items-center justify-center cursor-grab active:cursor-grabbing"
                    >
                      <GripVertical className="w-3.5 h-3.5" />
                    </span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded-[5px] text-[10px] font-extrabold tracking-wider uppercase -skew-x-6 shadow-sm ${badge.bg}`}
                  >
                    0{idx + 1} · {badge.text}
                  </span>
                </div>

                {/* Top-Right Reorder Nudge Controls & Solo Play Indicator */}
                <div className="absolute top-3 right-3 z-20 flex items-center gap-1">
                  {onReorderShots && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-0.5 bg-black/75 backdrop-blur-md rounded-full p-0.5 border border-white/15 opacity-90 group-hover:opacity-100 transition-opacity"
                    >
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => onReorderShots(idx, idx - 1)}
                        title="Move shot earlier"
                        aria-label={`Move shot ${idx + 1} earlier`}
                        className="w-6 h-6 rounded-full text-zinc-300 hover:text-[#d4ff00] hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-colors"
                      >
                        <ArrowLeft className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === shots.length - 1}
                        onClick={() => onReorderShots(idx, idx + 1)}
                        title="Move shot later"
                        aria-label={`Move shot ${idx + 1} later`}
                        className="w-6 h-6 rounded-full text-zinc-300 hover:text-[#d4ff00] hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-colors"
                      >
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-[#d4ff00] text-black"
                        : "bg-black/75 text-white border border-white/15 group-hover:border-[#d4ff00]/50"
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                  </div>
                </div>
              </div>

              {/* Clean Below-Card Caption, Editable Duration Input, Effect Picker & Scene Engine Switcher */}
              <div className="pt-2.5 px-1 flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-[#d4ff00] transition-colors truncate">
                    {shot.title}
                  </h3>
                  <span className="text-[11px] font-mono tabular-nums text-zinc-500 shrink-0">
                    {shot.timestamp}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 line-clamp-1">
                  {shot.narration}
                </p>

                {/* Row 1: Editable Scene Duration Input + Visual Effect Preset Selector */}
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-between gap-1.5 pt-1 relative"
                >
                  <label
                    htmlFor={`shot-duration-${shot.id || idx}`}
                    className="inline-flex items-center gap-1 bg-[#151519] border border-white/[0.08] focus-within:border-[#d4ff00]/60 rounded-full px-2.5 py-0.5 text-[11px] font-mono text-zinc-300 shrink-0"
                  >
                    <span className="text-zinc-500">Dur:</span>
                    <input
                      suppressHydrationWarning
                      id={`shot-duration-${shot.id || idx}`}
                      type="number"
                      min={1}
                      max={60}
                      step={1}
                      value={shot.duration ?? 4}
                      onChange={(e) => {
                        const raw = parseInt(e.target.value, 10);
                        const nextDuration = Number.isNaN(raw)
                          ? 1
                          : Math.max(1, Math.min(60, raw));
                        onUpdateShot?.(idx, { duration: nextDuration });
                      }}
                      aria-label={`Duration in seconds for ${shot.title}`}
                      className="w-8 bg-transparent text-right font-mono tabular-nums font-semibold text-[#d4ff00] focus:outline-none"
                    />
                    <span className="text-zinc-500">s</span>
                  </label>

                  {/* Per-Card Effect Preset Pill */}
                  {onUpdateShot && (
                    <div className="relative flex-1 min-w-0">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenFxCardIdx((prev) =>
                            prev === idx ? null : idx
                          )
                        }
                        title="Choose visual effect preset from library"
                        className="w-full min-h-[26px] px-2.5 py-0.5 rounded-full bg-[#151519] hover:bg-[#1f1f26] border border-white/[0.08] text-[10px] font-mono text-zinc-200 flex items-center justify-between gap-1 transition-colors"
                      >
                        <span className="flex items-center gap-1 truncate">
                          <Wand2 className="w-3 h-3 text-[#d4ff00] shrink-0" />
                          <span className="truncate">
                            {effectMeta?.name || effectId}
                          </span>
                        </span>
                        <span className="text-[9px] text-zinc-500 shrink-0">
                          FX
                        </span>
                      </button>

                      {openFxCardIdx === idx && (
                        <>
                          <div
                            className="fixed inset-0 z-30"
                            onClick={() => setOpenFxCardIdx(null)}
                          />
                          <div className="absolute right-0 bottom-full mb-1.5 w-60 max-h-56 overflow-y-auto bg-[#18181c] border border-white/[0.14] rounded-2xl shadow-2xl py-1 z-40">
                            {EFFECT_PRESET_LIST.map((fx) => {
                              const active = fx.id === effectId;
                              return (
                                <button
                                  key={fx.id}
                                  type="button"
                                  onClick={() => {
                                    onUpdateShot(idx, { effectPreset: fx.id });
                                    onSelectShot(idx);
                                    setOpenFxCardIdx(null);
                                  }}
                                  className={`w-full px-3 py-1.5 text-left text-[11px] flex items-center justify-between gap-2 transition-colors ${
                                    active
                                      ? "bg-[#d4ff00]/15 text-[#d4ff00] font-semibold"
                                      : "text-zinc-300 hover:bg-white/[0.06]"
                                  }`}
                                >
                                  <span className="truncate">{fx.name}</span>
                                  <span className="text-[9px] font-mono text-zinc-500 shrink-0">
                                    {fx.badge}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Row 2: Scene Engine Template Switcher (All 5 Engines) */}
                {onUpdateShot && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 overflow-x-auto scrollbar-none pt-0.5"
                  >
                    {SCENE_TYPES.map((st) => {
                      const active = shot.sceneType === st.id;
                      return (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => {
                            const recommendedFx = getDefaultEffectForScene(
                              style,
                              st.id
                            );
                            onUpdateShot(idx, {
                              sceneType: st.id,
                              effectPreset: recommendedFx,
                            });
                            onSelectShot(idx);
                          }}
                          className={`min-h-[24px] px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors whitespace-nowrap shrink-0 ${
                            active
                              ? "bg-[#27272c] text-[#d4ff00] border border-[#d4ff00]/40"
                              : "bg-[#151519] text-zinc-400 hover:text-zinc-200 border border-white/[0.06]"
                          }`}
                        >
                          {st.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
