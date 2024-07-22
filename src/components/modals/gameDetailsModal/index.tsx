import React from "react";
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
} from "@mui/material";
import chess_image from "../../../assets/chess2.jpg";
import { STATUS_COLORS } from "@/utils/constants";

interface GameDetailsDialogProps {
  handleClose: () => void;
  game: {
    id: string;
    token: string;
    betAmount: string;
    inviteCode: string;
    gameDateTime: string;
    isGameAccepted: boolean;
    createdAt: string;
    updatedAt: string;
    acceptorId?: string;
    creatorId?: string;
    gameStatus?: string;
  };
}

const GameDetailsDialog: React.FC<GameDetailsDialogProps> = ({
  handleClose,
  game,
}) => {
  const gameDate = new Date(game?.gameDateTime);
  const playButtonEnabled = ![
    STATUS_COLORS.Draw.value,
    STATUS_COLORS.Expired.value,
    STATUS_COLORS.Completed.value,
  ].includes(game.gameStatus);

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      sx={{
        boxShadow: "10px 10px 10px black",
        "& .MuiDialog-paper": {
          backgroundImage: `url(${chess_image.src})`,
          backgroundSize: "cover",
          padding: "32px",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(2px)",
            zIndex: 1,
          },
          "& > *": {
            position: "relative",
            zIndex: 2,
          },
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
            onClick={() => alert("Play!")}
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
