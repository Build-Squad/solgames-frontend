import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
} from "@mui/material";

interface AccessCodeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (code: string) => void;
}

const AccessCodeModal: React.FC<AccessCodeModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [accessCode, setAccessCode] = useState("");

  const handleSubmit = () => {
    if (accessCode.trim()) {
      onSubmit(accessCode);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        backdropFilter: "blur(10px)", // Apply blur effect to the background
        bgcolor: "rgba(0, 0, 0, 0.7)", // Dark semi-transparent overlay
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600, // Increased width
          bgcolor: "#121212", // Dark background for the modal content
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          color: "#ffffff", // White text color
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{ mb: 2, color: "#ffffff", textAlign: "center" }} // White text color and center alignment
        >
          Welcome to the Chess Betting Platform
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 2, color: "#b0b0b0", textAlign: "center" }} // Light gray text color
        >
          To access the{" "}
          <b style={{ color: "#fff" }}>
            Chessmate - A Web3 betting chess game on Solana
          </b>
          , please enter your access code below. Ensure you have a valid code to
          start playing and winning real cryptos. If you don not have a code, please
          ask a referral.
        </Typography>
        <Divider sx={{ my: 2, bgcolor: "#333333" }} />{" "}
        {/* Divider to separate content */}
        <TextField
          label="Access Code"
          variant="outlined"
          fullWidth
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
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
          onClick={handleSubmit}
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
          Submit
        </Button>
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
            Need help? Contact support or join our community for assistance.
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default AccessCodeModal;
