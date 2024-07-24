import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
  Box,
} from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import { useSnackbar } from "@/context/snackbarContext";


const CreateCelebrationModal = ({ open, handleClose, inviteCode }) => {
  const { showMessage } = useSnackbar();

  const handleCopyCode = () => {
    showMessage("Code copied to clipboard", "success");
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_FRONTEND}/join-game?joiningCode=${inviteCode}`
    );
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth={true}
      maxWidth={"md"}
      PaperProps={{
        style: {
          backgroundColor: "#1e1e2f",
          color: "#fff",
          padding: "20px",
          borderRadius: "15px",
          paddingBottom: "40px",
        },
      }}
    >
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#FF5C00",
            }}
          >
            Game Created Successfully!
          </Typography>
          <Typography variant="h6" sx={{ textAlign: "center" }}>
            Congratulations!
            <br />
            Your chess game has been created.
          </Typography>
          <Typography variant="body1" sx={{ textAlign: "center" }}>
            Share the following invite code with your friend to join the game:
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              columnGap: "8px",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", color: "#FF5C00", textAlign: "center" }}
            >
              {inviteCode}
            </Typography>
            <ContentCopy
              onClick={handleCopyCode}
              style={{ cursor: "pointer" }}
              fontSize="small"
            />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1 }}>
            Instructions:
          </Typography>
          <Typography variant="body2" sx={{ textAlign: "center" }}>
            Copy the invite code. <br />
            Share it with your friend. <br />
            Your friend can use this code to join the game.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          sx={{
            px: 4,
            fontWeight: "bold",
            backgroundColor: "#FF5C00",
            color: "#000",
            ":hover": {
              backgroundColor: "#FF5C00",
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateCelebrationModal;
