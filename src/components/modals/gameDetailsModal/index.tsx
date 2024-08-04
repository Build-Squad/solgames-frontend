import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Badge,
  Chip,
  Box,
} from "@mui/material";
import { STATUS_COLORS } from "@/utils/constants";
import { differenceInSeconds } from "date-fns";
import { Game } from "@/types/game";

interface GameDetailsDialogProps {
  handleClose: () => void;
  game: Game;
}

const formatTimeLeft = (seconds: number) => {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${days}d ${String(hours).padStart(2, "0")}h:${String(
    minutes
  ).padStart(2, "0")}m:${String(remainingSeconds).padStart(2, "0")}s`;
};

const GameDetailsDialog: React.FC<GameDetailsDialogProps> = ({
  handleClose,
  game,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const gameDate = new Date(game?.gameDateTime);
  const playButtonEnabled =
    ![
      STATUS_COLORS.Draw.value,
      STATUS_COLORS.Expired.value,
      STATUS_COLORS.Completed.value,
    ].includes(game.gameStatus) &&
    timeLeft <= 0 &&
    game.isGameAccepted;

  useEffect(() => {
    const gameDate = new Date(game.gameDateTime);
    const interval = setInterval(() => {
      setTimeLeft(differenceInSeconds(gameDate, new Date()));
    }, 1000);

    return () => clearInterval(interval);
  }, [game.gameDateTime]);

  const handlePlay = () => {
    // router.push(`/play?inviteCode=${game.inviteCode}`);
  };

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          boxShadow: "10px 10px 10px 10px black",
          backgroundColor: "black",
        },
      }}
    >
      <DialogTitle
        sx={{
          color: "#fff",
          fontWeight: "bold",
          textAlign: "center",
          fontSize: "1.5rem",
        }}
      >
        Game Details
      </DialogTitle>
      <DialogContent
        sx={{
          color: "#fff",
          padding: "24px",
          borderRadius: "8px",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              ID:
            </Typography>
            <Typography>{game?.id}</Typography>
          </Grid>
          <Grid item xs={6} textAlign={"right"}>
            <Typography variant="subtitle1" fontWeight="bold">
              Bet Amount:
            </Typography>
            <Chip label={game?.betAmount} color="primary" />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              Invite Code:
            </Typography>
            <Typography>{game?.inviteCode}</Typography>
          </Grid>
          <Grid item xs={6} textAlign={"right"}>
            <Typography variant="subtitle1" fontWeight="bold">
              Game Date Time:
            </Typography>
            <Typography>{gameDate.toLocaleString()}</Typography>
          </Grid>
          {game?.acceptorId && (
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold">
                Acceptor ID:
              </Typography>
              <Typography>{game.acceptorId}</Typography>
            </Grid>
          )}
          {timeLeft > 0 &&
            [
              STATUS_COLORS.Scheduled.value,
              STATUS_COLORS.Accepted.value,
            ].includes(game.gameStatus) && (
              <Grid item xs={12} textAlign="center">
                <Box mt={2}>
                  <Typography variant="h6" fontWeight="bold">
                    Time Left: {formatTimeLeft(timeLeft)}
                  </Typography>
                </Box>
              </Grid>
            )}
        </Grid>
      </DialogContent>
      <DialogActions
        sx={{
          color: "#fff",
          justifyContent: "center",
          padding: "16px",
          borderRadius: "8px",
        }}
      >
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            color: "#FF5C00",
            borderColor: "#FF5C00",
            ":hover": {
              borderColor: "#FF5C00",
              backgroundColor: "none",
            },
          }}
        >
          Close
        </Button>
        {playButtonEnabled && (
          <Button
            onClick={handlePlay}
            variant="contained"
            sx={{
              color: "black",
              backgroundColor: "#FF5C00",
              fontWeight: "bold",
              transition: "transform .1s",
              ":hover": {
                backgroundColor: "#FF5C00",
              },
            }}
          >
            Play
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default GameDetailsDialog;
