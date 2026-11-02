import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#050608",
        card: "#0c0d12",
        "card-elevated": "#13151c",
        panel: "#090a0f",
        border: "rgba(255, 255, 255, 0.08)",
        "border-light": "rgba(255, 255, 255, 0.14)",
        "border-focus": "rgba(245, 158, 11, 0.5)",
        noir: {
          gold: "#f59e0b",
          amber: "#d97706",
          dark: "#08090c",
          red: "#ef4444",
          paper: "#e6e0d4",
        },
        fern: {
          cyan: "#06b6d4",
          emerald: "#10b981",
          blue: "#3b82f6",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "sans-serif"],
        mono: ["var(--font-geist-mono)", "Space Mono", "monospace"],
        heading: ["Space Grotesk", "Archivo", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(245, 158, 11, 0.15)",
        "glow-cyan": "0 0 25px -5px rgba(6, 182, 212, 0.15)",
        "card-depth": "0 20px 40px -15px rgba(0, 0, 0, 0.7)",
      },
      animation: {
        "pulse-subtle": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2.5s infinite linear",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
