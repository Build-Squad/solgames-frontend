"use client";

import chessBackground from "../assets/chessBackground.svg";
import { Box, Button, Typography } from "@mui/material";
import { Questrial } from "next/font/google";
import { useState } from "react";
import CreateGameModal from "@/components/modals/createGameModal";
import { useAuth } from "@/context/authContext";
import JoinGameModal from "@/components/modals/joinGameModal";
import { useSnackbar } from "@/context/snackbarContext";
import { useRouter } from "next/navigation";

const questrial = Questrial({
  weight: "400",
  subsets: ["latin"],
});

export default function Home() {
  const router = useRouter();
  const [joinGameOpen, setJoinGameOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const { showMessage } = useSnackbar();
  const { user } = useAuth();

  const handleClose = () => setJoinGameOpen(false);
  const createGame = () => {
    if (!user?.accessCode) {
      showMessage("You need an access code before creating a game", "error");
      router.push("/my-games");
      return;
    }
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
          Chess with tokens
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
