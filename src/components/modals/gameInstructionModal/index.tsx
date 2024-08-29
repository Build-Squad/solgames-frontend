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
import { useAuth } from "@/context/authContext";
import { useWeb3Auth } from "@/context/web3AuthProvider";
import { useSnackbar } from "@/context/snackbarContext";
import { useRouter } from "next/navigation";
import { PublicKey } from "@solana/web3.js";

const GameInstructionModal: React.FC<{
  open: boolean;
  acceptorPubKey: string;
  creatorPubKey: string;
  onClose: () => void;
}> = ({ open, onClose, acceptorPubKey, creatorPubKey }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { showMessage } = useSnackbar();

  // Check weather the person who sign's the game rules is the person who's game it is
  // In this we'll check both the player, if any of the player's public key signs, we let them in.

  const { signMessage, verifySignature } = useWeb3Auth();

  const handleSignMessage = async () => {
    // only handling for web3auth
    if (user?.publicKey) {
      if (user?.verifier == "web3auth") {
        let isValid = false;
        const { base64Signature, message } = await signMessage();
        if (acceptorPubKey) {
          isValid =
            isValid ||
            verifySignature(
              message,
              base64Signature,
              new PublicKey(acceptorPubKey)
            );
        }
        if (creatorPubKey) {
          isValid =
            isValid ||
            verifySignature(
              message,
              base64Signature,
              new PublicKey(creatorPubKey)
            );
        }
        if (isValid) onClose();
        else {
          showMessage(
            "You're not a valid user for this game! Error from signing the message!",
            "error"
          );
          router.push("my-games");
        }
      } else {
        onClose();
      }
    }
  };

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      onClose={(event, reason) => {
        if (reason === "backdropClick") {
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
          onClick={handleSignMessage}
        >
          I Understood!
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GameInstructionModal;
