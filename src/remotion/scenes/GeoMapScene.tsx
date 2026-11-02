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

export interface GeoMapProps {
  title?: string;
  headlineText?: string;
  narration?: string;
  locationCoords?: string;
  style?: MotionStyle;
  effectPreset?: EffectPresetId;
}

export const GeoMapScene: React.FC<GeoMapProps> = ({
  title = "GLOBAL SUPPLY CORRIDOR",
  headlineText = "TRANSNATIONAL CONTROL NETWORK",
  narration = "Every major distribution hub routes back through a single European clearing center.",
  locationCoords = "MILAN · ZURICH · NEW YORK · TOKYO",
  style = "fern",
  effectPreset = "radar-sweep",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const theme = STYLE_THEMES[style] || STYLE_THEMES.fern;

  const camScale = interpolate(frame, [0, 120], [1.0, 1.14], {
    extrapolateRight: "clamp",
  });

  const arcProgress = spring({
    frame: frame - 8,
    fps,
    config: { damping: 18, stiffness: 70 },
  });

  const hubs = [
    { x: 490, y: 210, label: "MILAN HQ", primary: true },
    { x: 250, y: 240, label: "NEW YORK", primary: false },
    { x: 760, y: 255, label: "SHENZHEN", primary: false },
    { x: 460, y: 170, label: "LUXEMBOURG", primary: false },
    { x: 310, y: 360, label: "CAYMAN", primary: false },
  ];

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: theme.palette.canvas,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: theme.typography.headingFont,
      }}
    >
      {/* Ambient Radial Aura */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 45%, ${theme.palette.primaryAccent}22 0%, ${theme.palette.canvas} 72%)`,
          zIndex: 1,
        }}
      />

      {/* World Coordinate Grid Canvas */}
      <div
        style={{
          transform: `scale(${camScale})`,
          width: 1020,
          height: 540,
          backgroundColor: theme.palette.surface,
          border: `1px solid ${theme.palette.primaryAccent}44`,
          borderRadius: style === "vox" ? 4 : 18,
          position: "relative",
          zIndex: 5,
          overflow: "hidden",
          boxShadow: "0 30px 70px rgba(0,0,0,0.85)",
        }}
      >
        {/* Latitude / Longitude Grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(${theme.palette.primaryAccent}15 1px, transparent 1px), linear-gradient(90deg, ${theme.palette.primaryAccent}15 1px, transparent 1px)`,
            backgroundSize: "52px 52px",
          }}
        />

        {/* Stylized Vector Continents / Landmass Contours + Animated Supply Arcs */}
        <svg
          viewBox="0 0 1000 520"
          style={{ width: "100%", height: "100%", position: "relative", zIndex: 2 }}
        >
          {/* Abstract Continental Dot-Clusters */}
          <g fill="rgba(255,255,255,0.12)">
            {/* North America */}
            <rect x="140" y="150" width="180" height="110" rx="28" />
            {/* South America */}
            <rect x="260" y="290" width="95" height="150" rx="24" />
            {/* Europe */}
            <rect x="430" y="130" width="140" height="100" rx="22" />
            {/* Africa */}
            <rect x="450" y="250" width="130" height="165" rx="28" />
            {/* Asia */}
            <rect x="595" y="140" width="250" height="155" rx="32" />
            {/* Australia */}
            <rect x="750" y="340" width="110" height="80" rx="20" />
          </g>

          {/* Animated Supply Chain Arcs from Milan HQ (490, 210) */}
          {hubs.slice(1).map((hub, i) => {
            const curX = 490 + (hub.x - 490) * arcProgress;
            const curY = 210 + (hub.y - 210) * arcProgress;
            const ctrlY = Math.min(210, hub.y) - 70;
            return (
              <g key={i}>
                <path
                  d={`M 490 210 Q ${(490 + curX) / 2} ${ctrlY} ${curX} ${curY}`}
                  fill="none"
                  stroke={
                    i % 2 === 0
                      ? theme.palette.primaryAccent
                      : theme.palette.secondaryAccent
                  }
                  strokeWidth="3"
                  strokeDasharray="8 4"
                />
                <circle
                  cx={curX}
                  cy={curY}
                  r="6"
                  fill={theme.palette.secondaryAccent}
                />
              </g>
            );
          })}

          {/* Hub Markers & Labels */}
          {hubs.map((hub, idx) => (
            <g key={idx}>
              <circle
                cx={hub.x}
                cy={hub.y}
                r={hub.primary ? 12 : 7}
                fill={
                  hub.primary
                    ? theme.palette.primaryAccent
                    : theme.palette.textPrimary
                }
              />
              <circle
                cx={hub.x}
                cy={hub.y}
                r={hub.primary ? 24 : 15}
                fill="none"
                stroke={theme.palette.primaryAccent}
                strokeWidth="1.5"
                opacity={0.6}
              />
              <text
                x={hub.x + 14}
                y={hub.y + 4}
                fill="#ffffff"
                fontSize="12"
                fontWeight="700"
                fontFamily="monospace"
              >
                {hub.label}
              </text>
            </g>
          ))}
        </svg>

        {/* Top-Left Coordinate Readout */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 24,
            backgroundColor: "rgba(0,0,0,0.75)",
            border: `1px solid ${theme.palette.primaryAccent}55`,
            padding: "8px 16px",
            borderRadius: 8,
            fontFamily: "monospace",
            fontSize: 13,
            fontWeight: 700,
            color: theme.palette.primaryAccent,
            letterSpacing: "1.5px",
            zIndex: 6,
          }}
        >
          GEO-LOCK · {locationCoords}
        </div>
      </div>

      {/* Lower Third Headline & Voiceover Caption */}
      <div
        style={{
          position: "absolute",
          bottom: 58,
          zIndex: 10,
          textAlign: "center",
          maxWidth: 940,
          padding: "0 24px",
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: "3px",
            color: theme.palette.primaryAccent,
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          {title} · {headlineText}
        </div>
        <div
          style={{
            fontSize: 22,
            color: theme.palette.textPrimary,
            fontWeight: 500,
          }}
        >
          “{narration}”
        </div>
      </div>

      {/* Procedural Theme & Shot Effect Overlay */}
      <EffectLayer
        style={style}
        effectPreset={effectPreset}
        shotTitle={title}
      />
    </div>
  );
};
