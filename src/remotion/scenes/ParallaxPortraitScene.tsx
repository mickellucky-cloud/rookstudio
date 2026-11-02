import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface ParallaxProps {
  title?: string;
  subtitle?: string;
  headline?: string;
  subjectImage?: string;
  vintageLabel?: string;
}

export const ParallaxPortraitScene: React.FC<ParallaxProps> = ({
  title = "THE UNTOUCHABLE MONOPOLY",
  subtitle = "How 1 company silently captured 80% of the world's vision",
  headline = "LEONARDO DEL VECCHIO",
  vintageLabel = "MILAN, ITALY • 1988",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Smooth Ken Burns camera push
  const cameraScale = interpolate(frame, [0, 180], [1.0, 1.18], {
    extrapolateRight: "clamp",
  });
  const cameraY = interpolate(frame, [0, 180], [0, -25], {
    extrapolateRight: "clamp",
  });

  // Entrance spring for typography
  const textProgress = spring({
    frame: frame - 15,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  const textOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Ambient spotlight pulse
  const spotPulse = interpolate(Math.sin(frame / 20), [-1, 1], [0.18, 0.28]);

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "#050608",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {/* Layer 0: Atmospheric Noir Spotlight & Grain */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 45%, rgba(245, 158, 11, ${spotPulse}) 0%, rgba(5, 6, 8, 0.95) 60%, #030406 100%)`,
          zIndex: 1,
        }}
      />

      {/* Grid texture for documentary precision */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0.7,
          zIndex: 2,
        }}
      />

      {/* Floating particles */}
      {[...Array(12)].map((_, i) => {
        const pX = ((i * 137) % width);
        const pSpeed = 0.5 + (i % 4) * 0.4;
        const pY = height - ((frame * pSpeed * 2 + i * 80) % height);
        const pOpacity = interpolate(pY, [0, height * 0.8, height], [0, 0.4, 0]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: pX,
              top: pY,
              width: 3 + (i % 3) * 2,
              height: 3 + (i % 3) * 2,
              borderRadius: "50%",
              backgroundColor: "rgba(245, 158, 11, 0.6)",
              filter: "blur(1px)",
              opacity: pOpacity,
              zIndex: 3,
            }}
          />
        );
      })}

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
        {/* Archival Badge */}
        <div
          style={{
            backgroundColor: "rgba(245, 158, 11, 0.12)",
            border: "1px solid rgba(245, 158, 11, 0.35)",
            padding: "4px 16px",
            borderRadius: "9999px",
            color: "#f59e0b",
            fontSize: "13px",
            letterSpacing: "3px",
            fontWeight: 700,
            textTransform: "uppercase",
            marginBottom: "16px",
            boxShadow: "0 0 15px rgba(245, 158, 11, 0.2)",
          }}
        >
          {vintageLabel}
        </div>

        {/* Cinematic Subject Avatar / Silhouette Frame */}
        <div
          style={{
            width: "320px",
            height: "380px",
            position: "relative",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 25px 60px -10px rgba(0, 0, 0, 0.9), 0 0 30px rgba(245, 158, 11, 0.15)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            backgroundColor: "#0d0f15",
          }}
        >
          {/* Inner Monochromatic Image / Graphic */}
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "linear-gradient(180deg, #181b24 0%, #0b0c10 100%)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            {/* Geometric luxury insignia */}
            <div
              style={{
                width: "140px",
                height: "140px",
                border: "2px solid rgba(245, 158, 11, 0.4)",
                transform: `rotate(${frame * 0.1}deg)`,
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  border: "1px dashed rgba(255, 255, 255, 0.3)",
                  transform: `rotate(-${frame * 0.15}deg)`,
                  borderRadius: "50%",
                }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                fontSize: "12px",
                letterSpacing: "4px",
                color: "rgba(255, 255, 255, 0.5)",
                fontWeight: 600,
              }}
            >
              ARCHIVE // CLASSIFIED
            </div>
          </div>

          {/* Vignette Shadow Overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              boxShadow: "inset 0 0 60px rgba(0, 0, 0, 0.9)",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Subject Name Headline */}
        <h2
          style={{
            fontSize: "42px",
            fontWeight: 800,
            letterSpacing: "4px",
            color: "#ffffff",
            margin: "24px 0 6px 0",
            textTransform: "uppercase",
            textShadow: "0 10px 30px rgba(0, 0, 0, 0.8)",
          }}
        >
          {headline}
        </h2>
      </div>

      {/* Layer 2: Dramatic Lower-Third Typography */}
      <div
        style={{
          position: "absolute",
          bottom: "60px",
          zIndex: 5,
          textAlign: "center",
          opacity: textOpacity,
          transform: `translateY(${(1 - textProgress) * 20}px)`,
          maxWidth: "850px",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            fontSize: "15px",
            color: "#f59e0b",
            letterSpacing: "4px",
            fontWeight: 700,
            marginBottom: "8px",
            textTransform: "uppercase",
          }}
        >
          {title}
        </div>
        <p
          style={{
            fontSize: "24px",
            color: "rgba(255, 255, 255, 0.9)",
            fontWeight: 400,
            lineHeight: 1.4,
            margin: 0,
            letterSpacing: "-0.5px",
          }}
        >
          "{subtitle}"
        </p>
      </div>

      {/* Layer 3: Film grain & Cinematic Letterbox Bars */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "36px",
          backgroundColor: "#000000",
          zIndex: 10,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "36px",
          backgroundColor: "#000000",
          zIndex: 10,
        }}
      />
    </div>
  );
};
