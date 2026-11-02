"use client";

import React from "react";
import { NvidiaModel, MotionStyle } from "@/types";
import { AVAILABLE_MODELS } from "@/lib/nvidia";
import { Film, Sparkles, Key, Download, Cpu, Tv } from "lucide-react";

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
    <header className="h-16 border-b border-white/[0.08] bg-[#050608]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
      {/* Brand & Channel */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-glow border border-amber-400/40">
            <Film className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black tracking-widest text-white text-base">
                ROOK<span className="text-amber-500">STUDIO</span>
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.1] text-zinc-400">
                v1.0
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
              <Tv className="w-3 h-3 text-amber-500" />
              <span>@byrook_tv Documentary Suite</span>
            </div>
          </div>
        </div>

        {/* NVIDIA NIM Telemetry Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Cpu className="w-3.5 h-3.5" />
          <span>NVIDIA NIM ACCELERATED</span>
        </div>
      </div>

      {/* Center Controls: Model & Style Selectors */}
      <div className="flex items-center gap-3">
        {/* Style Selector */}
        <div className="bg-white/[0.04] p-1 rounded-xl border border-white/[0.08] flex items-center">
          <button
            onClick={() => setStyle("magnates")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              style === "magnates"
                ? "bg-amber-500 text-black shadow-glow font-bold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <span>🎩</span>
            <span>Magnates Noir</span>
          </button>
          <button
            onClick={() => setStyle("fern")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              style === "fern"
                ? "bg-cyan-500 text-black shadow-glow-cyan font-bold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <span>🌐</span>
            <span>Fern Data</span>
          </button>
        </div>

        {/* Model Selector */}
        <div className="relative">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value as NvidiaModel)}
            className="bg-[#0c0d12] border border-white/[0.12] hover:border-amber-500/40 text-xs font-medium text-white px-3 py-2 rounded-xl focus:outline-none focus:border-amber-500 cursor-pointer transition-colors"
          >
            {AVAILABLE_MODELS.map((m) => (
              <option key={m.id} value={m.id} className="bg-[#0c0d12] text-white">
                {m.name} ({m.tag})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenSettings}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl border transition-all ${
            hasCustomKey
              ? "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
              : "bg-white/[0.04] border-white/[0.08] text-zinc-300 hover:bg-white/[0.08]"
          }`}
          title="Configure NVIDIA API Key"
        >
          <Key className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {hasCustomKey ? "NVIDIA Key Active" : "Add NVIDIA Key"}
          </span>
        </button>

        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 transition-all shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Video</span>
        </button>
      </div>
    </header>
  );
};

