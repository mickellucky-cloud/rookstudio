"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0a0c] text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#141417] border border-white/[0.1] rounded-3xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="font-heading text-lg font-bold text-white">
              Studio Session Interrupted
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              An unexpected issue occurred in the studio workspace. You can
              refresh the viewport to resume your saved session seamlessly.
            </p>
            {this.state.error?.message && (
              <pre className="text-[11px] font-mono text-zinc-500 bg-black/40 p-3 rounded-xl overflow-x-auto text-left">
                {this.state.error.message}
              </pre>
            )}
            <button
              type="button"
              onClick={this.handleReset}
              className="w-full min-h-[44px] rounded-full bg-[#d4ff00] hover:bg-[#e2ff42] text-zinc-950 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reload Studio Workspace</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
