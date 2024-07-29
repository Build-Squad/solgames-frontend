import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import Image from "next/image";
import solanaIcon from "../../../assets/solanaLogoMark.svg";
import { useSnackbar } from "@/context/snackbarContext";
import { useAuth } from "@/context/authContext";
import { useAcceptGame } from "@/hooks/api-hooks/useGames";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 3,
};

interface DummySignTransactionProps {
  open: boolean;
  handleClose: () => void;
  setIsTransactionSigned: (isTransactionSigned: boolean) => void;
  joiningCode?: string;
  type?: string;
}

const DummySignTransaction = ({
  open,
  handleClose,
  setIsTransactionSigned,
  joiningCode,
  type = "ACCEPT",
}: DummySignTransactionProps) => {
  const [loading, setLoading] = useState(false);
  const [transactionApproved, setTransactionApproved] = useState(false);
  const { showMessage } = useSnackbar();
  const { user } = useAuth();
  const { acceptGameMutateAsync } = useAcceptGame();

  const handleSign = async () => {
    setLoading(true);
    if (type == "ACCEPT") {
      try {
        const res = await acceptGameMutateAsync({
          acceptorId: user?.id,
          joiningCode,
        });
        if (res.success) {
          setTimeout(() => {
            setLoading(false);
            setTransactionApproved(true);
            showMessage("Accepted Successfully!");
            setIsTransactionSigned(true);
            handleClose();
          }, 2000);
        } else {
          throw res.message;
        }
      } catch (err) {
        setLoading(false);
        showMessage(err, "error");
      }
    } else {
      setTimeout(() => {
        setLoading(false);
        setTransactionApproved(true);
        showMessage("Created Successfully!");
        setIsTransactionSigned(true);
        handleClose();
      }, 2000);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
          <Image src={solanaIcon} alt="Solana" width={40} height={40} />
        </Box>
        <Typography variant="h5" align="center">
          1 SOL
        </Typography>
        <Typography variant="subtitle1" align="center" color="textSecondary">
          ≈ 24.00 USD
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2">
          <b>Network</b> : Solana
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <b>Token</b> : SOL
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2">
          <b>Sender address</b> : 0x65231SDA65412KJASBNDB3
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <b>Receiver address</b> : 0x65231SDA65412KJASBNDB
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="body2">Amount</Typography>
          <Typography variant="body2">1 SOL</Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="body2">Fee</Typography>
          <Typography variant="body2">0.001234 ETH ≈ 1.40 USD</Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSign}
          disabled={loading || transactionApproved}
          sx={{ py: 1.5, mt: 4 }}
        >
          {loading ? <CircularProgress size={24} /> : "Sign Transaction"}
        </Button>
        {transactionApproved && (
          <Typography
            variant="body2"
            color="success.main"
            align="center"
            mt={2}
          >
            Transaction Approved
          </Typography>
        )}
        <Typography
          variant="caption"
          align="center"
          display="block"
          mt={2}
          color="textSecondary"
        >
          Powered by Solana Wallet
        </Typography>
      </Box>
    </Modal>
  );
};

export default DummySignTransaction;
