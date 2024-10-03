import { Box, Chip, Typography } from "@mui/material";
import React from "react";
import Player1 from "@/assets/Player1.svg";
import Image from "next/image";

type Props = {
  isActive: boolean;
  alignDirection: "right" | "left";
  title: string;
  rank?: string;
  pieces: string[];
  timer: string | null;
};

const PlayerComp = ({
  isActive,
  alignDirection,
  title,
  rank,
  pieces,
  timer,
}: Props) => {
  const chipStyle =
    alignDirection === "right"
      ? { transform: "translate(-100%, -100%)" }
      : { transform: "translateY(-100%)" };

  return (
    <Box
      textAlign={alignDirection}
      sx={{
        height: "100%",
        paddingY: "30px",
      }}
    >
      {/* Player Details */}
      <Box
        display="flex"
        justifyContent={alignDirection === "right" ? "flex-end" : "flex-start"}
        alignItems="center"
        columnGap="20px"
        sx={{
          minWidth: "18vw",
          paddingBottom: "8px",
          borderBottom: "1px solid white",
          paddingX: "20px",
        }}
      >
        {alignDirection === "right" ? (
          <>
            <Box sx={{ position: "relative" }}>
              {isActive && (
                <Chip
                  size="small"
                  sx={{
                    color: "white",
                    padding: "0px 16px",
                    position: "absolute",
                    backgroundColor: "#FF5C00",
                    ...chipStyle,
                    borderRadius: "4px",
                  }}
                  label="Active"
                />
              )}
              <Typography sx={{ fontSize: "24px", color: "white" }}>
                {title}
              </Typography>
              {!!rank && (
                <Typography
                  sx={{ fontSize: "20px", color: "#757575", marginTop: "-8px" }}
                >
                  {rank}
                </Typography>
              )}
            </Box>
            <Box>
              <Image
                src={Player1}
                alt="player image"
                style={{
                  height: "60px",
                  width: "60px",
                  border: isActive ? "2px solid #FF5C00" : "none",
                  borderRadius: isActive ? "100%" : "none",
                }}
              />
            </Box>
          </>
        ) : (
          <>
            <Box>
              <Image
                src={Player1}
                alt="player image"
                style={{
                  height: "60px",
                  width: "60px",
                  border: isActive ? "2px solid #FF5C00" : "none",
                  borderRadius: isActive ? "100%" : "none",
                }}
              />
            </Box>
            <Box sx={{ position: "relative" }}>
              {isActive && (
                <Chip
                  size="small"
                  sx={{
                    color: "white",
                    padding: "0px 16px",
                    position: "absolute",
                    backgroundColor: "#FF5C00",
                    ...chipStyle,
                    borderRadius: "4px",
                  }}
                  label="Active"
                />
              )}
              <Typography sx={{ fontSize: "24px", color: "white" }}>
                {title}
              </Typography>
              {!!rank && (
                <Typography
                  sx={{ fontSize: "20px", color: "#757575", marginTop: "-8px" }}
                >
                  {rank}
                </Typography>
              )}
            </Box>
          </>
        )}
      </Box>

      {/* Pieces */}
      <Box sx={{ px: "20px", mt: 2 }}>
        {pieces.map((piece, index) => (
          <Image
            key={index}
            src={piece}
            alt={"pieces image"}
            style={{ height: "30px", width: "30px", marginRight: "-4px" }}
          />
        ))}
      </Box>

      {/* Timer */}
      <Box sx={{ mt: 2, paddingX: "20px" }}>
        <Box
          display="inline-block"
          sx={{
            backgroundColor: "#545454",
            padding: "4px 12px",
            borderRadius: "4px",
          }}
        >
          <Typography sx={{ color: "white", fontWeight: "bold" }}>
            {timer || "--:--"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PlayerComp;
