"use client";

import React, { useRef, useState, useEffect } from "react";
import { Player, PlayerRef } from "@remotion/player";
import { DocumentaryComposition } from "@/remotion/DocumentaryComposition";
import { EffectPresetId, MotionStyle, ShotDirection } from "@/types";
import {
  EFFECT_PRESET_LIST,
  STYLE_THEMES,
  getDefaultEffectForScene,
  getEffectPresetById,
} from "@/lib/effectsLibrary";
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  SlidersHorizontal,
  Wand2,
  ChevronDown,
} from "lucide-react";

interface VideoCanvasProps {
  shots: ShotDirection[];
  topic: string;
  style?: MotionStyle;
  activeShotIndex: number | null;
  onSelectShot: (index: number | null) => void;
  onUpdateShot?: (index: number, updated: Partial<ShotDirection>) => void;
}

const SCENE_TYPE_LABELS: Record<ShotDirection["sceneType"], string> = {
  parallax: "Parallax",
  newspaper: "Press Clipping",
  "kinetic-stat": "Kinetic Stat",
  "conspiracy-board": "Evidence Board",
  map: "Geo Map",
};

export const VideoCanvas: React.FC<VideoCanvasProps> = ({
  shots,
  topic,
  style = "magnates",
  activeShotIndex,
  onSelectShot,
  onUpdateShot,
}) => {
  const playerRef = useRef<PlayerRef>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isFxMenuOpen, setIsFxMenuOpen] = useState(false);

  const FPS = 30;
  const totalShotsFrames = shots.reduce(
    (acc, s) => acc + Math.max(1, Math.round((s.duration ?? 4) * FPS)),
    0
  );
  const durationInFrames =
    activeShotIndex !== null && shots[activeShotIndex]
      ? Math.max(1, Math.round((shots[activeShotIndex].duration ?? 4) * FPS))
      : Math.max(totalShotsFrames, 120);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const interval = setInterval(() => {
      if (playerRef.current) {
        setIsPlaying(playerRef.current.isPlaying());
        setCurrentFrame(playerRef.current.getCurrentFrame());
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isMounted]);

  const handleTogglePlay = () => {
    if (!playerRef.current) return;
    if (playerRef.current.isPlaying()) {
      playerRef.current.pause();
      setIsPlaying(false);
    } else {
      playerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleRestart = () => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(0);
    setCurrentFrame(0);
  };

  const handleStep = (frames: number) => {
    if (!playerRef.current) return;
    const nextFrame = Math.max(
      0,
      Math.min(durationInFrames - 1, currentFrame + frames)
    );
    playerRef.current.seekTo(nextFrame);
    setCurrentFrame(nextFrame);
  };

  const formatTimecode = (frames: number) => {
    const fps = 30;
    const totalSeconds = Math.floor(frames / fps);
    const ff = String(frames % fps).padStart(2, "0");
    const ss = String(totalSeconds % 60).padStart(2, "0");
    const mm = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    return `${mm}:${ss}:${ff}`;
  };

  const activeShot =
    activeShotIndex !== null && shots[activeShotIndex]
      ? shots[activeShotIndex]
      : null;

  const activeTheme = STYLE_THEMES[style] || STYLE_THEMES.magnates;
  const activeEffectId: EffectPresetId | undefined = activeShot
    ? activeShot.effectPreset ||
      getDefaultEffectForScene(style, activeShot.sceneType)
    : undefined;
  const activeEffectMeta = activeEffectId
    ? getEffectPresetById(activeEffectId)
    : undefined;

  return (
    <div className="flex flex-col h-full bg-[#141417] rounded-[24px] border border-white/[0.08] overflow-hidden">
      {/* Monitor Header & Responsive Scene Selector */}
      <div className="px-4 sm:px-5 py-3.5 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-heading text-base font-bold text-white tracking-tight">
              Cinema Monitor
            </h2>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border"
              style={{
                borderColor: `${activeTheme.palette.accent}55`,
                backgroundColor: `${activeTheme.palette.accent}15`,
                color: activeTheme.palette.accent,
              }}
            >
              {activeTheme.name}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5 font-mono tabular-nums">
            <span>1920×1080</span>
            <span aria-hidden="true">·</span>
            <span>30 FPS</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#d4ff00]">
              {activeShot
                ? `Solo Scene 0${activeShotIndex! + 1}`
                : `${shots.length} Connected Scenes`}
            </span>
          </div>
        </div>

        {/* Scrollable Segmented Scene Filter Controls */}
        <div
          role="tablist"
          aria-label="Scene preview selector"
          className="flex items-center gap-1 bg-[#0b0b0d] p-1 rounded-full border border-white/[0.07] overflow-x-auto scrollbar-none"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeShotIndex === null}
            onClick={() => {
              onSelectShot(null);
              handleRestart();
            }}
            className={`min-h-[30px] px-3 py-1 text-xs font-medium rounded-full transition-colors whitespace-nowrap shrink-0 ${
              activeShotIndex === null
                ? "bg-[#d4ff00] text-zinc-950 font-semibold"
                : "text-zinc-400 hover:text-zinc-100"
            }`}
          >
            Full Reel
          </button>
          {shots.map((shot, idx) => (
            <button
              key={shot.id || idx}
              type="button"
              role="tab"
              aria-selected={activeShotIndex === idx}
              onClick={() => {
                onSelectShot(idx);
                handleRestart();
              }}
              className={`min-h-[30px] px-3 py-1 text-xs font-medium rounded-full transition-colors whitespace-nowrap shrink-0 tabular-nums ${
                activeShotIndex === idx
                  ? "bg-[#d4ff00] text-zinc-950 font-semibold"
                  : "text-zinc-400 hover:text-zinc-100"
              }`}
            >
              0{idx + 1}. {SCENE_TYPE_LABELS[shot.sceneType] || shot.sceneType}
            </button>
          ))}
        </div>
      </div>

      {/* Main 16:9 Viewport Stage */}
      <div className="relative flex-1 bg-[#08080a] flex items-center justify-center p-3 sm:p-5 overflow-hidden min-h-[240px] sm:min-h-[320px]">
        <div className="w-full max-w-[920px] aspect-video rounded-2xl overflow-hidden border border-white/[0.1] relative bg-[#050608] shadow-2xl">
          {isMounted ? (
            <Player
              ref={playerRef}
              component={DocumentaryComposition}
              inputProps={{
                shots,
                activeSceneOverride: activeShotIndex,
                topic,
                style,
              }}
              durationInFrames={durationInFrames}
              fps={30}
              compositionWidth={1920}
              compositionHeight={1080}
              style={{
                width: "100%",
                height: "100%",
              }}
              controls={false}
              loop
            />
          ) : (
            <div className="w-full h-full bg-[#050608] flex flex-col items-center justify-center gap-3 p-6">
              <div className="w-7 h-7 rounded-full border-2 border-[#d4ff00]/20 border-t-[#d4ff00] animate-spin" />
              <span className="text-xs font-mono text-zinc-400">
                Initializing Remotion Motion Viewport...
              </span>
            </div>
          )}

          {/* Measured Contrast Scrim & Scene Caption Overlay */}
          <div className="absolute inset-x-0 bottom-0 z-20 pointer-events-none bg-gradient-to-t from-black/85 via-black/40 to-transparent px-4 py-3 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-zinc-200 truncate">
              <span className="font-mono tabular-nums text-[#d4ff00] font-semibold">
                {activeShotIndex !== null
                  ? `Scene 0${activeShotIndex + 1}`
                  : "Master Sequence"}
              </span>
              <span className="text-zinc-500" aria-hidden="true">
                ·
              </span>
              <span className="truncate font-medium">
                {activeShot ? activeShot.title : topic}
              </span>
              {activeEffectMeta && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.08] border border-white/10 font-mono text-[10px] text-[#d4ff00]">
                  FX: {activeEffectMeta.name}
                </span>
              )}
            </div>
            <span className="font-mono text-[11px] text-zinc-400 whitespace-nowrap shrink-0 hidden sm:inline">
              @byrook_tv
            </span>
          </div>
        </div>
      </div>

      {/* Live Scene Parameter Quick-Editor when a Scene is Selected */}
      {activeShot && activeShotIndex !== null && onUpdateShot && (
        <div className="px-4 py-3 bg-[#101013] border-t border-white/[0.06] flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-[#d4ff00] font-medium whitespace-nowrap shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Scene Props:</span>
          </div>

          {/* Effect Preset Custom Picker */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setIsFxMenuOpen((prev) => !prev)}
              aria-expanded={isFxMenuOpen}
              aria-haspopup="listbox"
              className="w-full sm:w-auto min-h-[36px] px-3 py-1.5 rounded-xl bg-[#1c1c21] hover:bg-[#24242b] border border-white/[0.08] text-xs font-mono text-zinc-100 flex items-center justify-between gap-2 transition-colors"
            >
              <span className="flex items-center gap-1.5 truncate">
                <Wand2 className="w-3.5 h-3.5 text-[#d4ff00] shrink-0" />
                <span className="truncate">
                  {activeEffectMeta ? activeEffectMeta.name : "Select Effect"}
                </span>
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            </button>

            {isFxMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsFxMenuOpen(false)}
                />
                <div
                  role="listbox"
                  aria-label="Visual Effect Presets"
                  className="absolute left-0 bottom-full mb-2 w-72 max-h-64 overflow-y-auto bg-[#18181c] border border-white/[0.12] rounded-2xl shadow-2xl py-1.5 z-40"
                >
                  {EFFECT_PRESET_LIST.map((fx) => {
                    const isSelected = fx.id === activeEffectId;
                    const isRecommended = fx.recommendedStyles.includes(style);
                    return (
                      <button
                        key={fx.id}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          onUpdateShot(activeShotIndex, {
                            effectPreset: fx.id,
                          });
                          setIsFxMenuOpen(false);
                        }}
                        className={`w-full px-3.5 py-2 text-left text-xs transition-colors flex flex-col gap-0.5 ${
                          isSelected
                            ? "bg-[#d4ff00]/15 text-[#d4ff00]"
                            : "text-zinc-200 hover:bg-white/[0.05]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 font-mono font-semibold">
                          <span>{fx.name}</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded ${
                              isRecommended
                                ? "bg-[#d4ff00]/20 text-[#d4ff00]"
                                : "bg-white/[0.06] text-zinc-400"
                            }`}
                          >
                            {fx.badge}
                          </span>
                        </div>
                        <span className="text-[11px] text-zinc-400 line-clamp-1">
                          {fx.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {activeShot.sceneType === "kinetic-stat" ? (
            <input
              suppressHydrationWarning
              type="text"
              aria-label="Statistic value"
              value={activeShot.statValue || ""}
              onChange={(e) =>
                onUpdateShot(activeShotIndex, { statValue: e.target.value })
              }
              placeholder="Stat value (e.g. 84.2)"
              className="sm:w-32 min-h-[36px] bg-[#1c1c21] border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-[#d4ff00]/60"
            />
          ) : activeShot.sceneType === "map" ? (
            <input
              suppressHydrationWarning
              type="text"
              aria-label="Geographic coordinates"
              value={activeShot.locationCoords || ""}
              onChange={(e) =>
                onUpdateShot(activeShotIndex, {
                  locationCoords: e.target.value,
                })
              }
              placeholder="Coords (e.g. 45.4642° N, 9.1900° E)"
              className="sm:w-44 min-h-[36px] bg-[#1c1c21] border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-[#d4ff00]/60"
            />
          ) : (
            <input
              suppressHydrationWarning
              type="text"
              aria-label="Scene headline text"
              value={activeShot.headlineText || ""}
              onChange={(e) =>
                onUpdateShot(activeShotIndex, { headlineText: e.target.value })
              }
              placeholder="On-screen headline..."
              className="sm:w-48 min-h-[36px] bg-[#1c1c21] border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#d4ff00]/60"
            />
          )}
          <input
            suppressHydrationWarning
            type="text"
            aria-label="Scene voiceover line"
            value={activeShot.narration}
            onChange={(e) =>
              onUpdateShot(activeShotIndex, { narration: e.target.value })
            }
            placeholder="Scene narration caption..."
            className="flex-1 min-h-[36px] bg-[#1c1c21] border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-[#d4ff00]/60"
          />
        </div>
      )}

      {/* Responsive Transport Bar */}
      <div className="px-4 sm:px-5 py-3 bg-[#141417] border-t border-white/[0.06] flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 shrink-0 select-none">
        {/* Playback Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleStep(-5)}
            className="min-h-[40px] min-w-[40px] rounded-full bg-[#222227] hover:bg-[#2c2c32] text-zinc-200 flex items-center justify-center transition-colors"
            title="Step back 5 frames"
            aria-label="Step back 5 frames"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleTogglePlay}
            className="min-h-[40px] min-w-[44px] px-4 rounded-full bg-[#d4ff00] hover:bg-[#e1ff3b] active:scale-[0.98] text-zinc-950 flex items-center justify-center gap-1.5 transition-all font-semibold text-xs whitespace-nowrap shrink-0"
            title={isPlaying ? "Pause playback" : "Play sequence"}
            aria-label={isPlaying ? "Pause playback" : "Play sequence"}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-zinc-950" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-zinc-950" />
                <span>Play</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleStep(5)}
            className="min-h-[40px] min-w-[40px] rounded-full bg-[#222227] hover:bg-[#2c2c32] text-zinc-200 flex items-center justify-center transition-colors"
            title="Step forward 5 frames"
            aria-label="Step forward 5 frames"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleRestart}
            className="min-h-[40px] min-w-[40px] rounded-full bg-[#222227] hover:bg-[#2c2c32] text-zinc-200 flex items-center justify-center transition-colors"
            title="Reset playhead to start"
            aria-label="Reset playhead to start"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Precision Frame Scrubber */}
        <div className="order-3 sm:order-2 w-full sm:flex-1 sm:mx-3 flex items-center gap-3">
          <input
            suppressHydrationWarning
            type="range"
            aria-label="Timeline playhead frame scrubber"
            min={0}
            max={durationInFrames - 1}
            value={currentFrame}
            onChange={(e) => {
              const f = parseInt(e.target.value, 10);
              setCurrentFrame(f);
              playerRef.current?.seekTo(f);
            }}
            className="w-full accent-[#d4ff00] h-1.5 bg-white/[0.12] rounded-lg cursor-pointer transition-colors"
          />
        </div>

        {/* Tabular-Nums SMPTE Timecode Readout */}
        <div className="order-2 sm:order-3 flex items-center gap-1.5 font-mono tabular-nums text-xs bg-[#0b0b0d] px-3.5 py-2 rounded-full border border-white/[0.08] whitespace-nowrap shrink-0">
          <span className="text-[#d4ff00] font-semibold">
            {formatTimecode(currentFrame)}
          </span>
          <span className="text-zinc-600" aria-hidden="true">
            /
          </span>
          <span className="text-zinc-400">
            {formatTimecode(durationInFrames)}
          </span>
        </div>
      </div>
    </div>
  );
};
