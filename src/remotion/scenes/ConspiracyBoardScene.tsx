import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface ConspiracyBoardProps {
  centerSubject?: string;
  node1?: string;
  node2?: string;
  node3?: string;
  verdictLabel?: string;
}

export const ConspiracyBoardScene: React.FC<ConspiracyBoardProps> = ({
  centerSubject = "SHELL HOLDING CO.",
  node1 = "OVERSEAS ACCOUNTS",
  node2 = "RETAIL CONTRACTS",
  node3 = "ACQUIRED BRANDS",
  verdictLabel = "THE HIDDEN WEB OF CONTROL",
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Smooth camera panning across the board
  const camX = interpolate(frame, [0, 150], [40, -40]);
  const camY = interpolate(frame, [0, 150], [20, -20]);
  const camScale = interpolate(frame, [0, 150], [1.0, 1.15]);

  // Red string drawing progress
  const stringProgress = interpolate(frame, [20, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const stampSpring = spring({
    frame: frame - 60,
    fps,
    config: { damping: 12, mass: 0.6, stiffness: 180 },
  });

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: "#08090d",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {/* Dark Ambient Lighting with red suspense glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.12) 0%, rgba(8, 9, 13, 0.98) 75%)",
          zIndex: 1,
        }}
      />

      {/* Board Texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.6,
          zIndex: 2,
        }}
      />

      {/* The Investigation Pinboard Canvas */}
      <div
        style={{
          transform: `scale(${camScale}) translate(${camX}px, ${camY}px)`,
          position: "relative",
          width: "900px",
          height: "520px",
          zIndex: 5,
        }}
      >
        {/* SVG Red Connection Strings */}
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
          {/* Line 1: Center to Left Node */}
          <line
            x1="450"
            y1="260"
            x2={450 - (450 - 180) * stringProgress}
            y2={260 - (260 - 140) * stringProgress}
            stroke="#ef4444"
            strokeWidth="3"
            strokeDasharray="6 3"
          />

          {/* Line 2: Center to Right Node */}
          <line
            x1="450"
            y1="260"
            x2={450 + (720 - 450) * stringProgress}
            y2={260 - (260 - 160) * stringProgress}
            stroke="#ef4444"
            strokeWidth="3"
            strokeDasharray="6 3"
          />

          {/* Line 3: Center to Bottom Node */}
          <line
            x1="450"
            y1="260"
            x2={450 + (320 - 450) * stringProgress}
            y2={260 + (410 - 260) * stringProgress}
            stroke="#ef4444"
            strokeWidth="3"
            strokeDasharray="6 3"
          />
        </svg>

        {/* Center Target Card */}
        <div
          style={{
            position: "absolute",
            left: "340px",
            top: "180px",
            width: "220px",
            backgroundColor: "#161822",
            border: "2px solid #ef4444",
            boxShadow:
              "0 20px 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(239, 68, 68, 0.3)",
            padding: "18px",
            borderRadius: "8px",
            textAlign: "center",
            zIndex: 6,
          }}
        >
          {/* Red pushpin */}
          <div
            style={{
              position: "absolute",
              top: "-10px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              backgroundColor: "#ef4444",
              border: "2px solid #ffffff",
              boxShadow: "0 4px 8px rgba(0,0,0,0.6)",
            }}
          />
          <div
            style={{
              fontSize: "11px",
              letterSpacing: "2px",
              color: "#ef4444",
              fontWeight: 700,
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            TARGET ENTITY
          </div>
          <div
            style={{
              fontSize: "18px",
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
            left: "80px",
            top: "80px",
            width: "190px",
            backgroundColor: "#0e1017",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            padding: "14px",
            borderRadius: "6px",
            transform: "rotate(-4deg)",
            boxShadow: "0 15px 35px rgba(0,0,0,0.7)",
            zIndex: 6,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-8px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              backgroundColor: "#f59e0b",
            }}
          />
          <div style={{ fontSize: "10px", color: "#94a3b8", fontWeight: 700 }}>
            EVIDENCE // 01
          </div>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#f8fafc", marginTop: "4px" }}>
            {node1}
          </div>
        </div>

        {/* Node 2: Right Card */}
        <div
          style={{
            position: "absolute",
            right: "80px",
            top: "100px",
            width: "190px",
            backgroundColor: "#0e1017",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            padding: "14px",
            borderRadius: "6px",
            transform: "rotate(3deg)",
            boxShadow: "0 15px 35px rgba(0,0,0,0.7)",
            zIndex: 6,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-8px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              backgroundColor: "#06b6d4",
            }}
          />
          <div style={{ fontSize: "10px", color: "#94a3b8", fontWeight: 700 }}>
            EVIDENCE // 02
          </div>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#f8fafc", marginTop: "4px" }}>
            {node2}
          </div>
        </div>

        {/* Node 3: Bottom Card */}
        <div
          style={{
            position: "absolute",
            left: "220px",
            bottom: "40px",
            width: "200px",
            backgroundColor: "#0e1017",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            padding: "14px",
            borderRadius: "6px",
            transform: "rotate(-2deg)",
            boxShadow: "0 15px 35px rgba(0,0,0,0.7)",
            zIndex: 6,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-8px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              backgroundColor: "#10b981",
            }}
          />
          <div style={{ fontSize: "10px", color: "#94a3b8", fontWeight: 700 }}>
            EVIDENCE // 03
          </div>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#f8fafc", marginTop: "4px" }}>
            {node3}
          </div>
        </div>

        {/* Classified Verdict Stamp */}
        {frame > 60 && (
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              right: "90px",
              transform: `scale(${stampSpring}) rotate(-8deg)`,
              border: "3px solid #ef4444",
              padding: "8px 20px",
              color: "#ef4444",
              fontSize: "18px",
              fontWeight: 900,
              letterSpacing: "4px",
              textTransform: "uppercase",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              borderRadius: "4px",
            }}
          >
            CONFIRMED NEXUS
          </div>
        )}
      </div>

      {/* Title Bar */}
      <div
        style={{
          position: "absolute",
          bottom: "36px",
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontSize: "13px",
            letterSpacing: "3px",
            color: "#ef4444",
            fontWeight: 700,
            textTransform: "uppercase",
            marginBottom: "4px",
          }}
        >
          INVESTIGATIVE FORENSICS
        </div>
        <div
          style={{
            fontSize: "20px",
            color: "#ffffff",
            fontWeight: 700,
            letterSpacing: "1px",
          }}
        >
          {verdictLabel}
        </div>
      </div>
    </div>
  );
};

