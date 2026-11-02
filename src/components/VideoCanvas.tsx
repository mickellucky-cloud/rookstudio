"use client";

import React, { useRef, useState } from "react";
import { Player, PlayerRef } from "@remotion/player";
import { DocumentaryComposition } from "@/remotion/DocumentaryComposition";
import { ShotDirection } from "@/types";
import {
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Layers,
  Sparkles,
} from "lucide-react";

interface VideoCanvasProps {
  shots: ShotDirection[];
  topic: string;
  activeShotIndex: number | null;
  onSelectShot: (index: number | null) => void;
}

export const VideoCanvas: React.FC<VideoCanvasProps> = ({
  shots,
  topic,
  activeShotIndex,
  onSelectShot,
}) => {
  const playerRef = useRef<PlayerRef>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);

  const durationInFrames = activeShotIndex !== null ? 90 : Math.max(shots.length * 90, 360);

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

  return (
    <div className="flex flex-col h-full bg-[#07080b] rounded-2xl border border-white/[0.08] overflow-hidden shadow-card-depth">
      {/* Top Bar of Canvas */}
      <div className="px-4 py-3 border-b border-white/[0.08] flex items-center justify-between bg-black/40 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
            Live Preview Monitor
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
            60 FPS
          </span>
        </div>

        {/* Scene Focus Switcher */}
        <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-lg border border-white/[0.08]">
          <button
            onClick={() => onSelectShot(null)}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all ${
              activeShotIndex === null
                ? "bg-amber-500 text-black font-bold shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            All Sequences
          </button>
          {shots.map((shot, idx) => (
            <button
              key={shot.id || idx}
              onClick={() => onSelectShot(idx)}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all ${
                activeShotIndex === idx
                  ? "bg-amber-500 text-black font-bold shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Scene {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main 16:9 Remotion Video Player */}
      <div className="relative flex-1 bg-black flex items-center justify-center p-3">
        <div className="w-full max-w-[960px] aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/[0.1] relative bg-[#050608]">
          <Player
            ref={playerRef}
            component={DocumentaryComposition}
            inputProps={{
              shots,
              activeSceneOverride: activeShotIndex,
              topic,
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

          {/* Overlay watermark */}
          <div className="absolute top-4 right-4 z-20 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-400">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>@byrook_tv</span>
          </div>
        </div>
      </div>

      {/* Player Transport Bar */}
      <div className="px-4 py-3 bg-[#0c0d12] border-t border-white/[0.08] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleTogglePlay}
            className="w-9 h-9 rounded-xl bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center transition-all shadow-glow font-bold"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-black" />
            ) : (
              <Play className="w-4 h-4 fill-black translate-x-0.5" />
            )}
          </button>

          <button
            onClick={handleRestart}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors"
            title="Restart playback"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="text-xs font-mono text-zinc-400">
            <span className="text-white font-bold">
              {Math.floor(currentFrame / 30)}s
            </span>{" "}
            / {Math.floor(durationInFrames / 30)}s
          </div>
        </div>

        {/* Quality Metadata */}
        <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono">
          <div className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-zinc-400" />
            <span>1920 × 1080 (HD)</span>
          </div>
          <span className="text-zinc-700">•</span>
          <span>ProRes / H.264 Ready</span>
        </div>
      </div>
    </div>
  );
};
