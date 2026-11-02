"use client";

import React, { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, Copy, Check } from "lucide-react";

interface ScriptDirectorProps {
  topic: string;
  setTopic: (t: string) => void;
  hook: string;
  setHook?: (h: string) => void;
  thinkingTrace?: string;
  fullScript: string;
  setFullScript: (s: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  modelName: string;
}

export const ScriptDirector: React.FC<ScriptDirectorProps> = ({
  hook,
  setHook,
  thinkingTrace,
  fullScript,
  setFullScript,
  modelName,
}) => {
  const [showThinking, setShowThinking] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const scriptMetrics = useMemo(() => {
    const words = fullScript
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    const estSeconds = Math.max(12, Math.round((words / 145) * 60));
    const mins = Math.floor(estSeconds / 60);
    const secs = String(estSeconds % 60).padStart(2, "0");
    return {
      words,
      readTime: `${mins}:${secs}`,
    };
  }, [fullScript]);

  const handleCopyScript = () => {
    navigator.clipboard.writeText(fullScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 1500);
  };

  return (
    <div className="flex flex-col h-full bg-[#141417] rounded-[24px] border border-white/[0.08] p-4 sm:p-5">
      {/* Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-2 pb-3.5 border-b border-white/[0.06] mb-4 shrink-0">
        <div>
          <h2 className="font-heading text-base font-bold text-white tracking-tight">
            Script & Retention Teleprompter
          </h2>
          <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
            <span>3-Act Documentary Structure</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[#d4ff00]">{modelName}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono tabular-nums text-zinc-400">
          <span>{scriptMetrics.words} words</span>
          <span aria-hidden="true">·</span>
          <span>Est. {scriptMetrics.readTime} VO</span>
        </div>
      </div>

      {/* Cold Open Paradox Callout */}
      {hook !== undefined && (
        <div className="mb-3.5 p-3.5 rounded-2xl bg-[#1b1b20] border border-white/[0.08] shrink-0">
          <div className="flex items-center justify-between gap-2 text-xs text-[#d4ff00] mb-1.5">
            <label htmlFor="cold-open-hook-input" className="font-semibold">
              Cold Open Paradox Hook
            </label>
            <span className="font-mono tabular-nums text-[11px] text-zinc-400">
              00:00 – 00:15
            </span>
          </div>
          {setHook ? (
            <input
              suppressHydrationWarning
              id="cold-open-hook-input"
              type="text"
              value={hook}
              onChange={(e) => setHook(e.target.value)}
              placeholder="Write a 1-sentence paradox hook..."
              className="w-full bg-transparent text-xs sm:text-sm text-zinc-100 font-medium leading-relaxed focus:outline-none border-b border-transparent focus:border-[#d4ff00]/40 pb-0.5 transition-colors"
            />
          ) : (
            <p className="text-xs sm:text-sm text-zinc-100 font-medium leading-relaxed">
              “{hook}”
            </p>
          )}
        </div>
      )}

      {/* Cognitive Retention Reasoning Accordion */}
      {thinkingTrace && (
        <div className="mb-3.5 rounded-2xl bg-[#0e0e11] border border-white/[0.07] overflow-hidden shrink-0">
          <button
            type="button"
            onClick={() => setShowThinking(!showThinking)}
            aria-expanded={showThinking}
            className="w-full min-h-[40px] px-3.5 py-2 hover:bg-white/[0.03] flex items-center justify-between gap-2 text-xs text-zinc-200 transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-semibold text-[#d4ff00] whitespace-nowrap">
                Retention Trace
              </span>
              <span className="text-zinc-600" aria-hidden="true">
                ·
              </span>
              <span className="text-zinc-400 truncate">
                Curiosity Gap & Pacing Strategy
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-zinc-400 whitespace-nowrap shrink-0">
              <span>{showThinking ? "Hide" : "Inspect"}</span>
              {showThinking ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </div>
          </button>

          {showThinking && (
            <div className="p-3.5 text-xs text-zinc-300 font-mono leading-relaxed whitespace-pre-wrap border-t border-white/[0.06] max-h-40 overflow-y-auto bg-[#0a0a0c]">
              {thinkingTrace}
            </div>
          )}
        </div>
      )}

      {/* Voiceover Teleprompter Editor */}
      <div className="flex-1 flex flex-col min-h-[240px]">
        <div className="flex items-center justify-between gap-2 mb-2">
          <label
            htmlFor="teleprompter-script-editor"
            className="text-xs font-medium text-zinc-300"
          >
            Voiceover & Sound Design Script
          </label>
          <button
            type="button"
            onClick={handleCopyScript}
            className="min-h-[32px] px-3 py-1 rounded-full bg-[#222227] hover:bg-[#2c2c32] text-xs text-zinc-200 flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          >
            {copiedScript ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#d4ff00]" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span>Copy Script</span>
              </>
            )}
          </button>
        </div>

        <textarea
          suppressHydrationWarning
          id="teleprompter-script-editor"
          value={fullScript}
          onChange={(e) => setFullScript(e.target.value)}
          placeholder="Write or generate investigative script with timestamps and [SFX: ...] cues..."
          className="flex-1 w-full min-h-[200px] bg-[#0c0c0f] border border-white/[0.07] rounded-2xl p-3.5 text-xs sm:text-[13px] text-zinc-200 font-mono leading-relaxed focus:outline-none focus:border-[#d4ff00]/50 resize-y lg:resize-none transition-colors"
        />
      </div>
    </div>
  );
};
