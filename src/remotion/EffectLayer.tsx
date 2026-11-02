import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EffectPresetId, MotionStyle } from "@/types";
import { STYLE_THEMES, getEffectPresetById } from "@/lib/effectsLibrary";

export interface EffectLayerProps {
  style?: MotionStyle;
  effectPreset?: EffectPresetId;
  shotTitle?: string;
}

export const EffectLayer: React.FC<EffectLayerProps> = ({
  style = "magnates",
  effectPreset = "dust-vignette",
  shotTitle = "SCENE SEQUENCE",
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const theme = STYLE_THEMES[style] || STYLE_THEMES.magnates;
  const presetMeta = getEffectPresetById(effectPreset);

  const renderPresetEffect = () => {
    switch (effectPreset) {
      case "dust-vignette": {
        return (
          <>
            {[...Array(18)].map((_, i) => {
              const pX = (i * 149) % width;
              const speed = 0.6 + (i % 5) * 0.35;
              const pY = height - ((frame * speed * 2.2 + i * 95) % height);
              const pOpacity = interpolate(
                pY,
                [0, height * 0.5, height],
                [0, 0.55, 0]
              );
              const size = 3 + (i % 4) * 2;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: pX,
                    top: pY,
                    width: size,
                    height: size,
                    borderRadius: "50%",
                    backgroundColor: theme.palette.primaryAccent,
                    filter: "blur(1px)",
                    opacity: pOpacity,
                  }}
                />
              );
            })}
            <div
              style={{
                position: "absolute",
                inset: 0,
                boxShadow: "inset 0 0 160px rgba(0, 0, 0, 0.92)",
              }}
            />
          </>
        );
      }

      case "spotlight-sweep": {
        const angle = interpolate(Math.sin(frame / 28), [-1, 1], [-18, 18]);
        const sweepX = interpolate(Math.cos(frame / 28), [-1, 1], [32, 68]);
        return (
          <div
            style={{
              position: "absolute",
              inset: -200,
              background: `conic-gradient(from ${180 + angle}deg at ${sweepX}% -5%, transparent 0deg, ${theme.palette.primaryAccent}28 18deg, transparent 36deg)`,
              mixBlendMode: "screen",
            }}
          />
        );
      }

      case "film-grain-35mm": {
        const scratchX1 = ((frame * 73) % (width - 200)) + 100;
        const scratchX2 = ((frame * 191) % (width - 300)) + 150;
        const flicker = interpolate(Math.sin(frame * 1.9), [-1, 1], [0.02, 0.08]);
        return (
          <>
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: `rgba(245, 158, 11, ${flicker})`,
                mixBlendMode: "overlay",
              }}
            />
            {frame % 4 === 0 && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: scratchX1,
                  width: 1.5,
                  backgroundColor: "rgba(255, 255, 255, 0.18)",
                }}
              />
            )}
            {frame % 7 === 0 && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: scratchX2,
                  width: 1,
                  backgroundColor: "rgba(245, 158, 11, 0.25)",
                }}
              />
            )}
          </>
        );
      }

      case "red-string-pulse": {
        const pulseScale = interpolate(
          (frame % 45) / 45,
          [0, 1],
          [0.4, 1.85]
        );
        const pulseOpacity = interpolate(
          (frame % 45) / 45,
          [0, 0.7, 1],
          [0.6, 0.25, 0]
        );
        return (
          <>
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: 480,
                height: 480,
                marginLeft: -240,
                marginTop: -240,
                borderRadius: "50%",
                border: "2px solid rgba(239, 68, 68, 0.55)",
                transform: `scale(${pulseScale})`,
                opacity: pulseOpacity,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                boxShadow: "inset 0 0 120px rgba(239, 68, 68, 0.18)",
              }}
            />
          </>
        );
      }

      case "crt-telemetry": {
        const scanY = (frame * 9) % height;
        return (
          <>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.26) 0px, rgba(0, 0, 0, 0.26) 2px, transparent 2px, transparent 5px)",
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: scanY,
                height: 80,
                background: `linear-gradient(180deg, transparent 0%, ${theme.palette.primaryAccent}1a 50%, transparent 100%)`,
              }}
            />
          </>
        );
      }

      case "radar-sweep": {
        const deg = (frame * 3.2) % 360;
        return (
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 820,
              height: 820,
              marginLeft: -410,
              marginTop: -410,
              borderRadius: "50%",
              border: `1px solid ${theme.palette.primaryAccent}33`,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 140,
                borderRadius: "50%",
                border: `1px dashed ${theme.palette.primaryAccent}28`,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: `conic-gradient(from ${deg}deg, transparent 0deg, ${theme.palette.primaryAccent}26 40deg, transparent 42deg)`,
              }}
            />
          </div>
        );
      }

      case "thermal-blueprint": {
        return (
          <>
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `linear-gradient(${theme.palette.primaryAccent}14 1px, transparent 1px), linear-gradient(90deg, ${theme.palette.primaryAccent}14 1px, transparent 1px)`,
                backgroundSize: "48px 48px",
              }}
            />
            {/* Center Crosshair */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: 0,
                bottom: 0,
                width: 1,
                backgroundColor: `${theme.palette.primaryAccent}22`,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: 0,
                right: 0,
                height: 1,
                backgroundColor: `${theme.palette.primaryAccent}22`,
              }}
            />
          </>
        );
      }

      case "microfiche-grid": {
        const barY = interpolate((frame % 90) / 90, [0, 1], [0, height]);
        return (
          <>
            <div
              style={{
                position: "absolute",
                left: 60,
                right: 60,
                top: 60,
                bottom: 60,
                border: `1px solid ${theme.palette.primaryAccent}38`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 60,
                right: 60,
                top: barY,
                height: 2,
                backgroundColor: `${theme.palette.primaryAccent}66`,
                boxShadow: `0 0 18px ${theme.palette.primaryAccent}`,
              }}
            />
          </>
        );
      }

      case "halftone-editorial": {
        return (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `radial-gradient(${theme.palette.primaryAccent}24 1.5px, transparent 1.5px)`,
              backgroundSize: "18px 18px",
              maskImage:
                "radial-gradient(circle at 50% 50%, transparent 45%, black 100%)",
              WebkitMaskImage:
                "radial-gradient(circle at 50% 50%, transparent 45%, black 100%)",
            }}
          />
        );
      }

      case "highlighter-beam": {
        const beamW = interpolate(frame, [10, 50], [0, 540], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <div
            style={{
              position: "absolute",
              bottom: 128,
              left: "50%",
              transform: "translateX(-50%) rotate(-1deg)",
              width: beamW,
              height: 10,
              backgroundColor: "#d4ff00",
              borderRadius: 999,
              boxShadow: "0 0 30px rgba(212, 255, 0, 0.55)",
              opacity: 0.85,
            }}
          />
        );
      }

      case "anamorphic-flare": {
        const flareX = interpolate(frame, [0, 90], [-400, width + 400]);
        return (
          <div
            style={{
              position: "absolute",
              top: "48%",
              left: 0,
              right: 0,
              height: 4,
              background: `linear-gradient(90deg, transparent 0%, ${theme.palette.primaryAccent}88 50%, transparent 100%)`,
              boxShadow: `0 0 35px 6px ${theme.palette.primaryAccent}55`,
              transform: `translateX(${flareX - width / 2}px)`,
            }}
          />
        );
      }

      case "chromatic-glitch": {
        const glitchOffset = frame % 18 < 2 ? 6 : 0;
        return (
          <>
            {glitchOffset > 0 && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderLeft: "6px solid rgba(244, 63, 94, 0.65)",
                  borderRight: "6px solid rgba(6, 182, 212, 0.65)",
                  transform: `translateX(${glitchOffset}px)`,
                }}
              />
            )}
          </>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 25,
        overflow: "hidden",
      }}
    >
      {/* Procedural Effect Layer */}
      {renderPresetEffect()}

      {/* Style Theme Specific Framing */}
      {style === "magnates" && (
        <>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 36,
              backgroundColor: "#000000",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 36,
              backgroundColor: "#000000",
            }}
          />
        </>
      )}

      {style === "fern" && (
        <>
          {/* Corner HUD Telemetry Brackets */}
          <div
            style={{
              position: "absolute",
              top: 26,
              left: 34,
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontFamily: "monospace",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "2px",
              color: theme.palette.primaryAccent,
            }}
          >
            <span>FERN TELEMETRY</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span style={{ color: "#d4ff00" }}>{presetMeta.name.toUpperCase()}</span>
          </div>
          <div
            style={{
              position: "absolute",
              top: 26,
              right: 34,
              fontFamily: "monospace",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "2px",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            FRM {String(frame).padStart(4, "0")} · 60FPS
          </div>
        </>
      )}

      {style === "vox" && (
        <>
          {/* Editorial Chapter Top Rule & Badge */}
          <div
            style={{
              position: "absolute",
              top: 28,
              left: 40,
              right: 40,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "2px solid rgba(212, 255, 0, 0.45)",
              paddingBottom: 10,
              fontFamily: "monospace",
            }}
          >
            <span
              style={{
                backgroundColor: "#d4ff00",
                color: "#09090b",
                padding: "3px 12px",
                fontWeight: 800,
                fontSize: 12,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
              }}
            >
              VOX EXPLAINER · {shotTitle}
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "rgba(255,255,255,0.75)",
                letterSpacing: "1.5px",
              }}
            >
              FX: {presetMeta.name.toUpperCase()}
            </span>
          </div>
        </>
      )}
    </div>
  );
};
