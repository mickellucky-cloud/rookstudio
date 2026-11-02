# 🎬 RookStudio — AI Documentary & Motion Graphics Suite

Built exclusively for **@byrook_tv** to produce animated documentary explainers in the cinematic style of **[MagnatesMedia](https://www.youtube.com/@MagnatesMedia)** and **[Fern](https://www.youtube.com/@fern-tv)**.

Powered by **NVIDIA NIM** (DeepSeek-R1, Qwen 2.5 Coder, Llama 3.3) and **Remotion** (React-based 60 FPS video rendering).

---

## ⚡ Features

1. **Investigative Script & Narrative Director:**
   - **DeepSeek-R1 Cognitive Telemetry:** Live chain-of-thought `<think>` drawer breaking down audience retention mechanics, mystery hooks, and 3-act escalation.
   - Pacing timestamps and explicit sound design cues (`[SFX: Typewriter click]`, `[SFX: Sub bass drone]`, `[SFX: Tape hiss]`).

2. **Procedural Motion Graphics Engine (Remotion):**
   - **Scene 1: 2.5D Parallax Portrait** — Vintage monochrome photo cutout, Ken Burns 3D push-in, floating dust particles, and dark amber spotlight.
   - **Scene 2: Archival Newspaper Reveal** — Leaked memo headline with animated yellow highlighter sweep and red confidential stamp.
   - **Scene 3: Fern-Style Kinetic Metric** — Minimalist coordinate grid, animated numerical counter, and glowing vector area chart.
   - **Scene 4: Conspiracy Board** — Dark corkboard with pinned evidence cards and red string connections.

3. **In-Browser 60 FPS Video Monitor:**
   - Real-time scrubbable video canvas with sequence focus switching and timecode tracking.

4. **Multi-Track Production Timeline:**
   - Visualizing V1 Video, V2 Motion Overlays, A1 Voiceover, and A2 Sound Design tracks.

5. **1-Click Export Suite:**
   - Remotion CLI render command for high-bitrate MP4 output.
   - Formatted Voiceover Markdown script for narration recording.
   - Shot-by-shot JSON metadata.

---

## 🚀 Running Locally

```bash
# 1. Navigate to the project directory
cd rook-studio

# 2. Run the development server
npx pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploying to Vercel

1. Push this project to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: initial RookStudio for @byrook_tv"
   gh repo create rook-studio --public --source=. --push
   ```
2. Import the repository into [Vercel](https://vercel.com/new).
3. Under **Environment Variables**, add:
   * `NVIDIA_API_KEY`: Your key from [build.nvidia.com](https://build.nvidia.com) (`nvapi-...`).
4. Click **Deploy**!

