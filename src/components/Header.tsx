"use client";

import React from "react";
import { NvidiaModel, MotionStyle } from "@/types";
import { AVAILABLE_MODELS } from "@/lib/nvidia";
import {
  Clapperboard,
  TrendingUp,
  Key,
  Download,
  Cpu,
  Layers,
  ChevronDown,
} from "lucide-react";

interface HeaderProps {
  model: NvidiaModel;
  setModel: (m: NvidiaModel) => void;
  style: MotionStyle;
  setStyle: (s: MotionStyle) => void;
  hasCustomKey: boolean;
  onOpenSettings: () => void;
  onOpenExport: () => void;
  isGenerating: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  model,
  setModel,
  style,
  setStyle,
  hasCustomKey,
  onOpenSettings,
  onOpenExport,
  isGenerating,
}) => {
  return (
    <header className="h-14 border-b border-white/[0.07] bg-[#07080b]/95 backdrop-blur-xl px-5 flex items-center justify-between sticky top-0 z-50 select-none">
      {/* Brand & Signature Channel */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3">
          {/* Cinema Aperture Icon */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-[#1c1e28] to-[#0c0d12] flex items-center justify-center border border-amber-500/30 shadow-sm relative group">
            <div className="absolute inset-0 bg-amber-500/10 rounded-lg blur-sm group-hover:bg-amber-500/20 transition-colors" />
            <Layers className="w-4 h-4 text-amber-400 relative z-10" />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-heading font-extrabold tracking-wider text-white text-sm">
              ROOK<span className="text-amber-400">STUDIO</span>
            </span>
            <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
              // @BYROOK_TV
            </span>
          </div>
        </div>

        {/* NVIDIA Telemetry Status */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/[0.06] border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="tracking-wider">NVIDIA NIM ACTIVE</span>
        </div>
      </div>

      {/* Center Controls: Pro Style Switcher & Model Selector */}
      <div className="flex items-center gap-2.5">
        {/* Cinematic Segmented Style Switch */}
        <div className="bg-[#0f1016] p-0.5 rounded-lg border border-white/[0.08] flex items-center">
          <button
            onClick={() => setStyle("magnates")}
            className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5 ${
              style === "magnates"
                ? "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm font-semibold"
                : "text-zinc-400 hover:text-zinc-200 border border-transparent"
            }`}
          >
            <Clapperboard className="w-3.5 h-3.5 text-amber-400" />
            <span>Magnates Noir</span>
          </button>
          <button
            onClick={() => setStyle("fern")}
            className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all flex items-center gap-1.5 ${
              style === "fern"
                ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm font-semibold"
                : "text-zinc-400 hover:text-zinc-200 border border-transparent"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            <span>Fern Economic</span>
          </button>
        </div>

        {/* Model Picker */}
        <div className="relative">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value as NvidiaModel)}
            className="appearance-none bg-[#0f1016] border border-white/[0.08] hover:border-white/[0.16] text-[11px] font-mono text-zinc-200 pl-3 pr-7 py-1.5 rounded-lg focus:outline-none focus:border-amber-500/50 cursor-pointer transition-colors"
          >
            {AVAILABLE_MODELS.map((m) => (
              <option key={m.id} value={m.id} className="bg-[#0c0d12] text-zinc-200">
                {m.name} — {m.tag}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenSettings}
          className={`flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg border transition-all ${
            hasCustomKey
              ? "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
              : "bg-white/[0.03] border-white/[0.08] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06]"
          }`}
          title="Configure NVIDIA API Key"
        >
          <Key className="w-3 h-3" />
          <span className="hidden sm:inline">
            {hasCustomKey ? "Key Configured" : "NVIDIA API Key"}
          </span>
        </button>

        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 text-[11px] font-bold px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black transition-all shadow-glow"
        >
          <Download className="w-3 h-3 stroke-[2.5]" />
          <span>Export Master</span>
        </button>
      </div>
    </header>
  );
};
