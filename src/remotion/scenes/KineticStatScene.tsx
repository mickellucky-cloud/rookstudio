import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface KineticStatProps {
  statValue?: string;
  statPrefix?: string;
  statSuffix?: string;
  label?: string;
  contextNote?: string;
  metricComparison?: string;
}

export const KineticStatScene: React.FC<KineticStatProps> = ({
  statValue = "84.2",
  statPrefix = "",
  statSuffix = "%",
  label = "GLOBAL MARKET SHARE CONTROLLED BY LUXOTTICA",
  contextNote = "DATA AUDIT • 2000 TO 2024 CONSOLIDATION",
  metricComparison = "4.2x greater than next 15 competitors combined",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Smooth numeric counter spring
  const countProgress = spring({
    frame: frame - 10,
    fps,
    config: { damping: 20, stiffness: 80, mass: 1 },
  });

  const numericTarget = parseFloat(statValue) || 84.2;
  const currentNumeric = (numericTarget * countProgress).toFixed(1);

  // SVG Chart path reveal
  const chartProgress = interpolate(frame, [15, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Camera subtle drift
  const cameraScale = interpolate(frame, [0, 150], [1.0, 1.08]);

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "#05060a",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {/* Deep OLED background with Cyan ambient aura */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.12) 0%, rgba(5, 6, 10, 0.98) 70%)",
          zIndex: 1,
        }}
      />

      {/* Fern's signature minimalist coordinate grid */}
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
        {/* Category Pill Tag */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "rgba(6, 182, 212, 0.1)",
            border: "1px solid rgba(6, 182, 212, 0.3)",
            padding: "6px 18px",
            borderRadius: "9999px",
            color: "#06b6d4",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "2.5px",
            textTransform: "uppercase",
            marginBottom: "20px",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "#06b6d4",
              boxShadow: "0 0 10px #06b6d4",
            }}
          />
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
                color: "#06b6d4",
                marginRight: "6px",
              }}
            >
              {statPrefix}
            </span>
          )}
          <span
            style={{
              fontSize: "128px",
              fontWeight: 900,
              letterSpacing: "-4px",
              color: "#ffffff",
              textShadow: "0 10px 40px rgba(6, 182, 212, 0.25)",
            }}
          >
            {currentNumeric}
          </span>
          {statSuffix && (
            <span
              style={{
                fontSize: "76px",
                fontWeight: 800,
                color: "#06b6d4",
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
            fontWeight: 700,
            letterSpacing: "3px",
            color: "rgba(255, 255, 255, 0.85)",
            textTransform: "uppercase",
            margin: "0 0 8px 0",
            textAlign: "center",
          }}
        >
          {label}
        </h3>

        {/* Fern Sub-comparison note */}
        <p
          style={{
            fontSize: "15px",
            color: "#94a3b8",
            margin: "0 0 32px 0",
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
            height: "140px",
            position: "relative",
            backgroundColor: "rgba(12, 13, 18, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "12px",
            padding: "16px 24px",
            backdropFilter: "blur(12px)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.6)",
          }}
        >
          <svg
            viewBox="0 0 600 100"
            style={{ width: "100%", height: "100%", overflow: "visible" }}
          >
            <defs>
              <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Grid horizontal guidelines */}
            <line x1="0" y1="20" x2="600" y2="20" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
            <line x1="0" y1="50" x2="600" y2="50" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
            <line x1="0" y1="80" x2="600" y2="80" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />

            {/* Rising Area path */}
            <path
              d={`M 0 85 Q 150 78, 300 50 T 600 ${85 - 65 * chartProgress} L 600 95 L 0 95 Z`}
              fill="url(#cyanGrad)"
            />

            {/* Glowing Accent Line */}
            <path
              d={`M 0 85 Q 150 78, 300 50 T 600 ${85 - 65 * chartProgress}`}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Active Data Point */}
            <circle
              cx="600"
              cy={85 - 65 * chartProgress}
              r="6"
              fill="#ffffff"
              stroke="#06b6d4"
              strokeWidth="3"
            />
          </svg>
        </div>
      </div>

      {/* Cinematic border accents */}
      <div
        style={{
          position: "absolute",
          top: "24px",
          left: "32px",
          fontSize: "12px",
          color: "rgba(255, 255, 255, 0.4)",
          letterSpacing: "2px",
          fontWeight: 600,
          zIndex: 10,
        }}
      >
        ROOKSTUDIO // ECONOMIC TELEMETRY
      </div>
      <div
        style={{
          position: "absolute",
          top: "24px",
          right: "32px",
          fontSize: "12px",
          color: "rgba(6, 182, 212, 0.8)",
          letterSpacing: "2px",
          fontWeight: 700,
          zIndex: 10,
        }}
      >
        LIVE RENDER • 60 FPS
      </div>
    </div>
  );
};
