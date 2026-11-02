"use client";

import React from "react";
import { MotionStyle, ShotDirection } from "@/types";
import {
  getDefaultEffectForScene,
  getEffectPresetById,
} from "@/lib/effectsLibrary";
import { Film, Type, Mic, Volume2 } from "lucide-react";

interface TimelineTracksProps {
  shots: ShotDirection[];
  style?: MotionStyle;
  activeShotIndex: number | null;
  onSelectShot: (index: number | null) => void;
}

const MOTION_LAYER_LABELS: Record<ShotDirection["sceneType"], string> = {
  parallax: "2.5D Depth Cam",
  newspaper: "Archival Press",
  "kinetic-stat": "Telemetry Curve",
  "conspiracy-board": "Evidence Network",
  map: "Geo Supply Arc",
};

export const TimelineTracks: React.FC<TimelineTracksProps> = ({
  shots,
  style = "magnates",
  activeShotIndex,
  onSelectShot,
}) => {
  const totalDurationSec = shots.reduce(
    (sum, s) => sum + Math.max(1, s.duration ?? 4),
    0
  );
  const formatTotalTimecode = (sec: number) => {
    const mm = String(Math.floor(sec / 60)).padStart(2, "0");
    const ss = String(Math.floor(sec % 60)).padStart(2, "0");
    return `00:${mm}:${ss}:00`;
  };
  const proportionalColumns =
    shots.length > 0
      ? shots
          .map((s) => `minmax(90px, ${Math.max(1, s.duration ?? 4)}fr)`)
          .join(" ")
      : "1fr";

  return (
    <div className="select-none">
      {/* Timeline Header & Metadata */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 text-xs text-zinc-300">
          <span className="font-semibold text-white">
            Multi-Track Master Sequence
          </span>
          <span className="text-zinc-600" aria-hidden="true">
            ·
          </span>
          <span className="text-zinc-400">
            Select any track clip to solo in Cinema Monitor
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono tabular-nums text-zinc-400">
          {activeShotIndex !== null && (
            <button
              type="button"
              onClick={() => onSelectShot(null)}
              className="text-[#d4ff00] hover:underline underline-offset-4 transition-colors"
            >
              Return to Full Reel
            </button>
          )}
          <span>00:00:00:00 – {formatTotalTimecode(totalDurationSec)}</span>
        </div>
      </div>

      {/* Horizontal Scroll Container for Mobile Ergonomics */}
      <div className="overflow-x-auto pb-1">
        <div className="min-w-[660px] space-y-2">
          {/* Timecode Ruler */}
          <div className="flex items-center gap-3">
            <div className="w-20 shrink-0 text-[11px] font-mono text-zinc-500">
              TRACK
            </div>
            <div className="flex-1 flex justify-between text-[11px] font-mono tabular-nums text-zinc-500 px-1 border-b border-white/[0.06] pb-1.5">
              {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
                const sec = Math.round(totalDurationSec * pct);
                const mm = String(Math.floor(sec / 60)).padStart(2, "0");
                const ss = String(sec % 60).padStart(2, "0");
                return <span key={pct}>{`${mm}:${ss}`}</span>;
              })}
            </div>
          </div>

          {/* Track V1: Primary Visual Scenes */}
          <div className="flex items-center gap-3">
            <div className="w-20 flex items-center gap-1.5 text-xs font-mono text-zinc-300 shrink-0">
              <Film className="w-3.5 h-3.5 text-[#d4ff00] shrink-0" />
              <span className="font-semibold">V1 Video</span>
            </div>
            <div
              className="flex-1 grid gap-1.5 bg-[#0c0c0f] p-1.5 rounded-xl border border-white/[0.06]"
              style={{
                gridTemplateColumns: proportionalColumns,
              }}
            >
              {shots.map((shot, idx) => {
                const isSelected = activeShotIndex === idx;
                return (
                  <button
                    key={shot.id || idx}
                    type="button"
                    onClick={() => onSelectShot(isSelected ? null : idx)}
                    className={`min-h-[48px] rounded-lg px-3 py-1.5 text-left transition-all overflow-hidden flex flex-col justify-center border ${
                      isSelected
                        ? "bg-[#d4ff00]/15 border-[#d4ff00] text-white"
                        : "bg-[#16161b] border-white/[0.07] text-zinc-300 hover:bg-[#1e1e24]"
                    }`}
                  >
                    <div className="text-[10px] font-mono tabular-nums text-[#d4ff00] truncate">
                      0{idx + 1} · {shot.timestamp} ({shot.duration ?? 4}s)
                    </div>
                    <div className="text-xs font-semibold text-zinc-100 truncate mt-0.5">
                      {shot.title}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Track V2: Remotion Motion Overlays & Effect Library Layer */}
          <div className="flex items-center gap-3">
            <div className="w-20 flex items-center gap-1.5 text-xs font-mono text-zinc-300 shrink-0">
              <Type className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="font-semibold">V2 FX</span>
            </div>
            <div
              className="flex-1 grid gap-1.5 bg-[#0c0c0f] p-1.5 rounded-xl border border-white/[0.06]"
              style={{
                gridTemplateColumns: proportionalColumns,
              }}
            >
              {shots.map((shot, idx) => {
                const isSelected = activeShotIndex === idx;
                const fxId =
                  shot.effectPreset ||
                  getDefaultEffectForScene(style, shot.sceneType);
                const fxName = getEffectPresetById(fxId)?.name || fxId;
                return (
                  <button
                    key={`v2-${shot.id || idx}`}
                    type="button"
                    onClick={() => onSelectShot(isSelected ? null : idx)}
                    className={`min-h-[38px] rounded-lg px-2.5 flex items-center justify-between gap-1 text-left text-[11px] font-mono truncate transition-colors border ${
                      isSelected
                        ? "bg-cyan-500/15 border-cyan-400/50 text-cyan-200 font-medium"
                        : "bg-cyan-500/[0.06] border-cyan-500/20 text-cyan-300/90 hover:bg-cyan-500/10"
                    }`}
                  >
                    <span className="truncate">
                      {MOTION_LAYER_LABELS[shot.sceneType] ||
                        shot.cameraMovement}{" "}
                      · {fxName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Track A1: Master Voiceover Bus */}
          <div className="flex items-center gap-3">
            <div className="w-20 flex items-center gap-1.5 text-xs font-mono text-zinc-300 shrink-0">
              <Mic className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-semibold">A1 Voice</span>
            </div>
            <div className="flex-1 bg-[#0c0c0f] p-1.5 rounded-xl border border-white/[0.06]">
              <div className="w-full min-h-[36px] rounded-lg bg-emerald-500/[0.06] border border-emerald-500/20 px-3 flex items-center justify-between gap-4 text-[11px] font-mono text-emerald-300">
                <div className="flex items-center gap-2 truncate">
                  <span className="font-medium text-emerald-200">
                    Investigative Voiceover Bus
                  </span>
                  <span className="text-emerald-500/60" aria-hidden="true">
                    ·
                  </span>
                  <span className="text-emerald-300/80 truncate">
                    48kHz Broadcast Master
                  </span>
                </div>
                <div
                  aria-hidden="true"
                  className="flex items-center gap-1 opacity-70 shrink-0"
                >
                  {[
                    6, 12, 16, 9, 14, 18, 8, 13, 17, 10, 15, 7, 14, 11, 9, 13,
                    16, 8, 12, 10,
                  ].map((h, i) => (
                    <span
                      key={i}
                      style={{ height: `${h}px` }}
                      className="w-0.5 bg-emerald-400 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Track A2: Foley & Sound Design Cues */}
          <div className="flex items-center gap-3">
            <div className="w-20 flex items-center gap-1.5 text-xs font-mono text-zinc-300 shrink-0">
              <Volume2 className="w-3.5 h-3.5 text-[#d4ff00]/80 shrink-0" />
              <span className="font-semibold">A2 Foley</span>
            </div>
            <div
              className="flex-1 grid gap-1.5 bg-[#0c0c0f] p-1.5 rounded-xl border border-white/[0.06]"
              style={{
                gridTemplateColumns: proportionalColumns,
              }}
            >
              {shots.map((shot, idx) => {
                const isSelected = activeShotIndex === idx;
                return (
                  <button
                    key={`a2-${shot.id || idx}`}
                    type="button"
                    onClick={() => onSelectShot(isSelected ? null : idx)}
                    className={`min-h-[36px] rounded-lg px-2.5 flex items-center text-left text-[11px] font-mono truncate transition-colors border ${
                      isSelected
                        ? "bg-[#d4ff00]/15 border-[#d4ff00]/50 text-[#d4ff00] font-medium"
                        : "bg-white/[0.03] border-white/[0.07] text-zinc-300 hover:bg-white/[0.06]"
                    }`}
                  >
                    <span className="truncate">
                      SFX: {shot.sfx || "Sub bass pulse"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
