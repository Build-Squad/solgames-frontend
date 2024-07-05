import { Box } from "@mui/material";
import React from "react";
import Chessboard from "@/components/chessboard/chessboard";

type Props = {};

export default function Play({}: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Chessboard />
    </Box>
  );
}
