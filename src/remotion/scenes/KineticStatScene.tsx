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

export interface KineticStatProps {
  statValue?: string;
  statPrefix?: string;
  statSuffix?: string;
  label?: string;
  contextNote?: string;
  metricComparison?: string;
  style?: MotionStyle;
  effectPreset?: EffectPresetId;
}

export const KineticStatScene: React.FC<KineticStatProps> = ({
  statValue = "84.2",
  statPrefix = "",
  statSuffix = "%",
  label = "GLOBAL MARKET SHARE CONSOLIDATION",
  contextNote = "QUANTITATIVE AUDIT · @BYROOK_TV",
  metricComparison = "4.2x greater than next 15 competitors combined",
  style = "fern",
  effectPreset = "crt-telemetry",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const theme = STYLE_THEMES[style] || STYLE_THEMES.fern;

  const countProgress = spring({
    frame: frame - 8,
    fps,
    config: { damping: 20, stiffness: 80, mass: 1 },
  });

  const numericTarget = parseFloat(statValue) || 84.2;
  const currentNumeric = (numericTarget * countProgress).toFixed(1);

  const chartProgress = interpolate(frame, [10, 68], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cameraScale = interpolate(frame, [0, 150], [1.0, 1.08]);

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
          background: `radial-gradient(circle at 50% 50%, ${theme.palette.primaryAccent}22 0%, ${theme.palette.canvas} 72%)`,
          zIndex: 1,
        }}
      />

      {/* Coordinate Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          zIndex: 2,
        }}
      />

      {/* Main Stat & Chart Container */}
      <div
        style={{
          transform: `scale(${cameraScale})`,
          position: "relative",
          zIndex: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          maxWidth: "960px",
          width: "100%",
          padding: "0 40px",
        }}
      >
        {/* Top Context Kicker */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor:
              style === "vox" ? "#d4ff00" : `${theme.palette.primaryAccent}1a`,
            border: `1px solid ${theme.palette.primaryAccent}55`,
            padding: "6px 18px",
            borderRadius: style === "vox" ? "4px" : "9999px",
            color: style === "vox" ? "#09090b" : theme.palette.primaryAccent,
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "2.5px",
            textTransform: "uppercase",
            marginBottom: "18px",
          }}
        >
          {contextNote}
        </div>

        {/* Huge Kinetic Number */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            lineHeight: 1,
            marginBottom: "12px",
          }}
        >
          {statPrefix && (
            <span
              style={{
                fontSize: "72px",
                fontWeight: 800,
                color: theme.palette.primaryAccent,
                marginRight: "6px",
              }}
            >
              {statPrefix}
            </span>
          )}
          <span
            style={{
              fontSize: "126px",
              fontWeight: 900,
              letterSpacing: "-4px",
              color: theme.palette.textPrimary,
              textShadow: `0 10px 40px ${theme.palette.primaryAccent}44`,
            }}
          >
            {currentNumeric}
          </span>
          {statSuffix && (
            <span
              style={{
                fontSize: "74px",
                fontWeight: 800,
                color: theme.palette.primaryAccent,
                marginLeft: "6px",
              }}
            >
              {statSuffix}
            </span>
          )}
        </div>

        {/* Metric Label */}
        <h3
          style={{
            fontSize: "20px",
            fontWeight: 800,
            letterSpacing: "2.5px",
            color: theme.palette.textPrimary,
            textTransform: "uppercase",
            margin: "0 0 8px 0",
            textAlign: "center",
          }}
        >
          {label}
        </h3>

        <p
          style={{
            fontSize: "16px",
            color: theme.palette.textMuted,
            margin: "0 0 28px 0",
            textAlign: "center",
            fontWeight: 500,
          }}
        >
          {metricComparison}
        </p>

        {/* Animated Vector Area Chart */}
        <div
          style={{
            width: "720px",
            height: "145px",
            position: "relative",
            backgroundColor: theme.palette.surface,
            border: `1px solid ${theme.palette.primaryAccent}38`,
            borderRadius: style === "vox" ? "4px" : "14px",
            padding: "16px 24px",
            boxShadow: "0 20px 45px rgba(0, 0, 0, 0.65)",
          }}
        >
          <svg
            viewBox="0 0 600 100"
            style={{ width: "100%", height: "100%", overflow: "visible" }}
          >
            <defs>
              <linearGradient id="statAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={theme.palette.primaryAccent}
                  stopOpacity="0.42"
                />
                <stop
                  offset="100%"
                  stopColor={theme.palette.primaryAccent}
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>

            <line
              x1="0"
              y1="20"
              x2="600"
              y2="20"
              stroke="rgba(255,255,255,0.07)"
              strokeDasharray="4 4"
            />
            <line
              x1="0"
              y1="50"
              x2="600"
              y2="50"
              stroke="rgba(255,255,255,0.07)"
              strokeDasharray="4 4"
            />
            <line
              x1="0"
              y1="80"
              x2="600"
              y2="80"
              stroke="rgba(255,255,255,0.07)"
              strokeDasharray="4 4"
            />

            <path
              d={`M 0 85 Q 150 78, 300 50 T 600 ${85 - 65 * chartProgress} L 600 95 L 0 95 Z`}
              fill="url(#statAreaGrad)"
            />

            <path
              d={`M 0 85 Q 150 78, 300 50 T 600 ${85 - 65 * chartProgress}`}
              fill="none"
              stroke={theme.palette.primaryAccent}
              strokeWidth="4"
              strokeLinecap="round"
            />

            <circle
              cx="600"
              cy={85 - 65 * chartProgress}
              r="7"
              fill="#ffffff"
              stroke={theme.palette.primaryAccent}
              strokeWidth="3.5"
            />
          </svg>
        </div>
      </div>

      {/* Procedural Theme & Shot Effect Overlay */}
      <EffectLayer
        style={style}
        effectPreset={effectPreset}
        shotTitle={label}
      />
    </div>
  );
};
