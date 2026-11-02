"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { ScriptDirector } from "@/components/ScriptDirector";
import { VideoCanvas } from "@/components/VideoCanvas";
import { ShotCards } from "@/components/ShotCards";
import { TimelineTracks } from "@/components/TimelineTracks";
import { SettingsModal } from "@/components/SettingsModal";
import { ExportModal } from "@/components/ExportModal";
import { NvidiaModel, MotionStyle, ShotDirection } from "@/types";
import { AVAILABLE_MODELS } from "@/lib/nvidia";
import { Film, LayoutGrid, Terminal } from "lucide-react";

export default function RookStudioHome() {
  const [model, setModel] = useState<NvidiaModel>("deepseek-ai/deepseek-r1");
  const [style, setStyle] = useState<MotionStyle>("magnates");
  const [apiKey, setApiKey] = useState<string>("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [bottomDockTab, setBottomDockTab] = useState<"timeline" | "storyboard">("timeline");

  // Project state
  const [topic, setTopic] = useState("The Secret Monopoly of Luxottica");
  const [hook, setHook] = useState(
    "You think you have a choice when buying sunglasses. In reality, you've been buying from one man for 40 years."
  );
  const [thinkingTrace, setThinkingTrace] = useState(
    "DeepSeek-R1 Retention Analysis:\n1. Hook: Attack the illusion of free consumer choice ($500 designer vs $20 frames have identical $4 factory costs).\n2. Narrative Tension: Escalating hostile takeovers of Oakley & LensCrafters.\n3. Climax: Reveal the global pricing cartel controlling 84% of department store optical shelves."
  );
  const [fullScript, setFullScript] = useState(
    `[0:00 - 0:15] [SFX: Cinematic sub-bass rumble]\n"Walk into any shopping mall in America or Europe, and you'll see dozens of competing brands. Ray-Ban, Oakley, Chanel, Prada, Oliver Peoples.\n\n[0:15 - 0:35] [SFX: Typewriter click + paper rustle]\nWhat 99% of consumers never realize is that behind almost every single pair sits one single conglomerate in Milan, Italy.\n\n[0:35 - 1:00] [SFX: Clean digital telemetry chirp]\nThey don't just own the brands. They own the retail stores, the optical insurance, and the factories.\n\n[1:00 - 1:30] [SFX: Heavy typewriter slam]\nThis is the secret monopoly that quietly took over 80% of what the world sees."`
  );

  const [shots, setShots] = useState<ShotDirection[]>([
    {
      id: "shot-1",
      timestamp: "0:00 - 0:04",
      title: "THE COLD OPEN HOOK",
      sceneType: "parallax",
      narration: "How one Italian workshop silently took over 80% of the eyewear on Earth.",
      visualPrompt: "2.5D monochrome photo zoom with vintage amber lighting and floating dust particles",
      cameraMovement: "Slow 2.5D push-in on subject eye line",
      sfx: "Sub bass pulse + tape hiss",
      headlineText: "LEONARDO DEL VECCHIO",
    },
    {
      id: "shot-2",
      timestamp: "0:04 - 0:08",
      title: "THE EXCLUSIVE LEAK",
      sceneType: "newspaper",
      narration: "Internal documents reveal competitor brands were systematically acquired or wiped out.",
      visualPrompt: "Archival Financial Times masthead with yellow highlighter sweep animation",
      cameraMovement: "Camera tilt and zoom to text",
      sfx: "Paper rustle + typewriter click",
      headlineText: "SECRET AGREEMENT EXPOSES 80% EYEWEAR MONOPOLY",
    },
    {
      id: "shot-3",
      timestamp: "0:08 - 0:12",
      title: "THE ECONOMIC REALITY",
      sceneType: "kinetic-stat",
      narration: "A single conglomerate controlling 84.2% of global retail points.",
      visualPrompt: "Minimalist Fern grid with animated percentage counter and rising curve",
      cameraMovement: "Subtle drift",
      sfx: "Clean digital telemetry chirp",
      statValue: "84.2",
    },
    {
      id: "shot-4",
      timestamp: "0:12 - 0:16",
      title: "THE CONSPIRACY BOARD",
      sceneType: "conspiracy-board",
      narration: "Behind dozens of household brand names sat the exact same boardroom.",
      visualPrompt: "Red strings connecting retail contracts to offshore shell subsidiaries",
      cameraMovement: "Pan across evidence cards",
      sfx: "Heavy typewriter slam",
      headlineText: "LUXOTTICA GROUP",
    },
  ]);

  const [activeShotIndex, setActiveShotIndex] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Load saved key on mount
  useEffect(() => {
    const saved = localStorage.getItem("ROOKSTUDIO_NVIDIA_KEY");
    if (saved) setApiKey(saved);
  }, []);

  const handleSaveKey = (key: string) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem("ROOKSTUDIO_NVIDIA_KEY", key);
    } else {
      localStorage.removeItem("ROOKSTUDIO_NVIDIA_KEY");
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          style,
          model,
          customApiKey: apiKey,
        }),
      });

      const data = await res.json();

      if (data.fallback) {
        setHook(data.fallback.hook || hook);
        setFullScript(data.fallback.fullScript || fullScript);
        setThinkingTrace(data.fallback.thinking || thinkingTrace);
        if (data.fallback.shots?.length) setShots(data.fallback.shots);
      } else {
        if (data.hook) setHook(data.hook);
        if (data.fullScript) setFullScript(data.fullScript);
        if (data.thinking) setThinkingTrace(data.thinking);
        if (data.shots?.length) setShots(data.shots);
      }
    } catch (err) {
      console.error("Generate error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentModelMeta = AVAILABLE_MODELS.find((m) => m.id === model);

  return (
    <div className="min-h-screen bg-[#07080b] flex flex-col text-zinc-100">
      {/* Studio Top Navigation */}
      <Header
        model={model}
        setModel={setModel}
        style={style}
        setStyle={setStyle}
        hasCustomKey={Boolean(apiKey)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        isGenerating={isGenerating}
      />

      {/* Main Studio Console */}
      <main className="flex-1 p-4 md:p-6 max-w-[1780px] w-full mx-auto space-y-4">
        {/* Upper Workspace: Side-by-Side Creative Director & Cinema Viewport */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: Narrative & Retention Director */}
          <section className="lg:col-span-5 h-[580px] flex flex-col">
            <ScriptDirector
              topic={topic}
              setTopic={setTopic}
              hook={hook}
              thinkingTrace={thinkingTrace}
              fullScript={fullScript}
              setFullScript={setFullScript}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              modelName={currentModelMeta?.name || "DeepSeek-R1"}
            />
          </section>

          {/* Right Column: Hero Cinema Monitor */}
          <section className="lg:col-span-7 h-[580px] flex flex-col">
            <VideoCanvas
              shots={shots}
              topic={topic}
              activeShotIndex={activeShotIndex}
              onSelectShot={setActiveShotIndex}
            />
          </section>
        </div>

        {/* Lower Workspace: Docked Production Suite (Timeline & Storyboard) */}
        <div className="bg-[#090a0f] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl">
          {/* Dock Navigation Tabs */}
          <div className="h-10 px-4 bg-[#0c0d13] border-b border-white/[0.07] flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setBottomDockTab("timeline")}
                className={`px-3 py-1 text-xs font-mono uppercase tracking-wider rounded-md transition-all flex items-center gap-1.5 ${
                  bottomDockTab === "timeline"
                    ? "bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30"
                    : "text-zinc-400 hover:text-zinc-200 border border-transparent"
                }`}
              >
                <Film className="w-3.5 h-3.5 text-amber-400" />
                <span>NLE Sequence Timeline</span>
              </button>

              <button
                onClick={() => setBottomDockTab("storyboard")}
                className={`px-3 py-1 text-xs font-mono uppercase tracking-wider rounded-md transition-all flex items-center gap-1.5 ${
                  bottomDockTab === "storyboard"
                    ? "bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30"
                    : "text-zinc-400 hover:text-zinc-200 border border-transparent"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5 text-cyan-400" />
                <span>Storyboard & Visuals ({shots.length})</span>
              </button>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-500">
              <span>ACTIVE MODEL: {currentModelMeta?.name}</span>
              <span>•</span>
              <span>ENGINE: REMOTION 4.0</span>
            </div>
          </div>

          {/* Dock Panel Body */}
          <div className="p-4">
            {bottomDockTab === "timeline" ? (
              <TimelineTracks
                shots={shots}
                activeShotIndex={activeShotIndex}
                onSelectShot={(idx) => setActiveShotIndex(idx)}
              />
            ) : (
              <ShotCards
                shots={shots}
                activeShotIndex={activeShotIndex}
                onSelectShot={(idx) => setActiveShotIndex(idx)}
              />
            )}
          </div>
        </div>
      </main>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveKey={handleSaveKey}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        topic={topic}
        fullScript={fullScript}
        shots={shots}
      />
    </div>
  );
}
