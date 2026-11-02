"use client";

import React from "react";
import { PanelLeft, Diamond } from "lucide-react";

export type WorkspaceSection = "director" | "monitor" | "timeline" | "storyboard";

interface HeaderProps {
  activeSection: WorkspaceSection;
  onNavigateSection: (section: WorkspaceSection) => void;
  onOpenSettings: () => void;
  onOpenExport: () => void;
  hasCustomKey: boolean;
  onToggleDrawer?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onNavigateSection,
  onOpenSettings,
  onOpenExport,
  hasCustomKey,
  onToggleDrawer,
}) => {
  return (
    <header className="h-16 border-b border-white/[0.06] bg-[#0a0a0c]/90 backdrop-blur-xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6 sticky top-0 z-40 select-none">
      {/* Zone 1: Left Sidebar Toggle + Brand Lockup */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onToggleDrawer}
          aria-label="Toggle studio workspace drawer"
          className="min-h-[40px] min-w-[40px] rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] flex items-center justify-center transition-colors"
        >
          <PanelLeft className="w-5 h-5" />
        </button>

        <a
          href="#workspace-top"
          onClick={(e) => {
            e.preventDefault();
            onNavigateSection("director");
          }}
          className="hidden sm:inline-flex items-center gap-2.5 font-heading text-base font-bold tracking-tight text-white whitespace-nowrap shrink-0"
        >
          <span>Rook Studio</span>
        </a>
      </div>

      {/* Zone 2: Concise Single-Line Navigation Links */}
      <nav
        aria-label="Studio workspace navigation"
        className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-400"
      >
        <button
          type="button"
          onClick={() => onNavigateSection("director")}
          className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
            activeSection === "director"
              ? "text-white font-semibold"
              : "hover:text-zinc-100"
          }`}
        >
          Prompt Director
        </button>
        <button
          type="button"
          onClick={() => onNavigateSection("storyboard")}
          className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
            activeSection === "storyboard"
              ? "text-white font-semibold"
              : "hover:text-zinc-100"
          }`}
        >
          Scene Cards
        </button>
        <button
          type="button"
          onClick={() => onNavigateSection("monitor")}
          className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
            activeSection === "monitor"
              ? "text-white font-semibold"
              : "hover:text-zinc-100"
          }`}
        >
          Cinema Monitor
        </button>
        <button
          type="button"
          onClick={() => onNavigateSection("timeline")}
          className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
            activeSection === "timeline"
              ? "text-white font-semibold"
              : "hover:text-zinc-100"
          }`}
        >
          Timeline & Script
        </button>
        <button
          type="button"
          onClick={onOpenSettings}
          className="py-1 text-zinc-400 hover:text-zinc-100 transition-colors whitespace-nowrap shrink-0"
        >
          {hasCustomKey ? "NIM Key Set" : "API Key"}
        </button>
      </nav>

      {/* Zone 3: Signature Higgsfield Acid-Lime Pill CTA */}
      <div className="flex items-center shrink-0">
        <button
          type="button"
          onClick={onOpenExport}
          className="min-h-[40px] px-4 py-2 rounded-full bg-[#d4ff00] hover:bg-[#e1ff3b] active:scale-[0.98] text-zinc-950 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all whitespace-nowrap shrink-0 shadow-sm"
        >
          <Diamond className="w-3.5 h-3.5 fill-zinc-950 stroke-[2] shrink-0" />
          <span>Export Master</span>
        </button>
      </div>
    </header>
  );
};
