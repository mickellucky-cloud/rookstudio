"use client";

import React from "react";
import { ShotDirection } from "@/types";
import { Film, Newspaper, BarChart2, Network, Eye, Volume2 } from "lucide-react";

interface ShotCardsProps {
  shots: ShotDirection[];
  activeShotIndex: number | null;
  onSelectShot: (index: number) => void;
}

export const ShotCards: React.FC<ShotCardsProps> = ({
  shots,
  activeShotIndex,
  onSelectShot,
}) => {
  const getSceneIcon = (type: ShotDirection["sceneType"]) => {
    switch (type) {
      case "newspaper":
        return <Newspaper className="w-3 h-3 text-amber-400" />;
      case "kinetic-stat":
        return <BarChart2 className="w-3 h-3 text-cyan-400" />;
      case "conspiracy-board":
        return <Network className="w-3 h-3 text-rose-400" />;
      case "parallax":
      default:
        return <Film className="w-3 h-3 text-amber-400" />;
    }
  };

  const getSceneColor = (type: ShotDirection["sceneType"]) => {
    switch (type) {
      case "newspaper":
        return "text-amber-400 border-amber-500/30 bg-amber-500/10";
      case "kinetic-stat":
        return "text-cyan-400 border-cyan-500/30 bg-cyan-500/10";
      case "conspiracy-board":
        return "text-rose-400 border-rose-500/30 bg-rose-500/10";
      case "parallax":
      default:
        return "text-amber-400 border-amber-500/30 bg-amber-500/10";
    }
  };

  return (
    <div className="bg-[#090a0f] border border-white/[0.08] rounded-xl p-3.5 shadow-xl">
      <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <h3 className="text-[11px] font-mono font-bold text-zinc-300 uppercase tracking-widest">
            Storyboard & Visual Director
          </h3>
        </div>
        <span className="text-[10px] font-mono text-zinc-500">
          4 Camera Setups
        </span>
      </div>

      {/* 2x2 Grid of Storyboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {shots.map((shot, idx) => {
          const isSelected = activeShotIndex === idx;

          return (
            <div
              key={shot.id || idx}
              onClick={() => onSelectShot(idx)}
              className={`p-3 rounded-lg border transition-all cursor-pointer select-none ${
                isSelected
                  ? "bg-amber-500/[0.08] border-amber-400 shadow-glow"
                  : "bg-[#06070a] border-white/[0.06] hover:border-white/[0.14] hover:bg-white/[0.02]"
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${getSceneColor(
                      shot.sceneType
                    )}`}
                  >
                    {getSceneIcon(shot.sceneType)}
                    <span className="uppercase">{shot.sceneType}</span>
                  </span>
                  <span className="text-xs font-bold text-zinc-100 truncate">
                    {shot.title}
                  </span>
                </div>
                <span className="text-[9px] font-mono text-zinc-400 bg-white/[0.04] px-1.5 py-0.5 rounded">
                  {shot.timestamp}
                </span>
              </div>

              {/* Voiceover snippet */}
              <p className="text-[11px] text-zinc-300 font-medium line-clamp-1 mb-2">
                "{shot.narration}"
              </p>

              {/* Camera & Sound Telemetry */}
              <div className="pt-1.5 border-t border-white/[0.05] flex items-center justify-between text-[10px] font-mono text-zinc-400">
                <div className="flex items-center gap-1 truncate max-w-[65%]">
                  <Eye className="w-3 h-3 text-amber-400/80 shrink-0" />
                  <span className="truncate">{shot.cameraMovement}</span>
                </div>

                {shot.sfx && (
                  <div className="flex items-center gap-1 text-purple-400/90 shrink-0">
                    <Volume2 className="w-3 h-3 shrink-0" />
                    <span className="truncate">[SFX]</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
