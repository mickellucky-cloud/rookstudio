import React from "react";
import { Sequence } from "remotion";
import { ParallaxPortraitScene } from "./scenes/ParallaxPortraitScene";
import { NewspaperRevealScene } from "./scenes/NewspaperRevealScene";
import { KineticStatScene } from "./scenes/KineticStatScene";
import { ConspiracyBoardScene } from "./scenes/ConspiracyBoardScene";
import { ShotDirection } from "@/types";

export interface DocumentaryCompositionProps {
  shots?: ShotDirection[];
  activeSceneOverride?: number | null;
  topic?: string;
}

export const DocumentaryComposition: React.FC<DocumentaryCompositionProps> = ({
  shots = [],
  activeSceneOverride = null,
  topic = "The Secret Monopoly",
}) => {
  // If activeSceneOverride is set, render just that scene in full loop
  if (activeSceneOverride !== null && shots[activeSceneOverride]) {
    const shot = shots[activeSceneOverride];
    return renderScene(shot, topic);
  }

  // Otherwise, sequence through the shots (each shot is ~90 to 120 frames = 3 to 4 sec)
  const defaultShots: ShotDirection[] = shots.length > 0 ? shots : [
    {
      id: "shot-1",
      timestamp: "0:00 - 0:03",
      title: "THE COLD OPEN HOOK",
      sceneType: "parallax",
      narration: "How one Italian workshop silently took over 80% of the eyewear on Earth.",
      visualPrompt: "2.5D monochrome photo zoom with vintage amber lighting",
      cameraMovement: "Slow push-in on subject",
      sfx: "Sub bass pulse + tape hiss",
      headlineText: "LEONARDO DEL VECCHIO",
    },
    {
      id: "shot-2",
      timestamp: "0:03 - 0:06",
      title: "THE EXCLUSIVE LEAK",
      sceneType: "newspaper",
      narration: "Internal documents reveal competitor brands were systematically acquired or wiped out.",
      visualPrompt: "Archival Financial Times masthead with yellow highlighter animation",
      cameraMovement: "Camera tilt and zoom to text",
      sfx: "Paper rustle + typewriter click",
      headlineText: "SECRET AGREEMENT EXPOSES 80% EYEWEAR MONOPOLY",
    },
    {
      id: "shot-3",
      timestamp: "0:06 - 0:09",
      title: "THE ECONOMIC REALITY",
      sceneType: "kinetic-stat",
      narration: "A single conglomerate controlling 84% of global retail points.",
      visualPrompt: "Minimalist Fern grid with animated percentage counter and rising curve",
      cameraMovement: "Subtle drift",
      sfx: "Clean digital telemetry chirp",
      statValue: "84.2",
    },
    {
      id: "shot-4",
      timestamp: "0:09 - 0:12",
      title: "THE CONSPIRACY BOARD",
      sceneType: "conspiracy-board",
      narration: "Behind dozens of household brand names sat the exact same boardroom.",
      visualPrompt: "Red strings connecting retail contracts to offshore shell subsidiaries",
      cameraMovement: "Pan across evidence cards",
      sfx: "Heavy typewriter slam",
    },
  ];

  const SCENE_DURATION_FRAMES = 90; // 3 seconds at 30fps

  return (
    <div style={{ flex: 1, backgroundColor: "#050608" }}>
      {defaultShots.map((shot, index) => (
        <Sequence
          key={shot.id || index}
          from={index * SCENE_DURATION_FRAMES}
          durationInFrames={SCENE_DURATION_FRAMES}
        >
          {renderScene(shot, topic)}
        </Sequence>
      ))}
    </div>
  );
};

function renderScene(shot: ShotDirection, topic: string) {
  switch (shot.sceneType) {
    case "newspaper":
      return (
        <NewspaperRevealScene
          mainHeadline={shot.headlineText || "CONFIDENTIAL MEMO CONFIRMS RETAIL COLLUSION"}
          subSnippet={shot.narration}
          highlightedText="controls global retail pricing across all major department chains"
        />
      );
    case "kinetic-stat":
      return (
        <KineticStatScene
          statValue={shot.statValue || "84.2"}
          label={shot.title || "GLOBAL MARKET CONSOLIDATION"}
          contextNote={topic.toUpperCase()}
          metricComparison={shot.narration}
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
        />
      );
    case "parallax":
    default:
      return (
        <ParallaxPortraitScene
          title={shot.title || "THE $500 ILLUSION"}
          subtitle={shot.narration}
          headline={shot.headlineText || "THE MASTER ARCHITECT"}
          vintageLabel="DOCUMENTARY ARCHIVE // @BYROOK_TV"
        />
      );
  }
}

