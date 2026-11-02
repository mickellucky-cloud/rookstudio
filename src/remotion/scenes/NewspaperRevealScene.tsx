import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface NewspaperProps {
  publication?: string;
  date?: string;
  mainHeadline?: string;
  highlightedText?: string;
  subSnippet?: string;
  stampText?: string;
}

export const NewspaperRevealScene: React.FC<NewspaperProps> = ({
  publication = "THE FINANCIAL TIMES",
  date = "THURSDAY, OCTOBER 14, 1999",
  mainHeadline = "SECRET AGREEMENT EXPOSES 80% EYEWEAR MONOPOLY",
  highlightedText = "controls retail pricing across all major department chains worldwide",
  subSnippet = "Internal memos confirm rival manufacturers were forced into exclusivity contracts or faced complete retail blackouts.",
  stampText = "CONFIDENTIAL",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Dynamic Camera tilt and push-in
  const cameraScale = interpolate(frame, [0, 150], [1.0, 1.25], {
    extrapolateRight: "clamp",
  });
  const cameraRotate = interpolate(frame, [0, 150], [-2.5, 1.2], {
    extrapolateRight: "clamp",
  });
  const cameraY = interpolate(frame, [0, 150], [0, -30], {
    extrapolateRight: "clamp",
  });

  // Highlighter sweep starting at frame 35
  const highlightWidth = interpolate(frame, [35, 75], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Red stamp slam down at frame 50
  const stampSpring = spring({
    frame: frame - 50,
    fps,
    config: { damping: 10, mass: 0.5, stiffness: 220 },
  });

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "#07080b",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Playfair Display', Georgia, serif",
      }}
    >
      {/* Dark Studio Background with warm amber spotlight */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 50%, rgba(217, 119, 6, 0.22) 0%, rgba(7, 8, 11, 0.98) 75%)",
          zIndex: 1,
        }}
      />

      {/* Floating Newspaper Canvas with 3D Parallax */}
      <div
        style={{
          transform: `scale(${cameraScale}) rotate(${cameraRotate}deg) translateY(${cameraY}px)`,
          width: "920px",
          backgroundColor: "#ebe4d5",
          color: "#18181b",
          boxShadow:
            "0 30px 80px -15px rgba(0, 0, 0, 0.95), 0 0 40px rgba(245, 158, 11, 0.15)",
          padding: "36px 48px",
          position: "relative",
          zIndex: 4,
          borderRadius: "2px",
          border: "1px solid rgba(0,0,0,0.25)",
        }}
      >
        {/* Paper aging texture lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.015) 3px, rgba(0,0,0,0.015) 6px)",
            pointerEvents: "none",
          }}
        />

        {/* Vintage Tape at top left */}
        <div
          style={{
            position: "absolute",
            top: "-15px",
            left: "40px",
            width: "110px",
            height: "32px",
            backgroundColor: "rgba(255, 255, 230, 0.65)",
            backdropFilter: "blur(2px)",
            transform: "rotate(-6deg)",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            border: "1px dashed rgba(0,0,0,0.1)",
          }}
        />

        {/* Masthead Header */}
        <div
          style={{
            borderBottom: "3px double #18181b",
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
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: "1px",
              fontWeight: 700,
              textTransform: "uppercase",
              color: "#52525b",
              marginBottom: "8px",
            }}
          >
            <span>VOL. CXXIV NO. 42</span>
            <span>{date}</span>
            <span>PRICE: $1.25</span>
          </div>

          <h1
            style={{
              fontSize: "52px",
              fontWeight: 900,
              letterSpacing: "3px",
              textTransform: "uppercase",
              margin: 0,
              lineHeight: 1.05,
              color: "#0a0a0c",
            }}
          >
            {publication}
          </h1>
        </div>

        {/* Headline */}
        <h2
          style={{
            fontSize: "30px",
            fontWeight: 800,
            lineHeight: 1.18,
            margin: "0 0 18px 0",
            textTransform: "uppercase",
            letterSpacing: "-0.5px",
            color: "#0f172a",
          }}
        >
          {mainHeadline}
        </h2>

        {/* Article Body with Animated Highlighter */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.6fr 1fr",
            gap: "24px",
            fontSize: "16px",
            lineHeight: 1.5,
            color: "#27272a",
          }}
        >
          <div>
            <p style={{ margin: "0 0 12px 0", textAlign: "justify" }}>
              <span
                style={{
                  fontSize: "34px",
                  float: "left",
                  lineHeight: "28px",
                  paddingRight: "8px",
                  paddingTop: "4px",
                  fontWeight: 900,
                }}
              >
                T
              </span>
              he unsealed European antitrust documents reveal that the pricing
              cartel{" "}
              <span
                style={{
                  position: "relative",
                  display: "inline-block",
                  fontWeight: 700,
                  color: "#000000",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    bottom: "2px",
                    left: 0,
                    width: `${highlightWidth}%`,
                    backgroundColor: "rgba(250, 204, 21, 0.75)",
                    zIndex: -1,
                    borderRadius: "2px",
                    boxShadow: "0 0 12px rgba(250, 204, 21, 0.4)",
                  }}
                />
                {highlightedText}
              </span>
              , leaving consumers with no competitive pricing alternative.
            </p>
            <p style={{ margin: 0, fontSize: "14px", color: "#52525b" }}>
              {subSnippet}
            </p>
          </div>

          {/* Archival Graphic Box */}
          <div
            style={{
              border: "1px solid #71717a",
              padding: "12px",
              backgroundColor: "#ded6c3",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "10px",
                letterSpacing: "2px",
                fontWeight: 700,
                color: "#71717a",
                marginBottom: "6px",
              }}
            >
              FIG 1.1 • MARKET POWER RATIO
            </div>
            <div
              style={{
                fontSize: "38px",
                fontWeight: 900,
                color: "#991b1b",
                lineHeight: 1,
              }}
            >
              82.4%
            </div>
            <div style={{ fontSize: "12px", color: "#475569", marginTop: "4px" }}>
              Single Entity Supply
            </div>
          </div>
        </div>

        {/* Slammed Red Stamp */}
        {frame > 50 && (
          <div
            style={{
              position: "absolute",
              top: "35%",
              right: "60px",
              transform: `scale(${stampSpring}) rotate(-14deg)`,
              border: "4px solid #b91c1c",
              padding: "8px 24px",
              color: "#b91c1c",
              fontSize: "32px",
              fontWeight: 900,
              letterSpacing: "6px",
              textTransform: "uppercase",
              borderRadius: "6px",
              backgroundColor: "rgba(254, 242, 242, 0.5)",
              boxShadow: "0 0 25px rgba(185, 28, 28, 0.3)",
            }}
          >
            {stampText}
          </div>
        )}
      </div>

      {/* Cinematic Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: "inset 0 0 100px rgba(0, 0, 0, 0.9)",
          pointerEvents: "none",
          zIndex: 8,
        }}
      />
    </div>
  );
};
