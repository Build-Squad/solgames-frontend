import { Box } from "@mui/material";
import React from "react";
import World_map from "../../assets/World_map.svg";
import Chessboard from "@/components/chessboard/chessboard";

type Props = {};

export default function Play({}: Props) {
  return (
    <Box
      sx={{
        backgroundColor: "#252525",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          height: "80%",
          width: "100%",
          backgroundImage: `url(${World_map.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Box
          sx={{
            alignItems: "center",
            height: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Chessboard />
        </Box>
      </Box>
    </Box>
  );
}