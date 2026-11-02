import React from "react";
import { Sequence } from "remotion";
import { ParallaxPortraitScene } from "./scenes/ParallaxPortraitScene";
import { NewspaperRevealScene } from "./scenes/NewspaperRevealScene";
import { KineticStatScene } from "./scenes/KineticStatScene";
import { ConspiracyBoardScene } from "./scenes/ConspiracyBoardScene";
import { GeoMapScene } from "./scenes/GeoMapScene";
import { MotionStyle, ShotDirection } from "@/types";
import { getDefaultEffectForScene } from "@/lib/effectsLibrary";

export interface DocumentaryCompositionProps {
  shots?: ShotDirection[];
  activeSceneOverride?: number | null;
  topic?: string;
  style?: MotionStyle;
}

export const DocumentaryComposition: React.FC<DocumentaryCompositionProps> = ({
  shots = [],
  activeSceneOverride = null,
  topic = "The Secret Monopoly",
  style = "magnates",
}) => {
  if (activeSceneOverride !== null && shots[activeSceneOverride]) {
    const shot = shots[activeSceneOverride];
    return renderScene(shot, topic, style);
  }

  const defaultShots: ShotDirection[] =
    shots.length > 0
      ? shots
      : [
          {
            id: "shot-1",
            timestamp: "0:00 - 0:04",
            duration: 4,
            title: "THE COLD OPEN HOOK",
            sceneType: "parallax",
            effectPreset: "dust-vignette",
            narration:
              "How one Italian workshop silently took over 80% of the eyewear on Earth.",
            visualPrompt:
              "2.5D monochrome photo zoom with vintage amber lighting",
            cameraMovement: "Slow push-in on subject",
            sfx: "Sub bass pulse + tape hiss",
            headlineText: "LEONARDO DEL VECCHIO",
          },
          {
            id: "shot-2",
            timestamp: "0:04 - 0:08",
            duration: 4,
            title: "THE EXCLUSIVE LEAK",
            sceneType: "newspaper",
            effectPreset: "spotlight-sweep",
            narration:
              "Internal documents reveal competitor brands were systematically acquired or wiped out.",
            visualPrompt:
              "Archival Financial Times masthead with yellow highlighter animation",
            cameraMovement: "Camera tilt and zoom to text",
            sfx: "Paper rustle + typewriter click",
            headlineText: "SECRET AGREEMENT EXPOSES 80% EYEWEAR MONOPOLY",
          },
          {
            id: "shot-3",
            timestamp: "0:08 - 0:12",
            duration: 4,
            title: "THE ECONOMIC REALITY",
            sceneType: "kinetic-stat",
            effectPreset: "crt-telemetry",
            narration:
              "A single conglomerate controlling 84.2% of global retail points.",
            visualPrompt:
              "Minimalist Fern grid with animated percentage counter and rising curve",
            cameraMovement: "Subtle drift",
            sfx: "Clean digital telemetry chirp",
            statValue: "84.2",
          },
          {
            id: "shot-4",
            timestamp: "0:12 - 0:16",
            duration: 4,
            title: "THE CONSPIRACY BOARD",
            sceneType: "conspiracy-board",
            effectPreset: "red-string-pulse",
            narration:
              "Behind dozens of household brand names sat the exact same boardroom.",
            visualPrompt:
              "Red strings connecting retail contracts to offshore shell subsidiaries",
            cameraMovement: "Pan across evidence cards",
            sfx: "Heavy typewriter slam",
            headlineText: "LUXOTTICA GROUP",
          },
        ];

  const FPS = 30;
  let cumulativeFrames = 0;

  return (
    <div style={{ flex: 1, backgroundColor: "#050608" }}>
      {defaultShots.map((shot, index) => {
        const shotDurationFrames = Math.max(
          1,
          Math.round((shot.duration ?? 4) * FPS)
        );
        const fromFrame = cumulativeFrames;
        cumulativeFrames += shotDurationFrames;

        return (
          <Sequence
            key={shot.id || index}
            from={fromFrame}
            durationInFrames={shotDurationFrames}
          >
            {renderScene(shot, topic, style)}
          </Sequence>
        );
      })}
    </div>
  );
};

function renderScene(
  shot: ShotDirection,
  topic: string,
  style: MotionStyle
) {
  const effectPreset =
    shot.effectPreset || getDefaultEffectForScene(style, shot.sceneType);

  switch (shot.sceneType) {
    case "newspaper":
      return (
        <NewspaperRevealScene
          mainHeadline={
            shot.headlineText || "CONFIDENTIAL MEMO CONFIRMS RETAIL COLLUSION"
          }
          subSnippet={shot.narration}
          highlightedText="controls global retail pricing across all major department chains"
          style={style}
          effectPreset={effectPreset}
        />
      );
    case "kinetic-stat":
      return (
        <KineticStatScene
          statValue={shot.statValue || "84.2"}
          label={shot.title || "GLOBAL MARKET CONSOLIDATION"}
          contextNote={topic.toUpperCase()}
          metricComparison={shot.narration}
          style={style}
          effectPreset={effectPreset}
        />
      );
    case "conspiracy-board":
      return (
        <ConspiracyBoardScene
          centerSubject={shot.headlineText || "LUXOTTICA GROUP"}
          node1="OAKLEY & RAY-BAN"
          node2="LENSCRAFTERS / PEARLE"
          node3="TARGET & SEARS OPTICAL"
          verdictLabel={shot.narration}
          style={style}
          effectPreset={effectPreset}
        />
      );
    case "map":
      return (
        <GeoMapScene
          title={shot.title || "GLOBAL SUPPLY CORRIDOR"}
          headlineText={shot.headlineText || topic.toUpperCase()}
          narration={shot.narration}
          locationCoords={
            shot.locationCoords || "MILAN · ZURICH · NEW YORK · TOKYO"
          }
          style={style}
          effectPreset={effectPreset}
        />
      );
    case "parallax":
    default:
      return (
        <ParallaxPortraitScene
          title={shot.title || "THE $500 ILLUSION"}
          subtitle={shot.narration}
          headline={shot.headlineText || "THE MASTER ARCHITECT"}
          vintageLabel={`${style.toUpperCase()} ARCHIVE · @BYROOK_TV`}
          style={style}
          effectPreset={effectPreset}
        />
      );
  }
}
