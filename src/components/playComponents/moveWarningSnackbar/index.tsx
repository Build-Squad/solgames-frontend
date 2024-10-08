import React, { useState, useEffect } from "react";
import { Snackbar, Alert, Typography } from "@mui/material";

type TimerSnackbarProps = {
  open: boolean;
  onClose: () => void;
  initialTime: number;
  onTimeout: () => void;
};

// Ideally 120 for 2 minutes
export const WARNING_TIME_IN_SECONDS = 120;

const MoveWarningSnackbar: React.FC<TimerSnackbarProps> = ({
  open,
  onClose,
  initialTime,
  onTimeout,
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [warningMessage, setWarningMessage] = useState("");

  useEffect(() => {
    if (!open) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open, onTimeout]);

  useEffect(() => {
    if (
      timeLeft <= WARNING_TIME_IN_SECONDS &&
      timeLeft > WARNING_TIME_IN_SECONDS / 2
    ) {
      setWarningMessage("You have less than 2 minutes to make a move!");
    } else if (timeLeft <= WARNING_TIME_IN_SECONDS / 2) {
      setWarningMessage("You have less than 1 minute to make a move!");
    } else {
      setWarningMessage("");
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={null}
      onClose={(event, reason) => {
        if (reason !== "clickaway") {
          onClose();
        }
      }}
    >
      <Alert onClose={onClose} severity="warning" sx={{ width: "100%" }}>
        <Typography variant="body2">{warningMessage}</Typography>
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          Time left: {formatTime(timeLeft)}
        </Typography>
      </Alert>
    </Snackbar>
  );
};

export default MoveWarningSnackbar;
