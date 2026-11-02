"use client";

import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    setInputVal(apiKey);
  }, [apiKey]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveKey(inputVal.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const handleClear = () => {
    setInputVal("");
    onSaveKey("");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-modal-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm"
    >
      <div className="w-full max-w-lg bg-[#141417] border-t sm:border border-white/[0.12] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#d4ff00] flex items-center justify-center text-zinc-950 shrink-0">
              <Key className="w-4 h-4 stroke-[2.25]" />
            </div>
            <div>
              <h2
                id="settings-modal-title"
                className="font-heading text-base font-bold text-white tracking-tight"
              >
                NVIDIA NIM API Credentials
              </h2>
              <p className="text-xs text-zinc-400">
                Powers DeepSeek-R1, Qwen Coder, and Llama 3.3 for @byrook_tv
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

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4">
          <div>
            <label
              htmlFor="nvidia-api-key-input"
              className="block text-xs font-medium text-zinc-300 mb-2"
            >
              API Key (nvapi-...)
            </label>
            <input
              suppressHydrationWarning
              id="nvidia-api-key-input"
              type="password"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="nvapi-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full min-h-[44px] bg-[#0b0b0e] border border-white/[0.1] rounded-2xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#d4ff00] font-mono transition-colors"
            />
          </div>

          {/* Privacy Guarantee */}
          <div className="p-3.5 rounded-2xl bg-[#1b1b20] border border-white/[0.06] flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-[#d4ff00] shrink-0 mt-0.5" />
            <div className="text-xs text-zinc-400 leading-relaxed">
              <span className="text-zinc-200 font-medium">
                Local Browser Storage:
              </span>{" "}
              Your key is stored in{" "}
              <code className="text-[#d4ff00] font-mono">localStorage</code> or
              read from the server environment variable{" "}
              <code className="text-[#d4ff00] font-mono">NVIDIA_API_KEY</code>.
            </div>
          </div>

          <a
            href="https://build.nvidia.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#d4ff00] hover:underline transition-colors font-medium"
          >
            <span>Generate a free NVIDIA NIM API key at build.nvidia.com</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Footer Actions */}
        <div className="px-5 sm:px-6 py-4 bg-white/[0.02] border-t border-white/[0.08] flex items-center justify-between gap-3">
          {inputVal ? (
            <button
              type="button"
              onClick={handleClear}
              className="min-h-[40px] px-3 text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 font-medium whitespace-nowrap shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Key</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[40px] px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="min-h-[40px] px-5 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 bg-[#d4ff00] hover:bg-[#e1ff3b] text-zinc-950"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved</span>
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
