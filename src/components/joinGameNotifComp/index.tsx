'use client'
import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import GameDetailsModal from "@/components/modals/gameDetailsModal";
import { useState, useEffect, useCallback } from "react";
import { Game } from "@/types/game";
import { useGetAllGames } from "@/hooks/api-hooks/useGames";
import { STATUS_COLORS } from "@/utils/constants";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { Divider } from "@mui/material";

const WARNING_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const JoinGameNotificationComponent: React.FC = () => {
  const pathname = usePathname();

  const router = useRouter();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    game?: Game;
  }>({ open: false, message: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [gameInQueue, setGameInQueue] = useState<Game[]>();

  const { user } = useAuth();
  const { data: userGames, updatedRefetch: refetchUserGames } = useGetAllGames(
    user?.userId
  );

  useEffect(() => {
    if (user?.id) {
      refetchUserGames(user?.id);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!userGames || !userGames?.length) return;

    const now = new Date();

    userGames?.forEach((game: Game) => {
      // Check if the game is not in progress
      if (
        ![
          STATUS_COLORS.InProgress.value,
          STATUS_COLORS.Accepted.value,
        ].includes(game.gameStatus)
      ) {
        setGameInQueue(
          (prevQueue) =>
            prevQueue?.filter((queuedGame) => queuedGame.id !== game.id) || []
        );
        return;
      }

      const startTime = new Date(game.gameDateTime);
      const diff = now.getTime() - startTime.getTime();

      if (
        diff >= 0 &&
        diff <= WARNING_DURATION &&
        game.gameStatus == STATUS_COLORS.InProgress.value
      ) {
        if (gameInQueue) {
          setGameInQueue([...gameInQueue, game]);
        } else {
          setGameInQueue([game]);
        }
        showSnackbar(
          `Warning! The game with invite code "${game.inviteCode}" has already started. Please join to avoid loosing the game.`,
          game
        );
      }
    });
  }, [userGames, pathname]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (snackbar.game) {
      const calculateTimeLeft = () => {
        const now = new Date();
        const startTime = new Date(snackbar.game.gameDateTime);
        const elapsed = now.getTime() - startTime.getTime();
        return Math.max(Math.floor((WARNING_DURATION - elapsed) / 1000), 0);
      };

      timer = setInterval(() => {
        const remainingTime = calculateTimeLeft();
        if (remainingTime <= 0) {
          handleCloseSnackbar();
        }
        setTimeLeft(remainingTime);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [snackbar.game]);

  const showSnackbar = useCallback((message: string, game?: Game) => {
    setSnackbar({ open: true, message, game });
  }, []);

  const handleCloseSnackbar = () => {
    setTimeLeft(null);
    setSnackbar({ ...snackbar, open: false });
  };

  const handleRedirect = () => {
    const gameData = gameInQueue?.[0];
    router.push(`play?inviteCode=${gameData?.inviteCode}`);
  };

  const formatTimeLeft = (seconds: number | null) => {
    if (seconds === null) return "";
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (pathname.includes("play")) {
    if (snackbar.open) {
      handleCloseSnackbar();
    }
  }

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackbar.open}
        onClose={(event, reason) => {
          if (reason !== "clickaway") {
            handleCloseSnackbar();
          }
        }}
        sx={{
          width: "35vw",
          "& .MuiSnackbarContent-root": {
            backgroundColor: "#f57c00",
            color: "#fff",
          },
        }}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity="warning"
          sx={{
            backgroundColor: "#f57c00",
            color: "#fff",
            "& .MuiAlert-action": {
              color: "#fff",
              minWidth: "fit-content",
            },
            ".MuiSvgIcon-root": {
              color: "white",
              marginTop: "2px",
            },
          }}
          action={
            <>
              <Button
                color="inherit"
                onClick={handleRedirect}
                sx={{ fontWeight: "bold", py: 1 }}
              >
                Join Game
              </Button>
              <IconButton
                size="small"
                sx={{ py: 1 }}
                color="inherit"
                onClick={handleCloseSnackbar}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </>
          }
        >
          {snackbar.message} <Divider sx={{ backgroundColor: "grey", my: 1 }} />
          {snackbar.game && <div>Join within: {formatTimeLeft(timeLeft)}</div>}
        </MuiAlert>
      </Snackbar>
      {modalOpen && (
        <GameDetailsModal
          handleClose={() => setModalOpen(false)}
          game={snackbar.game}
        />
      )}
    </>
  );
};

export default JoinGameNotificationComponent;
