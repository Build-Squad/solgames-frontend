import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, forwardRef, useState } from "react";

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function JoinGameModal({ handleClose }) {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState("");
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInviteCode(e.target.value);
  };

  const joinGame = () => {
    router.push(`/play?inviteCode=${inviteCode}`);
  };
  
  return (
    <Dialog
      open={true}
      onClose={handleClose}
      TransitionComponent={Transition}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle>
        {"Please enter the invite code to join your friends game?"}
      </DialogTitle>
      <DialogContent>
        <TextField
          value={inviteCode}
          onChange={handleChange}
          variant="filled"
          fullWidth
          label="Invite Code"
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          sx={{
            border: "1px solid #FF5C00",
            color: "black",
            px: 4,
            fontWeight: "bold",
            ":hover": {
              border: "1px solid #FF5C00",
            },
          }}
          onClick={handleClose}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{
            color: "black",
            backgroundColor: "#FF5C00",
            px: 4,
            fontWeight: "bold",
            ":hover": {
              backgroundColor: "#FF5C00",
            },
          }}
          onClick={joinGame}
          autoFocus
        >
          Join
        </Button>
      </DialogActions>
    </Dialog>
  );
}
