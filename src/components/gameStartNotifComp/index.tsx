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
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { Divider } from "@mui/material";

const MIN_IN_MILI = 5 * 60 * 1000; // 5 minutes in milliseconds

const GameStartNotificationComponent: React.FC = () => {
  const pathname = usePathname();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    game?: Game;
  }>({ open: false, message: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

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
      const startTime = new Date(game.gameDateTime);
      const diff = startTime.getTime() - now.getTime();

      if (
        diff <= MIN_IN_MILI &&
        diff > 0 &&
        game.gameStatus === STATUS_COLORS.Accepted.value
      ) {
        showSnackbar(
          `Tighten up your seat belts. Your Game is starting soon with invite code "${game.inviteCode}"!`,
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
        const diff = startTime.getTime() - now.getTime();
        return Math.max(Math.floor(diff / 1000), 0);
      };

      timer = setInterval(() => {
        if (calculateTimeLeft() == 0) {
          handleCloseSnackbar();
        }
        setTimeLeft(calculateTimeLeft());
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

  const handleShowDetails = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const formatTimeLeft = (seconds: number | null) => {
    if (seconds === null) return "";
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <>
      <Snackbar
        open={snackbar.open}
        onClose={(event, reason) => {
          if (reason !== "clickaway") {
            handleCloseSnackbar();
          }
        }}
        sx={{
          maxWidth: "30vw",
          "& .MuiSnackbarContent-root": {
            backgroundColor: "#333",
            color: "#fff",
          },
        }}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity="info"
          sx={{
            backgroundColor: "#333",
            color: "#fff",
            "& .MuiAlert-action": {
              color: "#fff",
              minWidth: "fit-content",
            },
          }}
          action={
            <>
              <Button
                color="inherit"
                onClick={handleShowDetails}
                sx={{ fontWeight: "bold", py: 1 }}
              >
                Show Details
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
          {snackbar.game && <div>Starts in: {formatTimeLeft(timeLeft)}</div>}
        </MuiAlert>
      </Snackbar>
      {modalOpen && (
        <GameDetailsModal handleClose={handleCloseModal} game={snackbar.game} />
      )}
    </>
  );
};

export default GameStartNotificationComponent;
