"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Brain,
  ChevronDown,
  ChevronUp,
  Clock,
  Volume2,
  Wand2,
  FileEdit,
  Flame,
} from "lucide-react";

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
  "The Monopoly of Luxottica",
  "How Ryanair Secretly Became #1",
  "The Polymarket Billion Dollar Heist",
  "Why Red Bull is a Media Company",
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
  const [showThinking, setShowThinking] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#090a0f] rounded-xl border border-white/[0.08] p-4 shadow-xl overflow-hidden">
      {/* Console Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.07] mb-3 shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <h2 className="text-xs font-mono font-bold text-white tracking-widest uppercase">
            Investigative Narrative Director
          </h2>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono text-amber-400">
          <span>{modelName}</span>
        </div>
      </div>

      {/* Topic Prompt Command Bar */}
      <div className="space-y-2 mb-3 shrink-0">
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Documentary subject or company..."
            className="flex-1 bg-[#050608] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/50 transition-colors"
          />
          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-glow disabled:opacity-50 shrink-0"
          >
            {isGenerating ? (
              <>
                <Wand2 className="w-3.5 h-3.5 animate-spin" />
                <span>Directing...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Direct Script</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Concept Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {TOPIC_PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => setTopic(preset)}
              className="text-[10px] font-mono px-2 py-1 rounded bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-zinc-200 border border-white/[0.06] whitespace-nowrap transition-colors"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* DeepSeek Telemetry Banner */}
      {thinkingTrace && (
        <div className="mb-3 rounded-lg bg-[#06070a] border border-white/[0.08] overflow-hidden shrink-0">
          <button
            onClick={() => setShowThinking(!showThinking)}
            className="w-full px-3 py-2 bg-amber-500/[0.05] hover:bg-amber-500/10 flex items-center justify-between text-[11px] font-mono text-amber-400 transition-colors"
          >
            <div className="flex items-center gap-1.5 font-bold">
              <Brain className="w-3.5 h-3.5 text-amber-400" />
              <span>DeepSeek-R1 Cognitive Analysis</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-zinc-400">
              <span>{showThinking ? "Hide Trace" : "View Retention Logic"}</span>
              {showThinking ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </div>
          </button>

          {showThinking && (
            <div className="p-3 text-[11px] text-zinc-400 font-mono leading-relaxed whitespace-pre-wrap border-t border-white/[0.06] max-h-36 overflow-y-auto">
              {thinkingTrace}
            </div>
          )}
        </div>
      )}

      {/* Cold Open Hook Highlight Banner */}
      {hook && (
        <div className="mb-3 p-3 rounded-lg bg-[#0c0d14] border-l-2 border-amber-400 border border-white/[0.06] shrink-0">
          <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400 mb-1 flex items-center gap-1 font-bold">
            <Flame className="w-3 h-3 text-amber-400" />
            <span>0:00 - 0:15 Retention Hook</span>
          </div>
          <p className="text-xs text-zinc-200 font-medium leading-snug">
            "{hook}"
          </p>
        </div>
      )}

      {/* Voiceover Teleprompter Script */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 font-bold">
            <FileEdit className="w-3 h-3 text-amber-400" />
            <span>Voiceover & SFX Teleprompter</span>
          </span>
          <span className="text-[10px] font-mono text-zinc-500">
            Auto-Sync Ready
          </span>
        </div>

        <textarea
          value={fullScript}
          onChange={(e) => setFullScript(e.target.value)}
          placeholder="Generating complete investigative script with timestamps and sound design tags..."
          className="flex-1 w-full bg-[#050608] border border-white/[0.08] rounded-lg p-3 text-xs text-zinc-300 font-mono leading-relaxed focus:outline-none focus:border-amber-500/50 resize-none transition-colors"
        />
      </div>
    </div>
  );
};
