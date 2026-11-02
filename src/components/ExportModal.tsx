"use client";

import React, { useState, useRef } from "react";
import {
  Download,
  Upload,
  Copy,
  Check,
  Terminal,
  FileText,
  Code2,
  X,
  FileJson,
} from "lucide-react";
import { ShotDirection, MotionStyle, NvidiaModel } from "@/types";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: string;
  hook?: string;
  thinkingTrace?: string;
  fullScript: string;
  shots: ShotDirection[];
  style?: MotionStyle;
  model?: NvidiaModel;
  onImportProject?: (data: {
    topic?: string;
    hook?: string;
    thinkingTrace?: string;
    fullScript?: string;
    shots?: ShotDirection[];
    style?: MotionStyle;
    model?: NvidiaModel;
  }) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  topic,
  hook = "",
  thinkingTrace = "",
  fullScript,
  shots,
  style = "magnates",
  model = "deepseek-ai/deepseek-r1",
  onImportProject,
}) => {
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [downloadedJson, setDownloadedJson] = useState(false);
  const [activeTab, setActiveTab] = useState<"json" | "cli" | "script">("json");
  const [jsonScope, setJsonScope] = useState<"project" | "shots">("project");
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const safeSlug =
    topic
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "") || "documentary";

  const projectConfigPayload = {
    version: "1.0.0",
    exportedAt: new Date().toISOString(),
    channel: "@byrook_tv",
    topic,
    style,
    model,
    hook,
    thinkingTrace,
    fullScript,
    shots,
  };

  const activeJsonString =
    jsonScope === "project"
      ? JSON.stringify(projectConfigPayload, null, 2)
      : JSON.stringify(shots, null, 2);

  const cliCommand = `npx remotion render src/remotion/Root.tsx DocumentaryExplainer out/byrook_tv_${safeSlug}.mp4 --props='${JSON.stringify(
    {
      topic,
      shots,
    }
  )}'`;

  const handleCopy = (text: string, tabName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tabName);
    setTimeout(() => setCopiedTab(null), 1500);
  };

  const handleDownloadFile = (
    content: string,
    filename: string,
    mimeType: string
  ) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportShotConfigJson = () => {
    const filename =
      jsonScope === "project"
        ? `rook_studio_${safeSlug}_project.json`
        : `rook_studio_${safeSlug}_shots.json`;
    handleDownloadFile(
      activeJsonString,
      filename,
      "application/json;charset=utf-8"
    );
    setDownloadedJson(true);
    setTimeout(() => setDownloadedJson(false), 1800);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImportProject) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(String(event.target?.result || ""));
        if (Array.isArray(parsed)) {
          onImportProject({ shots: parsed });
          setImportStatus(`Imported ${parsed.length} shots`);
        } else if (parsed && typeof parsed === "object") {
          onImportProject({
            topic: parsed.topic,
            hook: parsed.hook,
            thinkingTrace: parsed.thinkingTrace,
            fullScript: parsed.fullScript,
            shots: Array.isArray(parsed.shots) ? parsed.shots : undefined,
            style: parsed.style,
            model: parsed.model,
          });
          setImportStatus("Project structure restored");
        }
        setTimeout(() => setImportStatus(null), 2500);
      } catch {
        setImportStatus("Invalid JSON file");
        setTimeout(() => setImportStatus(null), 2500);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm"
    >
      <div className="w-full max-w-2xl bg-[#141417] border-t sm:border border-white/[0.12] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b border-white/[0.08] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#d4ff00] flex items-center justify-center text-zinc-950 shrink-0">
              <Download className="w-4 h-4 stroke-[2.25]" />
            </div>
            <div>
              <h2
                id="export-modal-title"
                className="font-heading text-base font-bold text-white tracking-tight"
              >
                Export & Backup Production Pack
              </h2>
              <p className="text-xs text-zinc-400">
                Download shot configuration JSON, voiceover script, or Remotion
                CLI render command
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="min-h-[40px] min-w-[40px] rounded-full text-zinc-400 hover:text-white hover:bg-white/[0.06] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-white/[0.08] px-5 sm:px-6 pt-2 gap-2 bg-white/[0.01] overflow-x-auto scrollbar-none shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("json")}
            className={`min-h-[40px] px-3 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 border-b-2 whitespace-nowrap shrink-0 ${
              activeTab === "json"
                ? "border-[#d4ff00] text-[#d4ff00] bg-white/[0.03]"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Shot Configuration (.json)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("script")}
            className={`min-h-[40px] px-3 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 border-b-2 whitespace-nowrap shrink-0 ${
              activeTab === "script"
                ? "border-[#d4ff00] text-[#d4ff00] bg-white/[0.03]"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Voiceover Script (.md)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("cli")}
            className={`min-h-[40px] px-3 py-2 text-xs font-semibold rounded-t-lg transition-all flex items-center gap-1.5 border-b-2 whitespace-nowrap shrink-0 ${
              activeTab === "cli"
                ? "border-[#d4ff00] text-[#d4ff00] bg-white/[0.03]"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Remotion MP4 Command</span>
          </button>
        </div>

        {/* Content Box */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {activeTab === "json" && (
            <div className="space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Export your structured shot list and project state as a
                  portable JSON file for backup or collaboration:
                </p>

                {/* Scope Selector: Full Project Backup vs Shots Array Only */}
                <div className="flex items-center gap-1 bg-[#0b0b0e] p-1 rounded-full border border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setJsonScope("project")}
                    className={`min-h-[28px] px-3 py-0.5 rounded-full text-[11px] font-medium transition-colors whitespace-nowrap ${
                      jsonScope === "project"
                        ? "bg-[#d4ff00] text-zinc-950 font-semibold"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    Full Project + Shots
                  </button>
                  <button
                    type="button"
                    onClick={() => setJsonScope("shots")}
                    className={`min-h-[28px] px-3 py-0.5 rounded-full text-[11px] font-medium transition-colors whitespace-nowrap ${
                      jsonScope === "shots"
                        ? "bg-[#d4ff00] text-zinc-950 font-semibold"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    Shots Array Only ({shots.length})
                  </button>
                </div>
              </div>

              <div className="relative">
                <pre className="p-4 pt-12 sm:pt-4 bg-[#0b0b0e] border border-white/[0.1] rounded-2xl text-xs text-zinc-200 font-mono whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {activeJsonString}
                </pre>
                <div className="absolute top-2.5 right-2.5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExportShotConfigJson}
                    className="min-h-[34px] px-3.5 py-1.5 rounded-full bg-[#d4ff00] hover:bg-[#e1ff3b] text-zinc-950 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
                  >
                    {downloadedJson ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Exported JSON</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Download .json</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(activeJsonString, "json")}
                    className="min-h-[34px] px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
                  >
                    {copiedTab === "json" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#d4ff00]" />
                        <span>Copied</span>
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
            </div>
          )}

          {activeTab === "script" && (
            <div className="space-y-3">
              <p className="text-xs text-zinc-400 leading-relaxed">
                Complete voiceover script with pacing cues and sound design
                markers:
              </p>
              <div className="relative">
                <pre className="p-4 pt-12 sm:pt-4 bg-[#0b0b0e] border border-white/[0.1] rounded-2xl text-xs text-zinc-200 font-mono whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {fullScript}
                </pre>
                <div className="absolute top-2.5 right-2.5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadFile(
                        `# ${topic}\n\n${fullScript}`,
                        `rook_studio_${safeSlug}_script.md`,
                        "text/markdown;charset=utf-8"
                      )
                    }
                    className="min-h-[34px] px-3.5 py-1.5 rounded-full bg-[#d4ff00] hover:bg-[#e1ff3b] text-zinc-950 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download .md</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(fullScript, "script")}
                    className="min-h-[34px] px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
                  >
                    {copiedTab === "script" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#d4ff00]" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "cli" && (
            <div className="space-y-3">
              <p className="text-xs text-zinc-400 leading-relaxed">
                Run this command in your terminal to render this sequence to a
                high-bitrate MP4 video using the Remotion engine:
              </p>
              <div className="relative">
                <pre className="p-4 pt-12 sm:pt-4 bg-[#0b0b0e] border border-white/[0.1] rounded-2xl text-xs text-[#d4ff00] font-mono whitespace-pre-wrap break-all max-h-56 overflow-y-auto">
                  {cliCommand}
                </pre>
                <button
                  type="button"
                  onClick={() => handleCopy(cliCommand, "cli")}
                  className="absolute top-2.5 right-2.5 min-h-[34px] px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  {copiedTab === "cli" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#d4ff00]" />
                      <span>Copied</span>
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
        </div>

        {/* Footer with Direct JSON Export & Optional JSON Restore */}
        <div className="px-5 sm:px-6 py-4 bg-white/[0.02] border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {onImportProject && (
              <>
                <input
                  suppressHydrationWarning
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileImport}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="min-h-[40px] px-4 py-2 rounded-full bg-[#222228] hover:bg-[#2c2c34] text-xs font-medium text-zinc-200 flex items-center gap-1.5 transition-colors whitespace-nowrap"
                >
                  <Upload className="w-3.5 h-3.5 text-[#d4ff00]" />
                  <span>Import JSON Backup</span>
                </button>
              </>
            )}
            {importStatus && (
              <span className="text-xs font-mono text-[#d4ff00]">
                {importStatus}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[40px] px-4 py-2 rounded-full text-xs font-semibold text-zinc-400 hover:text-white transition-colors whitespace-nowrap"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleExportShotConfigJson}
              className="min-h-[40px] px-5 py-2 rounded-full text-xs font-semibold bg-[#d4ff00] text-zinc-950 hover:bg-[#e1ff3b] transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <FileJson className="w-3.5 h-3.5 stroke-[2.25]" />
              <span>
                {downloadedJson ? "JSON Downloaded" : "Export JSON File"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
