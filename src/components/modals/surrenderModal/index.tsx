import { Box, Button, Divider, Modal, Typography } from "@mui/material";
import React from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  handleSurrender: () => void;
};

export default function index({ onClose, open, handleSurrender }: Props) {
  const handleSurrenderClick = () => {
    handleSurrender();
    onClose();
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
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
          Are You Sure You Want to Surrender?
        </Typography>
        <Typography
          variant="body1"
          sx={{ mb: 2, color: "#b0b0b0", textAlign: "center" }}
        >
          By surrendering, you will{" "}
          <b style={{ color: "#fff" }}> lose the current game</b>, and you will{" "}
          <b style={{ color: "#fff" }}>lose the bet amount.</b>
        </Typography>
        <Divider sx={{ my: 2, bgcolor: "#333333" }} />{" "}
        {/* Divider to separate content */}
        <Button
          variant="contained"
          onClick={handleSurrenderClick}
          fullWidth
          sx={{
            fontWeight: "700",
            backgroundColor: "#FF5C00",
            color: "#000",
            "&:hover": {
              backgroundColor: "#E55A00",
            },
            mb: 2,
          }}
        >
          Yes, Surrender
        </Button>
        <Button
          variant="outlined"
          onClick={onClose}
          fullWidth
          sx={{
            fontWeight: "700",
            borderColor: "#FF5C00",
            color: "#FF5C00",
            "&:hover": {
              backgroundColor: "#333333",
              borderColor: "#FF5C00",
            },
          }}
        >
          No, Keep Playing
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
