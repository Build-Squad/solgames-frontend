import { useState, forwardRef } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  TextField,
  Box,
  InputAdornment,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { Questrial } from "next/font/google";
import Image from "next/image";
import solanaIcon from "../../../assets/solanaLogoMark.svg";
import { useSnackbar } from "@/context/snackbarContext";

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

// Function to get current date and time in ISO format
const getCurrentDateTimeISO = () => {
  const now = new Date();
  return {
    currentDate: now.toISOString().split("T")[0],
    currentTime: now.toTimeString().split(" ")[0].substring(0, 5),
  };
};

const CreateGameModal = ({ handleClose }) => {
  const [betAmount, setBetAmount] = useState("0");
  const [date, setDate] = useState(getCurrentDateTimeISO().currentDate);
  const [time, setTime] = useState(() => {
    const currentDateTime = new Date();
    currentDateTime.setMinutes(currentDateTime.getMinutes() + 2);
    return currentDateTime.toTimeString().split(" ")[0].substring(0, 5);
  });
  const [isDateTimeValid, setIsDateTimeValid] = useState(true);
  const { showMessage } = useSnackbar();

  const validateDateTime = (selectedDate, selectedTime) => {
    const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
    const currentDateTime = new Date();
    currentDateTime.setMinutes(currentDateTime.getMinutes() + 1);

    if (selectedDateTime > currentDateTime) {
      setIsDateTimeValid(true);
      return true;
    } else {
      setIsDateTimeValid(false);
      return false;
    }
  };

  const handleCreateGame = () => {
    if (validateDateTime(date, time)) {
      console.log("Bet Amount:", betAmount);
      console.log("Date:", date);
      console.log("Time:", time);
      handleClose();
    } else {
      showMessage(
        "Selected date and time must be at least 1 minute ahead of the current time.",
        "error"
      );
    }
  };

  const currentDateTime = getCurrentDateTimeISO();

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      TransitionComponent={Transition}
      fullWidth={true}
      maxWidth={"md"}
      PaperProps={{
        style: {
          backgroundColor: "#1e1e2f",
          color: "#fff",
          padding: "20px",
          borderRadius: "15px",
          paddingBottom:"40px"
        },
      }}
    >
      <DialogTitle
        id="create-game-dialog-title"
        className={questrial.className}
        sx={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: "#FF5C00",
        }}
      >
        Create Chess Game
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            label="Bet Solana"
            type="number"
            variant="filled"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Image src={solanaIcon} alt="Solana" width={20} height={20} />
                </InputAdornment>
              ),
              inputProps: {
                min: 0,
              },
            }}
            fullWidth
            sx={{
              backgroundColor: "#2d2d44",
              borderRadius: "5px",
              input: { color: "#fff" },
              label: { color: "#888" },
            }}
          />
          <TextField
            label="Date"
            type="date"
            variant="filled"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              validateDateTime(e.target.value, time);
            }}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: currentDateTime.currentDate }}
            fullWidth
            error={!isDateTimeValid}
            helperText={
              !isDateTimeValid
                ? "Date and time must be at least 1 minute ahead"
                : ""
            }
            sx={{
              backgroundColor: "#2d2d44",
              borderRadius: "5px",
              input: { color: "#fff" },
              label: { color: "#888" },
            }}
          />
          <TextField
            label="Time"
            type="time"
            variant="filled"
            value={time}
            onChange={(e) => {
              setTime(e.target.value);
              validateDateTime(date, e.target.value);
            }}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              min:
                date === currentDateTime.currentDate
                  ? currentDateTime.currentTime
                  : undefined,
            }}
            fullWidth
            error={!isDateTimeValid}
            helperText={
              !isDateTimeValid
                ? "Date and time must be at least 1 minute ahead"
                : ""
            }
            sx={{
              backgroundColor: "#2d2d44",
              borderRadius: "5px",
              input: { color: "#fff" },
              label: { color: "#888" },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          sx={{
            px: 4,
            fontWeight: "bold",
            color: "#888",
            borderColor: "#888",
            ":hover": {
              borderColor: "#FF5C00",
              color: "#FF5C00",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleCreateGame}
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
          Create Game
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateGameModal;
