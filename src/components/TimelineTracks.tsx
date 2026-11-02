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
    <div className="bg-[#090a0f] border border-white/[0.08] rounded-xl p-3.5 shadow-xl select-none">
      {/* Timeline Header & Time Ruler */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-[11px] font-mono font-bold text-zinc-300 uppercase tracking-widest">
            NLE Multi-Track Sequence
          </span>
        </div>
        <div className="text-[10px] font-mono text-zinc-500">
          SMPTE TC: 00:00:00:00 ➔ 00:00:16:00
        </div>
      </div>

      {/* Time Ruler with Ticks */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-16 shrink-0" />
        <div className="flex-1 flex justify-between text-[9px] font-mono text-zinc-600 px-1 border-b border-white/[0.05] pb-1">
          <span>00:00</span>
          <span>00:04</span>
          <span>00:08</span>
          <span>00:12</span>
          <span>00:16</span>
        </div>
      </div>

      <div className="space-y-1.5">
        {/* Track 1: Video Sequences */}
        <div className="flex items-center gap-2">
          <div className="w-16 flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 shrink-0">
            <Film className="w-3 h-3 text-amber-400" />
            <span className="font-semibold">V1</span>
          </div>
          <div className="flex-1 grid grid-cols-4 gap-1 bg-[#050608] p-1 rounded-lg border border-white/[0.06]">
            {shots.map((shot, idx) => (
              <button
                key={shot.id || idx}
                onClick={() => onSelectShot(idx)}
                className={`h-8 rounded px-2 text-left transition-all overflow-hidden flex flex-col justify-center border ${
                  activeShotIndex === idx
                    ? "bg-amber-500/20 border-amber-400 text-amber-300 font-bold shadow-sm"
                    : "bg-[#10121a] border-white/[0.06] text-zinc-300 hover:bg-[#161924]"
                }`}
              >
                <div className="text-[9px] font-mono uppercase tracking-wider text-amber-400/90 truncate">
                  0{idx + 1} • {shot.sceneType}
                </div>
                <div className="text-[10px] font-medium text-zinc-200 truncate">
                  {shot.title}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Track 2: Motion Graphics Overlays */}
        <div className="flex items-center gap-2">
          <div className="w-16 flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 shrink-0">
            <Type className="w-3 h-3 text-cyan-400" />
            <span className="font-semibold">V2</span>
          </div>
          <div className="flex-1 grid grid-cols-4 gap-1 bg-[#050608] p-1 rounded-lg border border-white/[0.06]">
            <div className="h-5 rounded bg-amber-500/10 border border-amber-500/20 px-2 flex items-center text-[9px] font-mono text-amber-400 truncate">
              2.5D Parallax Cam
            </div>
            <div className="h-5 rounded bg-amber-500/10 border border-amber-500/20 px-2 flex items-center text-[9px] font-mono text-amber-400 truncate">
              Highlighter Sweep
            </div>
            <div className="h-5 rounded bg-cyan-500/10 border border-cyan-500/20 px-2 flex items-center text-[9px] font-mono text-cyan-300 truncate">
              Area Chart Curve
            </div>
            <div className="h-5 rounded bg-rose-500/10 border border-rose-500/20 px-2 flex items-center text-[9px] font-mono text-rose-300 truncate">
              Red String Nexus
            </div>
          </div>
        </div>

        {/* Track 3: Voiceover Audio Track with Waveform Visualizer */}
        <div className="flex items-center gap-2">
          <div className="w-16 flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 shrink-0">
            <Mic className="w-3 h-3 text-emerald-400" />
            <span className="font-semibold">A1</span>
          </div>
          <div className="flex-1 bg-[#050608] p-1 rounded-lg border border-white/[0.06] flex items-center">
            <div className="w-full h-5 rounded bg-emerald-500/[0.07] border border-emerald-500/20 px-2.5 flex items-center justify-between text-[9px] font-mono text-emerald-400">
              <div className="flex items-center gap-2 truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="truncate">
                  Narration Audio Track // 48kHz Master
                </span>
              </div>
              {/* Simulated Audio Waveform Bar */}
              <div className="flex items-center gap-0.5 opacity-60">
                {[4, 10, 14, 8, 12, 16, 6, 11, 15, 9, 13, 7, 14, 10, 8, 12].map(
                  (h, i) => (
                    <span
                      key={i}
                      style={{ height: `${h}px` }}
                      className="w-0.5 bg-emerald-400 rounded-full"
                    />
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Track 4: Sound Design / SFX Track */}
        <div className="flex items-center gap-2">
          <div className="w-16 flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 shrink-0">
            <Volume2 className="w-3 h-3 text-purple-400" />
            <span className="font-semibold">A2</span>
          </div>
          <div className="flex-1 grid grid-cols-4 gap-1 bg-[#050608] p-1 rounded-lg border border-white/[0.06]">
            <div className="h-5 rounded bg-purple-500/10 border border-purple-500/20 px-2 flex items-center text-[9px] font-mono text-purple-300 truncate">
              ● Sub Bass Pulse
            </div>
            <div className="h-5 rounded bg-purple-500/10 border border-purple-500/20 px-2 flex items-center text-[9px] font-mono text-purple-300 truncate">
              ● Typewriter Click
            </div>
            <div className="h-5 rounded bg-purple-500/10 border border-purple-500/20 px-2 flex items-center text-[9px] font-mono text-purple-300 truncate">
              ● Digital Telemetry
            </div>
            <div className="h-5 rounded bg-purple-500/10 border border-purple-500/20 px-2 flex items-center text-[9px] font-mono text-purple-300 truncate">
              ● Document Slam
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
