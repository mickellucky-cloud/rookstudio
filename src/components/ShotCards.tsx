"use client";

import React from "react";
import { ShotDirection } from "@/types";
import { Camera, Volume2, Film, Newspaper, BarChart2, Network, Eye } from "lucide-react";

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
        return <Newspaper className="w-3.5 h-3.5 text-amber-400" />;
      case "kinetic-stat":
        return <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />;
      case "conspiracy-board":
        return <Network className="w-3.5 h-3.5 text-rose-400" />;
      case "parallax":
      default:
        return <Film className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  const getSceneBadgeColor = (type: ShotDirection["sceneType"]) => {
    switch (type) {
      case "newspaper":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "kinetic-stat":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
      case "conspiracy-board":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      case "parallax":
      default:
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0c0d12] rounded-2xl border border-white/[0.08] p-5 shadow-card-depth overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-amber-500" />
          <h2 className="text-sm font-bold text-white tracking-wide uppercase">
            Storyboard & Shot Director
          </h2>
        </div>
        <span className="text-xs text-zinc-500 font-mono">
          {shots.length} Sequences
        </span>
      </div>

      <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
        Click any sequence to inspect and scrub the live Remotion composition.
      </p>

      {/* List of Shot Cards */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {shots.map((shot, idx) => {
          const isSelected = activeShotIndex === idx;

          return (
            <div
              key={shot.id || idx}
              onClick={() => onSelectShot(idx)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? "bg-amber-500/[0.08] border-amber-500/50 shadow-glow"
                  : "bg-[#07080b] border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.02]"
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${getSceneBadgeColor(
                      shot.sceneType
                    )}`}
                  >
                    {getSceneIcon(shot.sceneType)}
                    <span className="uppercase">{shot.sceneType}</span>
                  </span>
                  <span className="text-xs font-bold text-white">
                    {shot.title}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-semibold text-zinc-400 bg-white/[0.04] px-2 py-0.5 rounded">
                  {shot.timestamp}
                </span>
              </div>

              {/* Voiceover line */}
              <p className="text-xs text-zinc-200 mb-2 font-medium line-clamp-2">
                "{shot.narration}"
              </p>

              {/* Metadata tags */}
              <div className="space-y-1.5 pt-2 border-t border-white/[0.05] text-[11px] font-mono">
                <div className="flex items-start gap-1.5 text-zinc-400">
                  <Eye className="w-3 h-3 text-amber-500/80 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{shot.cameraMovement}</span>
                </div>

                {shot.sfx && (
                  <div className="flex items-center gap-1.5 text-amber-400/90">
                    <Volume2 className="w-3 h-3 text-amber-500 shrink-0" />
                    <span>[SFX: {shot.sfx}]</span>
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

