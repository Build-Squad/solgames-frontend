import React from "react";
import Backdrop from "@mui/material/Backdrop";
import { Box, Typography } from "@mui/material";

const VaultLoader = ({ open }) => {
  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: "1301",
        backdropFilter: "blur(10px)", // Blurred background
        backgroundColor: "rgba(0, 0, 0, 0.7)", // Dark overlay
      }}
      open={open}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          textAlign: "center",
        }}
      >
        {/* Blockchain-themed SVG Loader */}
        <svg
          width="300"
          height="300"
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Chain links representing blockchain */}
          <rect
            x="45"
            y="50"
            width="30"
            height="30"
            rx="6"
            ry="6"
            fill="url(#block1Gradient)"
            className="block-1"
          />
          <line
            x1="75"
            y1="65"
            x2="125"
            y2="65"
            stroke="#00c9ff"
            strokeWidth="4"
            strokeLinecap="round"
            className="link"
          />
          <rect
            x="125"
            y="50"
            width="30"
            height="30"
            rx="6"
            ry="6"
            fill="url(#block2Gradient)"
            className="block-2"
          />
          <line
            x1="155"
            y1="65"
            x2="75"
            y2="125"
            stroke="#00c9ff"
            strokeWidth="4"
            strokeLinecap="round"
            className="link"
          />
          <rect
            x="45"
            y="110"
            width="30"
            height="30"
            rx="6"
            ry="6"
            fill="url(#block3Gradient)"
            className="block-3"
          />
          <line
            x1="75"
            y1="125"
            x2="125"
            y2="125"
            stroke="#00c9ff"
            strokeWidth="4"
            strokeLinecap="round"
            className="link"
          />
          <rect
            x="125"
            y="110"
            width="30"
            height="30"
            rx="6"
            ry="6"
            fill="url(#block4Gradient)"
            className="block-4"
          />

          {/* Block completion glow */}
          <circle
            cx="100"
            cy="65"
            r="8"
            fill="none"
            stroke="url(#completionGradient)"
            strokeWidth="2"
            className="pulse"
          />
          <circle
            cx="100"
            cy="125"
            r="8"
            fill="none"
            stroke="url(#completionGradient)"
            strokeWidth="2"
            className="pulse"
          />

          {/* Gradient Definitions */}
          <defs>
            <linearGradient
              id="block1Gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "#6a11cb", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#2575fc", stopOpacity: 1 }}
              />
            </linearGradient>
            <linearGradient
              id="block2Gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "#F7971E", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#FFD200", stopOpacity: 1 }}
              />
            </linearGradient>
            <linearGradient
              id="block3Gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "#00c9ff", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#92FE9D", stopOpacity: 1 }}
              />
            </linearGradient>
            <linearGradient
              id="block4Gradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "#ff416c", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#ff4b2b", stopOpacity: 1 }}
              />
            </linearGradient>
            <linearGradient
              id="completionGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: "#34e89e", stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: "#0f3443", stopOpacity: 1 }}
              />
            </linearGradient>
          </defs>

          {/* CSS Animations */}
          <style>
            {`
              .block-1, .block-2, .block-3, .block-4 {
                animation: fadeIn 2s infinite alternate;
              }

              .link {
                stroke-dasharray: 100;
                stroke-dashoffset: 100;
                animation: drawLink 2s forwards infinite alternate;
              }

              .pulse {
                animation: pulse 2s infinite;
              }

              @keyframes fadeIn {
                0% { opacity: 0.4; }
                100% { opacity: 1; }
              }

              @keyframes drawLink {
                0% { stroke-dashoffset: 100; }
                100% { stroke-dashoffset: 0; }
              }

              @keyframes pulse {
                0% { r: 8px; opacity: 1; }
                50% { r: 12px; opacity: 0.7; }
                100% { r: 8px; opacity: 1; }
              }
            `}
          </style>
        </svg>

        {/* Game-related text content */}
        <Typography
          variant="h5"
          sx={{ mt: 4, fontWeight: "bold", color: "#fff" }}
        >
          Getting Your Chess Game Ready...
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, color: "#d1d1d1" }}>
          Sit back and relax while we set up a secure game for you.
        </Typography>
        <Typography
          variant="body2"
          sx={{ mt: 1, fontStyle: "italic", color: "#a0a0a0" }}
        >
          Your chess game is being locked in with style!
        </Typography>
      </Box>
    </Backdrop>
  );
};

export default VaultLoader;
