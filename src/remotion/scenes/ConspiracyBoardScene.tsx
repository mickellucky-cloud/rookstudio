import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { EffectPresetId, MotionStyle } from "@/types";
import { STYLE_THEMES } from "@/lib/effectsLibrary";
import { EffectLayer } from "../EffectLayer";

export interface ConspiracyBoardProps {
  centerSubject?: string;
  node1?: string;
  node2?: string;
  node3?: string;
  verdictLabel?: string;
  style?: MotionStyle;
  effectPreset?: EffectPresetId;
}

export const ConspiracyBoardScene: React.FC<ConspiracyBoardProps> = ({
  centerSubject = "HOLDING GROUP HQ",
  node1 = "ACQUIRED BRANDS",
  node2 = "RETAIL NETWORKS",
  node3 = "OFFSHORE ENTITIES",
  verdictLabel = "Behind dozens of household brand names sat the exact same boardroom.",
  style = "magnates",
  effectPreset = "red-string-pulse",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const theme = STYLE_THEMES[style] || STYLE_THEMES.magnates;

  const camX = interpolate(frame, [0, 150], [32, -32]);
  const camY = interpolate(frame, [0, 150], [16, -16]);
  const camScale = interpolate(frame, [0, 150], [1.0, 1.14]);

  const stringProgress = interpolate(frame, [14, 54], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const stampSpring = spring({
    frame: frame - 48,
    fps,
    config: { damping: 12, mass: 0.6, stiffness: 180 },
  });

  const connectorColor =
    style === "fern"
      ? "#06b6d4"
      : style === "vox"
      ? "#d4ff00"
      : "#ef4444";

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: theme.palette.canvas,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: theme.typography.headingFont,
      }}
    >
      {/* Ambient Suspense Glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, ${connectorColor}24 0%, ${theme.palette.canvas} 75%)`,
          zIndex: 1,
        }}
      />

      {/* Board Texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.65,
          zIndex: 2,
        }}
      />

      {/* Investigation Network Canvas */}
      <div
        style={{
          transform: `scale(${camScale}) translate(${camX}px, ${camY}px)`,
          position: "relative",
          width: "920px",
          height: "520px",
          zIndex: 5,
        }}
      >
        {/* SVG Connection Vectors */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 3,
            pointerEvents: "none",
          }}
        >
          <line
            x1="460"
            y1="260"
            x2={460 - (460 - 180) * stringProgress}
            y2={260 - (260 - 140) * stringProgress}
            stroke={connectorColor}
            strokeWidth="3.5"
            strokeDasharray="7 4"
          />
          <line
            x1="460"
            y1="260"
            x2={460 + (730 - 460) * stringProgress}
            y2={260 - (260 - 160) * stringProgress}
            stroke={connectorColor}
            strokeWidth="3.5"
            strokeDasharray="7 4"
          />
          <line
            x1="460"
            y1="260"
            x2={460 + (320 - 460) * stringProgress}
            y2={260 + (415 - 260) * stringProgress}
            stroke={connectorColor}
            strokeWidth="3.5"
            strokeDasharray="7 4"
          />
        </svg>

        {/* Center Target Entity Card */}
        <div
          style={{
            position: "absolute",
            left: "340px",
            top: "180px",
            width: "240px",
            backgroundColor: theme.palette.surface,
            border: `2px solid ${connectorColor}`,
            boxShadow: `0 20px 50px rgba(0, 0, 0, 0.9), 0 0 32px ${connectorColor}44`,
            padding: "18px",
            borderRadius: style === "vox" ? "4px" : "12px",
            textAlign: "center",
            zIndex: 6,
          }}
        >
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "2px",
              color: connectorColor,
              fontWeight: 800,
              textTransform: "uppercase",
              marginBottom: "6px",
              fontFamily: "monospace",
            }}
          >
            CONTROLLING ENTITY
          </div>
          <div
            style={{
              fontSize: "19px",
              fontWeight: 800,
              color: "#ffffff",
              textTransform: "uppercase",
            }}
          >
            {centerSubject}
          </div>
        </div>

        {/* Node 1: Left Card */}
        <div
          style={{
            position: "absolute",
            left: "75px",
            top: "80px",
            width: "200px",
            backgroundColor: theme.palette.surface,
            border: "1px solid rgba(255, 255, 255, 0.16)",
            padding: "14px",
            borderRadius: "8px",
            transform: "rotate(-3deg)",
            boxShadow: "0 15px 35px rgba(0,0,0,0.7)",
            zIndex: 6,
          }}
        >
          <div
            style={{
              fontSize: "10px",
              color: theme.palette.primaryAccent,
              fontWeight: 700,
              fontFamily: "monospace",
            }}
          >
            SUBSIDIARY · 01
          </div>
          <div
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "#f8fafc",
              marginTop: "4px",
            }}
          >
            {node1}
          </div>
        </div>

        {/* Node 2: Right Card */}
        <div
          style={{
            position: "absolute",
            right: "75px",
            top: "100px",
            width: "200px",
            backgroundColor: theme.palette.surface,
            border: "1px solid rgba(255, 255, 255, 0.16)",
            padding: "14px",
            borderRadius: "8px",
            transform: "rotate(2.5deg)",
            boxShadow: "0 15px 35px rgba(0,0,0,0.7)",
            zIndex: 6,
          }}
        >
          <div
            style={{
              fontSize: "10px",
              color: theme.palette.primaryAccent,
              fontWeight: 700,
              fontFamily: "monospace",
            }}
          >
            DISTRIBUTION · 02
          </div>
          <div
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "#f8fafc",
              marginTop: "4px",
            }}
          >
            {node2}
          </div>
        </div>

        {/* Node 3: Bottom Card */}
        <div
          style={{
            position: "absolute",
            left: "215px",
            bottom: "38px",
            width: "210px",
            backgroundColor: theme.palette.surface,
            border: "1px solid rgba(255, 255, 255, 0.16)",
            padding: "14px",
            borderRadius: "8px",
            transform: "rotate(-1.5deg)",
            boxShadow: "0 15px 35px rgba(0,0,0,0.7)",
            zIndex: 6,
          }}
        >
          <div
            style={{
              fontSize: "10px",
              color: theme.palette.primaryAccent,
              fontWeight: 700,
              fontFamily: "monospace",
            }}
          >
            HOLDINGS · 03
          </div>
          <div
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "#f8fafc",
              marginTop: "4px",
            }}
          >
            {node3}
          </div>
        </div>

        {/* Verdict Stamp */}
        {frame > 48 && (
          <div
            style={{
              position: "absolute",
              bottom: "42px",
              right: "85px",
              transform: `scale(${stampSpring}) rotate(-7deg)`,
              border: `3px solid ${connectorColor}`,
              padding: "8px 20px",
              color: style === "vox" ? "#09090b" : connectorColor,
              fontSize: "18px",
              fontWeight: 900,
              letterSpacing: "4px",
              textTransform: "uppercase",
              backgroundColor:
                style === "vox" ? "#d4ff00" : `${connectorColor}1a`,
              borderRadius: "4px",
            }}
          >
            VERIFIED NEXUS
          </div>
        )}
      </div>

      {/* Lower-Third Caption */}
      <div
        style={{
          position: "absolute",
          bottom: "48px",
          textAlign: "center",
          zIndex: 10,
          maxWidth: 880,
          padding: "0 24px",
        }}
      >
        <div
          style={{
            fontSize: "13px",
            letterSpacing: "3px",
            color: connectorColor,
            fontWeight: 800,
            textTransform: "uppercase",
            marginBottom: "4px",
          }}
        >
          FORENSIC NETWORK ARCHITECTURE
        </div>
        <div
          style={{
            fontSize: "21px",
            color: "#ffffff",
            fontWeight: 600,
          }}
        >
          “{verdictLabel}”
        </div>
      </div>

      {/* Procedural Theme & Shot Effect Overlay */}
      <EffectLayer
        style={style}
        effectPreset={effectPreset}
        shotTitle={centerSubject}
      />
    </div>
  );
};
