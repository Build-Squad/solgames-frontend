import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Chip,
  Box,
} from "@mui/material";
import { STATUS_COLORS } from "@/utils/constants";
import { differenceInSeconds } from "date-fns";
import { Game } from "@/types/game";
import { useRouter } from "next/navigation";
import DotsLoader from "@/components/loadingComponent/dotLoader";

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

const getStatusColor = (status: string) => {
  switch (status) {
    case "Scheduled":
      return STATUS_COLORS.Scheduled.background;
    case "Accepted":
      return STATUS_COLORS.Accepted.background;
    case "InProgress":
      return STATUS_COLORS.InProgress.background;
    case "Completed":
      return STATUS_COLORS.Completed.background;
    case "Draw":
      return STATUS_COLORS.Draw.background;
    case "Expired":
      return STATUS_COLORS.Expired.background;
    default:
      return "#ccc";
  }
};

const GameDetailsDialog: React.FC<GameDetailsDialogProps> = ({
  handleClose,
  game,
}) => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState<number>();

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
      const newTimeLeft = differenceInSeconds(gameDate, new Date());
      if (newTimeLeft <= 0) {
        setTimeLeft(0);
        clearInterval(interval);
      } else {
        setTimeLeft(newTimeLeft);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [game.gameDateTime]);

  const handlePlay = () => {
    router.push(`/play?inviteCode=${game.inviteCode}`);
  };

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
          backgroundColor: "#121212",
          padding: "16px",
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          mb: 4,
        }}
      >
        <Typography
          component={"span"}
          sx={{
            color: "#fff",
            fontWeight: "bold",
            textAlign: "center",
            fontSize: "1.5rem",
            position: "relative",
          }}
        >
          Game Details
          <Chip
            size="small"
            label={game.gameStatus}
            sx={{
              paddingX: "4px",
              fontSize: "12px",
              backgroundColor: getStatusColor(game.gameStatus),
              fontWeight: "bold",
              position: "absolute",
              top: 0,
              left: "100%",
              transform: "translateY(-40%)",
            }}
          />
        </Typography>
      </DialogTitle>
      <DialogContent
        sx={{
          color: "#fff",
          padding: "24px",
          borderRadius: "8px",
        }}
      >
        <Grid container spacing={2}>
          {game?.gameStatus == STATUS_COLORS.Completed.value ? (
            <Grid
              item
              xs={6}
              display="flex"
              columnGap={2}
              alignItems={"center"}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Winner:
              </Typography>
              <Typography>{game?.winnerId}</Typography>
            </Grid>
          ) : null}
          {game?.creator ? (
            <Grid
              item
              xs={6}
              display="flex"
              columnGap={2}
              alignItems={"center"}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Game Creator:
              </Typography>
              <Typography
                sx={{
                  maxWidth: "60%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {game?.creator?.name ?? game?.creator?.publicKey}
              </Typography>
            </Grid>
          ) : null}
          {game?.acceptor ? (
            <Grid
              item
              xs={6}
              display="flex"
              columnGap={2}
              alignItems={"center"}
            >
              <Typography variant="subtitle1" fontWeight="bold">
                Game Acceptor:
              </Typography>
              <Typography
                sx={{
                  maxWidth: "60%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {game?.acceptor?.name ?? game?.acceptor?.publicKey}
              </Typography>
            </Grid>
          ) : null}
          <Grid item xs={6} display="flex" columnGap={2} alignItems={"center"}>
            <Typography variant="subtitle1" fontWeight="bold">
              Bet Amount:
            </Typography>
            <Chip
              label={`${game?.betAmount} SOL`}
              sx={{ color: "white", borderColor: "white", fontWeight: "bold" }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={6} display="flex" columnGap={2} alignItems={"center"}>
            <Typography variant="subtitle1" fontWeight="bold">
              Invite Code:
            </Typography>
            <Typography>{game?.inviteCode}</Typography>
          </Grid>
          <Grid item xs={6} display="flex" columnGap={2} alignItems={"center"}>
            <Typography variant="subtitle1" fontWeight="bold">
              Game Date Time:
            </Typography>
            <Typography>{gameDate.toLocaleString()}</Typography>
          </Grid>
          <Grid item xs={6} display="flex" columnGap={2} alignItems={"center"}>
            <Typography variant="subtitle1" fontWeight="bold">
              Status:
            </Typography>
            <Chip
              label={game.gameStatus}
              sx={{
                backgroundColor: getStatusColor(game.gameStatus),
                fontWeight: "bold",
              }}
            />
          </Grid>
          {timeLeft == undefined && (
            <Box
              sx={{
                mt: 2,
                height: "100%",
                width: "100%",
                marginBottom: "-2%",
                marginLeft: "1%",
              }}
            >
              <DotsLoader />
            </Box>
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
              color: "#fff",
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
