import { useState, forwardRef, useEffect } from "react";
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
  CircularProgress,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { Questrial } from "next/font/google";
import Image from "next/image";
import solanaIcon from "../../../assets/solanaLogoMark.svg";
import { useSnackbar } from "@/context/snackbarContext";
import { useAuth } from "@/context/authContext";
import { useCreateGame } from "@/hooks/api-hooks/useGames";
import { useLoader } from "@/context/loaderContext";
import { generateInviteCode } from "@/utils/helper";
import CreateCelebrationModal from "../createCelebrationModal";
import SignTransactionModal from "../SignTransactionModal";
import { useCreateEscrow } from "@/hooks/api-hooks/useEscrow";

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
  const { showMessage } = useSnackbar();
  const { user } = useAuth();
  const { createGameMutateAsync } = useCreateGame();
  const { showLoader, hideLoader } = useLoader();
  const [inviteCode, setInviteCode] = useState("");
  const [isCelebrationModalOpen, setIsCelebrationModalOpen] = useState(false);
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);

  const {
    isCreateEscrowLoading,
    createEscrowMutateAsync,
    createEscrowResponse,
  } = useCreateEscrow();

  const handleCreateEscrow = async () => {
    if (validateDateTime(date, time, betAmount)) {
      try {
        const res = await createEscrowMutateAsync({
          amount: parseFloat(betAmount),
          userId: user?.id,
          publicKey: user?.publicKey,
        });
        if (res.success) {
          showMessage(res.message, "success");
          setTransactionModalOpen(true);
        } else {
          showMessage(res.message, "error");
        }
      } catch (e) {
        showMessage("Something went wrong!", "error");
      }
    }
  };

  const createGame = async () => {
    showLoader();
    if (validateDateTime(date, time, betAmount)) {
      const newInviteCode = generateInviteCode();
      await createGameMutateAsync({
        betAmount: parseFloat(betAmount),
        inviteCode: newInviteCode,
        gameDateTime: `${date}T${time}:00`,
        creatorId: user.id,
      });
      setInviteCode(newInviteCode);
      setIsCelebrationModalOpen(true);
    }
    hideLoader();
  };

  const validateDateTime = (selectedDate, selectedTime, betAmount) => {
    const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
    const currentDateTime = new Date();
    currentDateTime.setMinutes(currentDateTime.getMinutes() + 1);

    const parsedAmount = parseFloat(betAmount);
    const isValidBetAmount = !isNaN(parsedAmount) && parsedAmount > 0;

    if (!isValidBetAmount) {
      showMessage("Invalid bet amount!", "error");
      return false;
    } else if (selectedDateTime < currentDateTime) {
      showMessage("Date and time must be at least 1 minute ahead!", "error");
      return false;
    } else return true;
  };

  const handleCelebrationModalClose = () => {
    setIsCelebrationModalOpen(false);
    handleClose();
  };

  const currentDateTime = getCurrentDateTimeISO();

  return (
    <>
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
            paddingBottom: "40px",
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
                    <Image
                      src={solanaIcon}
                      alt="Solana"
                      width={20}
                      height={20}
                    />
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
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: currentDateTime.currentDate }}
              fullWidth
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
              onChange={(e) => setTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{
                min:
                  date === currentDateTime.currentDate
                    ? currentDateTime.currentTime
                    : undefined,
              }}
              fullWidth
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
            onClick={handleCreateEscrow}
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
            {isCreateEscrowLoading ? (
              <CircularProgress
                size={24}
                sx={{ fontWeight: "bold", color: "#000" }}
              />
            ) : (
              "Create Game"
            )}
          </Button>
        </DialogActions>
      </Dialog>
      <CreateCelebrationModal
        open={isCelebrationModalOpen}
        handleClose={handleCelebrationModalClose}
        inviteCode={inviteCode}
      />
      <SignTransactionModal
        open={transactionModalOpen}
        handleClose={() => setTransactionModalOpen(false)}
        createGame={createGame}
        type={"CREATE"}
        betAmount={betAmount}
        escrowId={createEscrowResponse?.data?.vaultId}
        serializedTransaction={
          createEscrowResponse?.data?.serializedTransaction
        }
      />
    </>
  );
};

export default CreateGameModal;
