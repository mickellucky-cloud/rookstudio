"use client";

import React, { useState } from "react";
import { Sparkles, Brain, ChevronDown, ChevronUp, Clock, Volume2, Wand2 } from "lucide-react";

interface ScriptDirectorProps {
  topic: string;
  setTopic: (t: string) => void;
  hook: string;
  thinkingTrace?: string;
  fullScript: string;
  setFullScript: (s: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  modelName: string;
}

const TOPIC_PRESETS = [
  "The Secret Monopoly of Luxottica",
  "How Ryanair Secretly Became the Most Profitable Airline",
  "The Untold Story of Polymarket's Billion Dollar Rise",
  "Why Red Bull is Actually an Extreme Sports Media Empire",
];

export const ScriptDirector: React.FC<ScriptDirectorProps> = ({
  topic,
  setTopic,
  hook,
  thinkingTrace,
  fullScript,
  setFullScript,
  onGenerate,
  isGenerating,
  modelName,
}) => {
  const [showThinking, setShowThinking] = useState(true);

  return (
    <div className="flex flex-col h-full bg-[#0c0d12] rounded-2xl border border-white/[0.08] p-5 shadow-card-depth overflow-hidden">
      {/* Title & Prompt Bar */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold text-white tracking-wide uppercase">
              Investigative Script & Narrative
            </h2>
          </div>
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
            {modelName}
          </span>
        </div>

        {/* Topic Input Bar */}
        <div className="flex gap-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter documentary topic (e.g. How Rolex Created False Scarcity)..."
            className="flex-1 bg-[#050608] border border-white/[0.1] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-glow disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {isGenerating ? (
              <>
                <Wand2 className="w-3.5 h-3.5 animate-spin" />
                <span>Directing...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-3.5 h-3.5" />
                <span>Direct Script</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Topic Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[10px] text-zinc-500 font-mono uppercase shrink-0">
            Presets:
          </span>
          {TOPIC_PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => setTopic(preset)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-zinc-200 border border-white/[0.05] whitespace-nowrap transition-colors"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* DeepSeek Reasoning Drawer */}
      {thinkingTrace && (
        <div className="mb-4 rounded-xl bg-[#07080b] border border-amber-500/20 overflow-hidden">
          <button
            onClick={() => setShowThinking(!showThinking)}
            className="w-full px-3.5 py-2.5 bg-amber-500/[0.05] flex items-center justify-between text-xs font-mono font-bold text-amber-400 hover:bg-amber-500/10 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Brain className="w-3.5 h-3.5" />
              <span>DeepSeek-R1 Cognitive Telemetry</span>
            </div>
            {showThinking ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {showThinking && (
            <div className="p-3.5 text-xs text-zinc-400 font-mono leading-relaxed whitespace-pre-wrap border-t border-amber-500/10 max-h-36 overflow-y-auto">
              {thinkingTrace}
            </div>
          )}
        </div>
      )}

      {/* Cold Open Hook Highlight Banner */}
      {hook && (
        <div className="mb-4 p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-l-4 border-amber-500 border-t border-r border-b border-white/[0.05]">
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 mb-1 flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            <span>0:00 - 0:15 Cold Open Retention Hook</span>
          </div>
          <p className="text-xs text-zinc-200 font-medium italic">
            "{hook}"
          </p>
        </div>
      )}

      {/* Voiceover Script Body */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-zinc-400" />
            <span>Voiceover Script & Sound Cues</span>
          </span>
          <span className="text-[11px] text-zinc-500 font-mono">
            Editable Markdown
          </span>
        </div>

        <textarea
          value={fullScript}
          onChange={(e) => setFullScript(e.target.value)}
          placeholder="Generating complete investigative script with timestamps and sound design tags..."
          className="flex-1 w-full bg-[#050608] border border-white/[0.08] rounded-xl p-3.5 text-xs text-zinc-200 font-mono leading-relaxed focus:outline-none focus:border-amber-500/50 resize-none transition-colors"
        />
      </div>
    </div>
  );
};

