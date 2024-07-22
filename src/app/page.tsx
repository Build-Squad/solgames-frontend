"use client";

import chessBackground from "../assets/chessBackground.svg";
import { Box, Button, Typography } from "@mui/material";
import { Questrial } from "next/font/google";
import Spline from "@splinetool/react-spline";
import { useState } from "react";
import CreateGameModal from "@/components/modals/createGameModal";
import { useAuth } from "@/context/authContext";
import JoinGameModal from "@/components/modals/joinGameModal";

const questrial = Questrial({
  weight: "400",
  subsets: ["latin"],
});

export default function Home() {
  const [joinGameOpen, setJoinGameOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { user } = useAuth();

  const handleClose = () => setJoinGameOpen(false);
  const createGame = () => {
    setCreateModalOpen(true);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        position: "relative",
        backgroundImage: `url(${chessBackground.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Spline
        scene="https://prod.spline.design/XjnA5ZK0j9aKmlCa/scene.splinecode"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          height: "100%",
          color: "white",
          alignItems: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        <Typography
          variant="h1"
          fontWeight={"bold"}
          className={questrial.className}
          sx={{
            fontSize: { xs: "2rem", sm: "3rem", lg: "5rem", xl: "7rem" },
            letterSpacing: "0.1em",
            fontWeight: "700 !important",
            transform: "scaleX(1.6) scaleY(1.2)",
          }}
        >
          CHESSMATE
        </Typography>
        <Typography
          variant="h6"
          align="center"
          sx={{
            mt: 0,
            width: "35vw",
            color: "#757575",
            lineHeight: "1.6rem",
          }}
        >
          World’s No. #1 decentralized chess game to stake crypto to play chess
          with friends and the winner takes all.
        </Typography>
        {!!user?.id ? (
          <>
            <Box display={"flex"} columnGap={"20px"}>
              <Button
                variant="contained"
                sx={{
                  color: "black",
                  backgroundColor: "#FF5C00",
                  mt: 4,
                  px: 5,
                  py: 1.5,
                  fontWeight: "bold",
                  transition: "transform .1s",
                  ":hover": {
                    backgroundColor: "#FF5C00",
                    transform: "rotate(-10deg)",
                  },
                }}
                onClick={createGame}
              >
                Create A Game
              </Button>
              <Button
                variant="contained"
                sx={{
                  color: "black",
                  backgroundColor: "#FF5C00",
                  mt: 4,
                  px: 5,
                  py: 1.5,
                  fontWeight: "bold",
                  transition: "transform .1s",
                  ":hover": {
                    backgroundColor: "#FF5C00",
                    transform: "rotate(-10deg)",
                  },
                }}
                onClick={() => {
                  setJoinGameOpen(true);
                }}
              >
                Join A Game
              </Button>
            </Box>
            <Button
              sx={{
                color: "#FF5C00",
                mt: 2,
                px: 5,
                py: 1.5,
              }}
            >
              Play with computer
            </Button>
          </>
        ) : null}
      </Box>
      {createModalOpen ? (
        <CreateGameModal handleClose={() => setCreateModalOpen(false)} />
      ) : null}
      {joinGameOpen ? <JoinGameModal handleClose={handleClose} /> : null}
    </Box>
  );
}
