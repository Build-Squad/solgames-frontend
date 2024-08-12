// components/InfoModal.tsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  IconButton,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";

const InfoModal: React.FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      onClose={(event, reason) => {
        if (reason === 'backdropClick') {
          return;
        }
        onClose();
      }}
      PaperProps={{
        sx: {
          bgcolor: "#1e1e1e", // Dark background
          color: "#e0e0e0", // Light text color
          borderRadius: "12px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "#333333", // Dark header background
          color: "#ffffff", // Light header text
          display: "flex",
          alignItems: "center",
          padding: "16px 24px",
        }}
      >
        <InfoIcon sx={{ mr: 1 }} />
        Game Rules and Regulations
        <Box sx={{ flexGrow: 1 }} />
        <IconButton
          onClick={onClose}
          aria-label="close"
          sx={{ color: "#ffffff" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          mt: 3,
          padding: "24px",
          bgcolor: "#1e1e1e", // Ensuring content background matches the modal
          color: "#e0e0e0", // Light text color
        }}
      >
        <Typography variant="h6" gutterBottom>
          Basic Rules:
        </Typography>
        <Typography variant="body1" paragraph>
          - Each player will be given 4 minutes of time for each turn. If this
          limit is exceeded, a 2-minute warning will be given.
        </Typography>
        <Typography variant="body1" paragraph>
          - The player must make a move within these 2 minutes after the
          warning. If not he/she will be forfeited from the game and the other
          player will win and take away the betted token.
        </Typography>
        <Typography variant="body1" paragraph>
          - If the player continues to exceed the 4-minute timer, a total of 3
          warnings will be given.
        </Typography>
        <Typography variant="body1" paragraph>
          - After the third warning, if he/she continues, the game will be
          forfeited, and the other player will be declared as the winner.
        </Typography>
        <Divider sx={{ my: 2, bgcolor: "#444444" }} />
        <Typography variant="body2">
          Thank you for reading the rules and ensuring a fair and enjoyable game
          experience!
        </Typography>
      </DialogContent>
      <DialogActions
        sx={{
          padding: "8px 24px",
          bgcolor: "#333333", // Dark background for actions
        }}
      >
        <Button
          variant="contained"
          sx={{
            color: "black",
            backgroundColor: "#FF5C00",
            px: 5,
            py: 1.5,
            fontWeight: "bold",
            ":hover": {
              backgroundColor: "#FF5C00",
            },
          }}
          onClick={onClose}
        >
          I Understood!
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InfoModal;
