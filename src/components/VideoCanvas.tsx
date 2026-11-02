"use client";

import React, { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { PlayerRef } from "@remotion/player";
import { DocumentaryComposition } from "@/remotion/DocumentaryComposition";
import { ShotDirection } from "@/types";
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Maximize2,
  Film,
  Sparkles,
  Layers,
} from "lucide-react";

// Dynamically import Remotion Player to avoid SSR hydration mismatches
const Player = dynamic(
  () => import("@remotion/player").then((mod) => mod.Player),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-[#050608] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-amber-500/20 border-t-amber-500 animate-spin" />
        <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
          Mounting Remotion 60FPS Engine...
        </span>
      </div>
    ),
  }
);

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

  const durationInFrames =
    activeShotIndex !== null ? 90 : Math.max(shots.length * 90, 360);

  // Track playback status & frame
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current) {
        setIsPlaying(playerRef.current.isPlaying());
        setCurrentFrame(playerRef.current.getCurrentFrame());
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

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

  // Format frames to SMPTE timecode (HH:MM:SS:FF)
  const formatTimecode = (frames: number) => {
    const fps = 30;
    const totalSeconds = Math.floor(frames / fps);
    const ff = String(frames % fps).padStart(2, "0");
    const ss = String(totalSeconds % 60).padStart(2, "0");
    const mm = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    return `${mm}:${ss}:${ff}`;
  };

  return (
    <div className="flex flex-col h-full bg-[#090a0f] rounded-xl border border-white/[0.08] overflow-hidden shadow-2xl">
      {/* Cinema Monitor Bezel Header */}
      <div className="h-10 px-4 border-b border-white/[0.07] bg-[#0c0d13] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>REC</span>
          </div>

          <span className="text-xs font-mono font-bold text-zinc-300 tracking-wider">
            CANVAS // MASTER PREVIEW
          </span>

          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-zinc-400 border border-white/[0.06]">
            1080p • 60 FPS
          </span>
        </div>

        {/* Scene Focus Tabs */}
        <div className="flex items-center gap-1 bg-[#06070a] p-0.5 rounded-lg border border-white/[0.06]">
          <button
            onClick={() => onSelectShot(null)}
            className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded transition-all ${
              activeShotIndex === null
                ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30"
                : "text-zinc-500 hover:text-zinc-300 border border-transparent"
            }`}
          >
            All Sequences
          </button>
          {shots.map((shot, idx) => (
            <button
              key={shot.id || idx}
              onClick={() => onSelectShot(idx)}
              className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider rounded transition-all ${
                activeShotIndex === idx
                  ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30"
                  : "text-zinc-500 hover:text-zinc-300 border border-transparent"
              }`}
            >
              0{idx + 1} // {shot.sceneType.split("-")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main 16:9 Viewport */}
      <div className="relative flex-1 bg-[#030406] flex items-center justify-center p-3 overflow-hidden min-h-[300px]">
        <div className="w-full max-w-[880px] aspect-video rounded-lg overflow-hidden shadow-2xl border border-white/[0.08] relative bg-[#050608]">
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

          {/* Watermark */}
          <div className="absolute top-3 right-3 z-20 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-400">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>@byrook_tv</span>
          </div>

          {/* Active scene label */}
          <div className="absolute bottom-3 left-3 z-20 pointer-events-none px-2.5 py-1 rounded bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-amber-300 uppercase">
            {activeShotIndex !== null
              ? `Scene 0${activeShotIndex + 1}: ${shots[activeShotIndex]?.title}`
              : `Master Timeline: 4 Sequences`}
          </div>
        </div>
      </div>

      {/* Pro Transport Bar */}
      <div className="h-12 px-4 bg-[#0c0d13] border-t border-white/[0.07] flex items-center justify-between shrink-0 select-none">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleStep(-1)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            title="Step back 1 frame"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleTogglePlay}
            className="w-8 h-8 rounded-lg bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center transition-all shadow-glow font-bold"
            title="Play / Pause"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-black" />
            ) : (
              <Play className="w-4 h-4 fill-black translate-x-0.5" />
            )}
          </button>

          <button
            onClick={() => handleStep(1)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            title="Step forward 1 frame"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleRestart}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
            title="Restart playback"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Precision Scrubber */}
        <div className="flex-1 max-w-md mx-6 flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={durationInFrames - 1}
            value={currentFrame}
            onChange={(e) => {
              const f = parseInt(e.target.value, 10);
              setCurrentFrame(f);
              playerRef.current?.seekTo(f);
            }}
            className="w-full accent-amber-500 h-1 bg-white/[0.1] rounded-lg cursor-pointer transition-colors"
          />
        </div>

        {/* Timecode & Telemetry */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold bg-[#06070a] px-2.5 py-1 rounded border border-amber-500/20">
            <span>{formatTimecode(currentFrame)}</span>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-400">{formatTimecode(durationInFrames)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
