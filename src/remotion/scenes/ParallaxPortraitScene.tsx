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

export interface ParallaxProps {
  title?: string;
  subtitle?: string;
  headline?: string;
  subjectImage?: string;
  vintageLabel?: string;
  style?: MotionStyle;
  effectPreset?: EffectPresetId;
}

export const ParallaxPortraitScene: React.FC<ParallaxProps> = ({
  title = "THE UNTOUCHABLE MONOPOLY",
  subtitle = "How 1 company silently captured 80% of the world's vision",
  headline = "LEONARDO DEL VECCHIO",
  vintageLabel = "DOCUMENTARY ARCHIVE · @BYROOK_TV",
  style = "magnates",
  effectPreset = "dust-vignette",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const theme = STYLE_THEMES[style] || STYLE_THEMES.magnates;

  // Smooth Ken Burns camera push
  const cameraScale = interpolate(frame, [0, 180], [1.0, 1.18], {
    extrapolateRight: "clamp",
  });
  const cameraY = interpolate(frame, [0, 180], [0, -22], {
    extrapolateRight: "clamp",
  });

  // Entrance spring for typography
  const textProgress = spring({
    frame: frame - 10,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  const textOpacity = interpolate(frame, [6, 24], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const spotPulse = interpolate(Math.sin(frame / 20), [-1, 1], [0.16, 0.28]);

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
      {/* Layer 0: Theme-Adaptive Atmospheric Spotlight */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 45%, ${theme.palette.primaryAccent}${Math.round(
            spotPulse * 100
          )} 0%, ${theme.palette.canvas} 68%)`,
          zIndex: 1,
        }}
      />

      {/* Layer 1: Parallax Subject Cutout */}
      <div
        style={{
          transform: `scale(${cameraScale}) translateY(${cameraY}px)`,
          position: "relative",
          zIndex: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Theme-Adaptive Top Kicker */}
        <div
          style={{
            backgroundColor:
              style === "vox"
                ? "#d4ff00"
                : `${theme.palette.primaryAccent}1f`,
            border: `1px solid ${theme.palette.primaryAccent}66`,
            padding: "5px 18px",
            borderRadius: style === "vox" ? "4px" : "9999px",
            color: style === "vox" ? "#09090b" : theme.palette.primaryAccent,
            fontSize: "13px",
            letterSpacing: "3px",
            fontWeight: 800,
            textTransform: "uppercase",
            marginBottom: "18px",
          }}
        >
          {vintageLabel}
        </div>

        {/* Cinematic Subject Frame */}
        <div
          style={{
            width: "330px",
            height: "365px",
            position: "relative",
            borderRadius: style === "vox" ? "4px" : "18px",
            overflow: "hidden",
            boxShadow: `0 25px 60px -10px rgba(0, 0, 0, 0.9), 0 0 36px ${theme.palette.primaryAccent}28`,
            border:
              style === "vox"
                ? "3px solid #d4ff00"
                : `1px solid ${theme.palette.primaryAccent}55`,
            backgroundColor: theme.palette.surface,
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background: `linear-gradient(180deg, ${theme.palette.surface} 0%, ${theme.palette.canvas} 100%)`,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            {/* Dynamic Rotating Subject Emblem */}
            <div
              style={{
                width: "148px",
                height: "148px",
                border: `2px solid ${theme.palette.primaryAccent}88`,
                transform: `rotate(${frame * 0.25}deg)`,
                borderRadius: style === "fern" ? "16px" : "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "104px",
                  height: "104px",
                  border: `1.5px dashed ${theme.palette.secondaryAccent}99`,
                  transform: `rotate(-${frame * 0.4}deg)`,
                  borderRadius: "50%",
                }}
              />
            </div>

            <div
              style={{
                position: "absolute",
                bottom: "20px",
                fontSize: "12px",
                letterSpacing: "3.5px",
                color: theme.palette.textMuted,
                fontWeight: 700,
                fontFamily: "monospace",
              }}
            >
              {style === "fern"
                ? "ENTITY ID · VERIFIED"
                : style === "vox"
                ? "PRIMARY SUBJECT"
                : "DOSSIER · CLASSIFIED"}
            </div>
          </div>
        </div>

        {/* Subject Name Headline */}
        <h2
          style={{
            fontSize: "44px",
            fontWeight: 800,
            letterSpacing: theme.typography.letterSpacing,
            color: theme.palette.textPrimary,
            margin: "22px 0 6px 0",
            textTransform: "uppercase",
            textShadow: "0 10px 30px rgba(0, 0, 0, 0.85)",
          }}
        >
          {headline}
        </h2>
      </div>

      {/* Layer 2: Dramatic Lower-Third Typography */}
      <div
        style={{
          position: "absolute",
          bottom: "56px",
          zIndex: 15,
          textAlign: "center",
          opacity: textOpacity,
          transform: `translateY(${(1 - textProgress) * 20}px)`,
          maxWidth: "880px",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            fontSize: "15px",
            color: theme.palette.primaryAccent,
            letterSpacing: "3.5px",
            fontWeight: 800,
            marginBottom: "8px",
            textTransform: "uppercase",
          }}
        >
          {title}
        </div>
        <p
          style={{
            fontSize: "24px",
            color: theme.palette.textPrimary,
            fontWeight: 500,
            lineHeight: 1.38,
            margin: 0,
          }}
        >
          “{subtitle}”
        </p>
      </div>

      {/* Layer 3: Procedural Theme & Shot Effect Overlay */}
      <EffectLayer
        style={style}
        effectPreset={effectPreset}
        shotTitle={title}
      />
    </div>
  );
};
