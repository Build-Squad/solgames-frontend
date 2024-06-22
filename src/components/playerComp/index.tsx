import { Box, Typography } from "@mui/material";
import React from "react";
import Player1 from "@/assets/Player1.svg";
import Image from "next/image";

type Props = {
  alignDirection: "right" | "left";
  title: string;
  rank: string;
  pieces: string[];
};

const TimerComponent = () => {
  return (
    <Box
      display="inline-block"
      sx={{
        backgroundColor: "#545454",
        padding: "4px 12px",
        borderRadius: "4px",
      }}
    >
      <Typography sx={{ color: "white", fontWeight: "bold" }}>
        04:20:00
      </Typography>
    </Box>
  );
};

export default function PlayerComp({
  alignDirection,
  title,
  rank,
  pieces,
}: Props) {
  return (
    <Box
      textAlign={alignDirection}
      sx={{
        height: "100%",
        paddingY: "30px",
      }}
    >
      <Box
        display={"flex"}
        justifyContent={alignDirection == "right" ? "flex-end" : "flex-start"}
        alignItems={"center"}
        columnGap={"20px"}
        sx={{
          minWidth: "18vw",
          paddingBottom: "8px",
          borderBottom: "1px solid white",
          paddingX: "20px",
        }}
      >
        <Box>
          <Typography sx={{ fontSize: "24px", color: "white" }}>
            {title}
          </Typography>
          <Typography
            sx={{ fontSize: "20px", color: "#757575", marginTop: "-8px" }}
          >
            {rank}
          </Typography>
        </Box>
        <Box>
          <Image
            src={Player1}
            alt="player image"
            style={{ height: "60px", width: "60px" }}
          />
        </Box>
      </Box>

      {/* Line */}

      {/* Goti */}

      {/* Timer */}
      <Box sx={{ mt: 2, paddingX: "20px" }}>
        <TimerComponent />
      </Box>
    </Box>
  );
}
