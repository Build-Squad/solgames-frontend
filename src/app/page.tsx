"use client";

import chessBackground from "../assets/chessBackground.svg";
import { Box, Button, Typography } from "@mui/material";

export default function Home() {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        backgroundImage: `url(${chessBackground.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          height: "100%",
          color: "white",
          alignItems: "center",
        }}
      >
        <Typography variant="h1" fontWeight={"bold"}>
          CHESSMATE
        </Typography>
        <Typography
          variant="h6"
          align="center"
          sx={{ mt: 2, width: "35vw", color: "#757575", lineHeight: "1.6rem" }}
        >
          World’s No. #1 decentralized chess game to stake crypto to play chess
          with friends and the winner takes all.
        </Typography>
        <Button
          variant="contained"
          sx={{
            color: "black",
            backgroundColor: "#FF5C00",
            mt: 4,
            px: 5,
            fontWeight: "bold",
            transition: "transform .1s",
            ":hover": {
              backgroundColor: "#FF5C00",
              transform: "rotate(-10deg)",
            },
          }}
        >
          PLAY ONLINE
        </Button>
        <Button
          sx={{
            color: "#FF5C00",
            mt: 1,
            textTransform: "none",
            transition: "transform .1s",
            ":hover": {
              transform: "rotate(-10deg)",
            },
          }}
        >
          Play with computer
        </Button>
      </Box>
    </Box>
  );
}
