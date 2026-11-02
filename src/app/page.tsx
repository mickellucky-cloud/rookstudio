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

export default function RookStudioHome() {
  const [model, setModel] = useState<NvidiaModel>("deepseek-ai/deepseek-r1");
  const [style, setStyle] = useState<MotionStyle>("magnates");
  const [apiKey, setApiKey] = useState<string>("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

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
        // Fallback with warning
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
    <div className="min-h-screen bg-[#050608] flex flex-col font-sans">
      {/* Studio Header */}
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

      {/* Main Studio Workspace */}
      <main className="flex-1 p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 max-w-[1720px] w-full mx-auto">
        {/* Left Column: Scriptwriter & Reasoning Director */}
        <section className="lg:col-span-5 h-[calc(100vh-6.5rem)]">
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

        {/* Right Column: Player, Timeline, & Storyboard */}
        <section className="lg:col-span-7 h-[calc(100vh-6.5rem)] flex flex-col gap-4 overflow-y-auto pr-1">
          {/* Top: 16:9 Remotion Video Canvas */}
          <div className="h-[430px] shrink-0">
            <VideoCanvas
              shots={shots}
              topic={topic}
              activeShotIndex={activeShotIndex}
              onSelectShot={setActiveShotIndex}
            />
          </div>

          {/* Middle: Multi-track Timeline */}
          <div className="shrink-0">
            <TimelineTracks
              shots={shots}
              activeShotIndex={activeShotIndex}
              onSelectShot={(idx) => setActiveShotIndex(idx)}
            />
          </div>

          {/* Bottom: Storyboard Shots Breakdown */}
          <div className="flex-1 min-h-[300px]">
            <ShotCards
              shots={shots}
              activeShotIndex={activeShotIndex}
              onSelectShot={(idx) => setActiveShotIndex(idx)}
            />
          </div>
        </section>
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

