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

export interface NewspaperProps {
  publication?: string;
  date?: string;
  mainHeadline?: string;
  highlightedText?: string;
  subSnippet?: string;
  stampText?: string;
  style?: MotionStyle;
  effectPreset?: EffectPresetId;
}

export const NewspaperRevealScene: React.FC<NewspaperProps> = ({
  publication,
  date = "INVESTIGATIVE DISPATCH · ARCHIVE",
  mainHeadline = "SECRET AGREEMENT EXPOSES 80% EYEWEAR MONOPOLY",
  highlightedText = "controls retail pricing across all major department chains worldwide",
  subSnippet = "Internal memos confirm rival manufacturers were forced into exclusivity contracts or faced complete retail blackouts.",
  stampText,
  style = "magnates",
  effectPreset = "spotlight-sweep",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const theme = STYLE_THEMES[style] || STYLE_THEMES.magnates;

  const resolvedPublication =
    publication ||
    (style === "fern"
      ? "GLOBAL TELEMETRY AUDIT"
      : style === "vox"
      ? "THE EXPLAINER REVIEW"
      : "THE FINANCIAL CHRONICLE");

  const resolvedStamp =
    stampText ||
    (style === "fern"
      ? "VERIFIED DATA"
      : style === "vox"
      ? "KEY EVIDENCE"
      : "CONFIDENTIAL");

  const cameraScale = interpolate(frame, [0, 150], [1.0, 1.22], {
    extrapolateRight: "clamp",
  });
  const cameraRotate = interpolate(frame, [0, 150], [-2.2, 1.0], {
    extrapolateRight: "clamp",
  });
  const cameraY = interpolate(frame, [0, 150], [0, -24], {
    extrapolateRight: "clamp",
  });

  const highlightWidth = interpolate(frame, [20, 62], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const stampSpring = spring({
    frame: frame - 42,
    fps,
    config: { damping: 10, mass: 0.5, stiffness: 220 },
  });

  const isDarkSheet = style === "fern";
  const sheetBg = isDarkSheet ? "#091526" : theme.palette.paperBg;
  const sheetText = isDarkSheet ? "#f1f5f9" : "#18181b";
  const sheetMuted = isDarkSheet ? "#94a3b8" : "#52525b";
  const highlightColor =
    style === "fern"
      ? "rgba(6, 182, 212, 0.38)"
      : style === "vox"
      ? "rgba(212, 255, 0, 0.88)"
      : "rgba(250, 204, 21, 0.78)";

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
        fontFamily:
          style === "fern"
            ? theme.typography.headingFont
            : "'Georgia', serif",
      }}
    >
      {/* Studio Backdrop */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, ${theme.palette.primaryAccent}28 0%, ${theme.palette.canvas} 75%)`,
          zIndex: 1,
        }}
      />

      {/* Document / Broadsheet Canvas */}
      <div
        style={{
          transform: `scale(${cameraScale}) rotate(${cameraRotate}deg) translateY(${cameraY}px)`,
          width: "920px",
          backgroundColor: sheetBg,
          color: sheetText,
          boxShadow: "0 30px 80px -15px rgba(0, 0, 0, 0.95)",
          padding: "36px 48px",
          position: "relative",
          zIndex: 5,
          borderRadius: isDarkSheet ? "14px" : "4px",
          border: isDarkSheet
            ? `1px solid ${theme.palette.primaryAccent}55`
            : "1px solid rgba(0,0,0,0.25)",
        }}
      >
        {/* Masthead Header */}
        <div
          style={{
            borderBottom: `3px double ${
              isDarkSheet ? theme.palette.primaryAccent : "#18181b"
            }`,
            paddingBottom: "12px",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "11px",
              fontFamily: "monospace",
              letterSpacing: "1.5px",
              fontWeight: 700,
              textTransform: "uppercase",
              color: sheetMuted,
              marginBottom: "8px",
            }}
          >
            <span>DOSSIER NO. 402</span>
            <span>{date}</span>
            <span>@BYROOK_TV</span>
          </div>

          <h1
            style={{
              fontSize: "48px",
              fontWeight: 900,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              margin: 0,
              lineHeight: 1.05,
              color: sheetText,
            }}
          >
            {resolvedPublication}
          </h1>
        </div>

        {/* Main Headline */}
        <h2
          style={{
            fontSize: "30px",
            fontWeight: 800,
            lineHeight: 1.18,
            margin: "0 0 18px 0",
            textTransform: "uppercase",
            color: sheetText,
          }}
        >
          {mainHeadline}
        </h2>

        {/* Body & Animated Highlighter */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 1fr",
            gap: "24px",
            fontSize: "16px",
            lineHeight: 1.5,
            color: sheetText,
          }}
        >
          <div>
            <p style={{ margin: "0 0 12px 0" }}>
              Unsealed regulatory disclosures confirm that the dominant network{" "}
              <span
                style={{
                  position: "relative",
                  display: "inline-block",
                  fontWeight: 800,
                  color: isDarkSheet ? "#ffffff" : "#000000",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    bottom: "2px",
                    left: 0,
                    width: `${highlightWidth}%`,
                    backgroundColor: highlightColor,
                    zIndex: -1,
                    borderRadius: "3px",
                  }}
                />
                {highlightedText}
              </span>
              , leaving independent challengers locked out of primary channels.
            </p>
            <p style={{ margin: 0, fontSize: "14px", color: sheetMuted }}>
              {subSnippet}
            </p>
          </div>

          {/* Evidence Exhibit Box */}
          <div
            style={{
              border: `1px solid ${
                isDarkSheet ? theme.palette.primaryAccent : "#71717a"
              }`,
              padding: "14px",
              backgroundColor: isDarkSheet
                ? "rgba(6, 182, 212, 0.08)"
                : "rgba(0,0,0,0.05)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              borderRadius: "6px",
            }}
          >
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "10px",
                letterSpacing: "2px",
                fontWeight: 700,
                color: sheetMuted,
                marginBottom: "6px",
              }}
            >
              EXHIBIT A · CONCENTRATION
            </div>
            <div
              style={{
                fontSize: "38px",
                fontWeight: 900,
                color:
                  style === "fern"
                    ? "#d4ff00"
                    : style === "vox"
                    ? "#2563eb"
                    : "#991b1b",
                lineHeight: 1,
              }}
            >
              84.2%
            </div>
            <div style={{ fontSize: "12px", color: sheetMuted, marginTop: "6px" }}>
              Consolidated Control
            </div>
          </div>
        </div>

        {/* Slammed Stamp */}
        {frame > 42 && (
          <div
            style={{
              position: "absolute",
              top: "36%",
              right: "56px",
              transform: `scale(${stampSpring}) rotate(-12deg)`,
              border: `4px solid ${
                style === "fern"
                  ? "#06b6d4"
                  : style === "vox"
                  ? "#18181b"
                  : "#b91c1c"
              }`,
              padding: "8px 22px",
              color:
                style === "fern"
                  ? "#06b6d4"
                  : style === "vox"
                  ? "#09090b"
                  : "#b91c1c",
              fontSize: "28px",
              fontWeight: 900,
              letterSpacing: "5px",
              textTransform: "uppercase",
              borderRadius: "6px",
              backgroundColor:
                style === "vox"
                  ? "#d4ff00"
                  : isDarkSheet
                  ? "rgba(9, 21, 38, 0.9)"
                  : "rgba(254, 242, 242, 0.7)",
            }}
          >
            {resolvedStamp}
          </div>
        )}
      </div>

      {/* Procedural Theme & Shot Effect Overlay */}
      <EffectLayer
        style={style}
        effectPreset={effectPreset}
        shotTitle={mainHeadline}
      />
    </div>
  );
};
