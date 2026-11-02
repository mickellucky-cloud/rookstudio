"use client";

import React, { useState } from "react";
import { Key, ShieldCheck, ExternalLink, X, Check, Trash2 } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveKey: (key: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveKey,
}) => {
  const [inputVal, setInputVal] = useState(apiKey);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveKey(inputVal.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    setInputVal("");
    onSaveKey("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-[#0c0d12] border border-white/[0.12] rounded-2xl shadow-card-depth overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                NVIDIA NIM API Key
              </h2>
              <p className="text-xs text-zinc-400">
                Powers DeepSeek-R1, Qwen Coder, and Llama 3.3 for @byrook_tv
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

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              API Key (nvapi-...)
            </label>
            <div className="relative">
              <input
                type="password"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="nvapi-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full bg-[#050608] border border-white/[0.1] rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500 font-mono transition-colors"
              />
            </div>
          </div>

          {/* Privacy Guarantee */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-zinc-400 leading-relaxed">
              <span className="text-zinc-200 font-medium">100% Client-Side Privacy:</span>{" "}
              Your key is saved directly in your browser’s{" "}
              <code className="text-amber-400 font-mono">localStorage</code>. When deployed to Vercel, you can also store it securely as an environment variable (
              <code className="text-amber-400 font-mono">NVIDIA_API_KEY</code>).
            </div>
          </div>

          {/* Link to generate key */}
          <a
            href="https://build.nvidia.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors font-medium"
          >
            <span>Get your free NVIDIA API Key from build.nvidia.com</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-white/[0.02] border-t border-white/[0.08] flex items-center justify-between">
          {inputVal ? (
            <button
              onClick={handleClear}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Key</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                savedSuccess
                  ? "bg-emerald-500 text-black shadow-glow"
                  : "bg-amber-500 hover:bg-amber-400 text-black shadow-glow"
              }`}
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Key</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

