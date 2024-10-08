import {
  TextField,
  Button,
  Slide,
  Modal,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, forwardRef, useState } from "react";

export default function JoinGameModal({ handleClose }) {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState("");

  const joinGame = () => {
    router.push(`/join-game?joiningCode=${inviteCode}`);
  };
  return (
    <Modal
      open={true}
      onClose={handleClose}
      sx={{
        backdropFilter: "blur(10px)",
        bgcolor: "rgba(0, 0, 0, 0.7)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          bgcolor: "#121212",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          color: "#ffffff",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{ mb: 2, color: "#ffffff", textAlign: "center" }}
        >
          Join a Game Using an Invite Code
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 2, color: "#b0b0b0", textAlign: "center" }}
        >
          To join a game and participate in the{" "}
          <b style={{ color: "#fff" }}>
            Chessmate - A Web3 betting chess game on Solana
          </b>
          , please enter the invite code below. Bet against your friend and win
          crypto!
        </Typography>
        <Divider sx={{ my: 2, bgcolor: "#333333" }} />{" "}
        {/* Divider to separate content */}
        <TextField
          label="Invite Code"
          variant="outlined"
          fullWidth
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              bgcolor: "#333333",
              color: "#ffffff",
            },
            "& .MuiFormLabel-root": {
              color: "#b0b0b0",
            },
          }}
        />
        <Button
          variant="contained"
          onClick={joinGame}
          fullWidth
          sx={{
            fontWeight: "700",
            backgroundColor: "#FF5C00",
            color: "#000",
            "&:hover": {
              backgroundColor: "#E55A00",
            },
          }}
        >
          Join Game
        </Button>
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
            Need help? Contact support or join our community for assistance.
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
}
