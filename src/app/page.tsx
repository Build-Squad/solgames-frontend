"use client";

import { useRouter } from "next/navigation";
import chessBackground from "../assets/chessBackground.svg";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  TextField,
  Typography,
} from "@mui/material";
import { Questrial } from "next/font/google";
import Spline from "@splinetool/react-spline";
import { useState, forwardRef, ChangeEvent } from "react";
import { TransitionProps } from "@mui/material/transitions";
import { generateInviteCode } from "@/utils/helper";

const questrial = Questrial({
  weight: "400",
  subsets: ["latin"],
});

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Home() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState("");

  const handleClose = () => setOpen(false);

  const joinGame = () => {
    router.push(`/play?inviteCode=${inviteCode}`);
  };

  const createGame = () => {
    router.push(`/play?gameCode=${generateInviteCode()}`);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInviteCode(e.target.value);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        position: "relative",
        backgroundImage: `url(${chessBackground.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Spline
        scene="https://prod.spline.design/XjnA5ZK0j9aKmlCa/scene.splinecode"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
        }}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          height: "100%",
          color: "white",
          alignItems: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        <Typography
          variant="h1"
          fontWeight={"bold"}
          className={questrial.className}
          sx={{
            fontSize: { xs: "2rem", sm: "3rem", lg: "5rem", xl: "7rem" },
            letterSpacing: "0.1em",
            fontWeight: "700 !important",
            transform: "scaleX(1.6) scaleY(1.2)",
          }}
        >
          CHESSMATE
        </Typography>
        <Typography
          variant="h6"
          align="center"
          sx={{
            mt: 0,
            width: "35vw",
            color: "#757575",
            lineHeight: "1.6rem",
          }}
        >
          World’s No. #1 decentralized chess game to stake crypto to play chess
          with friends and the winner takes all.
        </Typography>
        <Box display={"flex"} columnGap={"20px"}>
          <Button
            variant="contained"
            sx={{
              color: "black",
              backgroundColor: "#FF5C00",
              mt: 4,
              px: 5,
              py: 1.5,
              fontWeight: "bold",
              transition: "transform .1s",
              ":hover": {
                backgroundColor: "#FF5C00",
                transform: "rotate(-10deg)",
              },
            }}
            onClick={createGame}
          >
            Create A Game
          </Button>
          <Button
            variant="contained"
            sx={{
              color: "black",
              backgroundColor: "#FF5C00",
              mt: 4,
              px: 5,
              py: 1.5,
              fontWeight: "bold",
              transition: "transform .1s",
              ":hover": {
                backgroundColor: "#FF5C00",
                transform: "rotate(-10deg)",
              },
            }}
            onClick={() => {
              setOpen(true);
            }}
          >
            Join A Game
          </Button>
        </Box>
        <Button
          sx={{
            color: "#FF5C00",
            mt: 2,
            px: 5,
            py: 1.5,
          }}
        >
          Play with computer
        </Button>
      </Box>
      <Dialog
        open={open}
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
    </Box>
  );
}
