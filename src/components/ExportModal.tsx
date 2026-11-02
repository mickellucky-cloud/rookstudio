"use client";

import React, { useState } from "react";
import { Download, Copy, Check, Terminal, FileText, Code2, X } from "lucide-react";
import { ShotDirection } from "@/types";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: string;
  fullScript: string;
  shots: ShotDirection[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  topic,
  fullScript,
  shots,
}) => {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"cli" | "script" | "json">("cli");

  if (!isOpen) return null;

  const cliCommand = `npx remotion render src/remotion/Root.tsx DocumentaryExplainer out/byrook_tv_${topic
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")}.mp4 --props='${JSON.stringify({
    topic,
    shots,
  })}'`;

  const handleCopy = (text: string, tabName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tabName);
    setTimeout(() => setCopiedTab(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#0c0d12] border border-white/[0.12] rounded-2xl shadow-card-depth overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Export Documentary Production Pack
              </h2>
              <p className="text-xs text-zinc-400">
                Ready for Remotion 60FPS render & YouTube upload on @byrook_tv
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-white/[0.08] px-6 pt-3 gap-2 bg-white/[0.01]">
          <button
            onClick={() => setActiveTab("cli")}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 border-b-2 ${
              activeTab === "cli"
                ? "border-amber-500 text-amber-400 bg-white/[0.04]"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Remotion MP4 Command</span>
          </button>
          <button
            onClick={() => setActiveTab("script")}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 border-b-2 ${
              activeTab === "script"
                ? "border-amber-500 text-amber-400 bg-white/[0.04]"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Voiceover Script (.md)</span>
          </button>
          <button
            onClick={() => setActiveTab("json")}
            className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 border-b-2 ${
              activeTab === "json"
                ? "border-amber-500 text-amber-400 bg-white/[0.04]"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Shot Breakdown (.json)</span>
          </button>
        </div>

        {/* Content Box */}
        <div className="p-6">
          {activeTab === "cli" && (
            <div className="space-y-3">
              <p className="text-xs text-zinc-400 leading-relaxed">
                Run this command in your terminal to render this explainer directly to a high-bitrate 60 FPS MP4 video using the Remotion engine:
              </p>
              <div className="relative">
                <pre className="p-4 bg-[#050608] border border-white/[0.1] rounded-xl text-xs text-amber-400 font-mono whitespace-pre-wrap break-all max-h-48 overflow-y-auto">
                  {cliCommand}
                </pre>
                <button
                  onClick={() => handleCopy(cliCommand, "cli")}
                  className="absolute top-2.5 right-2.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copiedTab === "cli" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Command</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {activeTab === "script" && (
            <div className="space-y-3">
              <p className="text-xs text-zinc-400 leading-relaxed">
                Complete voiceover script with exact Magnates/Fern pacing cues, pauses, and sound design markers:
              </p>
              <div className="relative">
                <pre className="p-4 bg-[#050608] border border-white/[0.1] rounded-xl text-xs text-zinc-300 font-mono whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {fullScript}
                </pre>
                <button
                  onClick={() => handleCopy(fullScript, "script")}
                  className="absolute top-2.5 right-2.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copiedTab === "script" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Script</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {activeTab === "json" && (
            <div className="space-y-3">
              <p className="text-xs text-zinc-400 leading-relaxed">
                Structured shot list metadata with camera motions and scene types:
              </p>
              <div className="relative">
                <pre className="p-4 bg-[#050608] border border-white/[0.1] rounded-xl text-xs text-zinc-300 font-mono whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {JSON.stringify(shots, null, 2)}
                </pre>
                <button
                  onClick={() => handleCopy(JSON.stringify(shots, null, 2), "json")}
                  className="absolute top-2.5 right-2.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copiedTab === "json" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white/[0.02] border-t border-white/[0.08] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-white text-black hover:bg-zinc-200 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

