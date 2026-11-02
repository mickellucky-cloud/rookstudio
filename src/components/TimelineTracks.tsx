"use client";

import React from "react";
import { ShotDirection } from "@/types";
import { Film, Type, Mic, Volume2 } from "lucide-react";

interface TimelineTracksProps {
  shots: ShotDirection[];
  activeShotIndex: number | null;
  onSelectShot: (index: number) => void;
}

export const TimelineTracks: React.FC<TimelineTracksProps> = ({
  shots,
  activeShotIndex,
  onSelectShot,
}) => {
  return (
    <div className="bg-[#0c0d12] border border-white/[0.08] rounded-2xl p-4 shadow-card-depth">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
          Multi-Track Production Timeline
        </span>
        <span className="text-[11px] font-mono text-zinc-500">
          00:00:00 — 00:00:16 (Preview Duration)
        </span>
      </div>

      <div className="space-y-2">
        {/* Track 1: Video Scene Blocks */}
        <div className="flex items-center gap-3">
          <div className="w-20 flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 shrink-0">
            <Film className="w-3.5 h-3.5 text-amber-500" />
            <span>V1 Video</span>
          </div>
          <div className="flex-1 grid grid-cols-4 gap-1.5 bg-[#050608] p-1 rounded-xl border border-white/[0.06]">
            {shots.map((shot, idx) => (
              <button
                key={shot.id || idx}
                onClick={() => onSelectShot(idx)}
                className={`h-9 rounded-lg px-2 text-left transition-all overflow-hidden flex flex-col justify-center border ${
                  activeShotIndex === idx
                    ? "bg-amber-500/20 border-amber-500 text-amber-300 font-bold"
                    : "bg-white/[0.04] border-white/[0.06] text-zinc-300 hover:bg-white/[0.08]"
                }`}
              >
                <div className="text-[10px] font-mono uppercase tracking-wider truncate">
                  {idx + 1}. {shot.sceneType}
                </div>
                <div className="text-[10px] font-medium text-zinc-400 truncate">
                  {shot.title}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Track 2: Overlays & Motion Graphics */}
        <div className="flex items-center gap-3">
          <div className="w-20 flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 shrink-0">
            <Type className="w-3.5 h-3.5 text-cyan-400" />
            <span>V2 Motion</span>
          </div>
          <div className="flex-1 grid grid-cols-4 gap-1.5 bg-[#050608] p-1 rounded-xl border border-white/[0.06]">
            <div className="h-6 rounded-md bg-amber-500/10 border border-amber-500/20 px-2 flex items-center text-[10px] font-mono text-amber-400 truncate">
              Archival 2.5D Badge
            </div>
            <div className="h-6 rounded-md bg-amber-500/10 border border-amber-500/20 px-2 flex items-center text-[10px] font-mono text-amber-400 truncate">
              Highlighter Sweep
            </div>
            <div className="h-6 rounded-md bg-cyan-500/10 border border-cyan-500/20 px-2 flex items-center text-[10px] font-mono text-cyan-400 truncate">
              Area Chart Draw
            </div>
            <div className="h-6 rounded-md bg-rose-500/10 border border-rose-500/20 px-2 flex items-center text-[10px] font-mono text-rose-400 truncate">
              Red String Graph
            </div>
          </div>
        </div>

        {/* Track 3: Voiceover Sync */}
        <div className="flex items-center gap-3">
          <div className="w-20 flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 shrink-0">
            <Mic className="w-3.5 h-3.5 text-emerald-400" />
            <span>A1 Voice</span>
          </div>
          <div className="flex-1 bg-[#050608] p-1.5 rounded-xl border border-white/[0.06] flex items-center gap-1">
            <div className="w-full h-5 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-3 flex items-center justify-between text-[10px] font-mono text-emerald-400">
              <span className="truncate">Cold Open Narrative Track • @byrook_tv</span>
              <span className="shrink-0 font-bold">WAV 48kHz</span>
            </div>
          </div>
        </div>

        {/* Track 4: Sound Design / SFX */}
        <div className="flex items-center gap-3">
          <div className="w-20 flex items-center gap-1.5 text-[11px] font-mono text-zinc-400 shrink-0">
            <Volume2 className="w-3.5 h-3.5 text-purple-400" />
            <span>A2 SFX</span>
          </div>
          <div className="flex-1 grid grid-cols-4 gap-1.5 bg-[#050608] p-1 rounded-xl border border-white/[0.06]">
            <div className="h-5 rounded-md bg-purple-500/10 border border-purple-500/20 px-2 flex items-center text-[10px] font-mono text-purple-300 truncate">
              [Sub Bass Drop]
            </div>
            <div className="h-5 rounded-md bg-purple-500/10 border border-purple-500/20 px-2 flex items-center text-[10px] font-mono text-purple-300 truncate">
              [Typewriter Click]
            </div>
            <div className="h-5 rounded-md bg-purple-500/10 border border-purple-500/20 px-2 flex items-center text-[10px] font-mono text-purple-300 truncate">
              [Digital Telemetry]
            </div>
            <div className="h-5 rounded-md bg-purple-500/10 border border-purple-500/20 px-2 flex items-center text-[10px] font-mono text-purple-300 truncate">
              [Gavel Slam]
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

