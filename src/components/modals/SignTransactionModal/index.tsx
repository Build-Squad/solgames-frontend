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
import { useWeb3Auth } from "@/context/web3AuthProvider";
import { useRouter } from "next/navigation";
import { useExecuteEscrow } from "@/hooks/api-hooks/useEscrow";
import { CreateEscrowResponse } from "@/api-services/interfaces/escrowInterface";

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

interface SignTransactionProps {
  open: boolean;
  handleClose: () => void;
  type?: string;
  betAmount: string;
  createGame?: () => Promise<void>;
  inviteCode: string;
  escrowData: CreateEscrowResponse["data"];
}

const SignTransactionModal = ({
  open,
  handleClose,
  type = "ACCEPT",
  betAmount,
  createGame,
  inviteCode,
  escrowData,
}: SignTransactionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [transactionApproved, setTransactionApproved] = useState(false);
  const { showMessage } = useSnackbar();
  const { user } = useAuth();
  const { acceptGameMutateAsync } = useAcceptGame();
  const { transfer } = useWeb3Auth();
  const { executeEscrowMutateAsync } = useExecuteEscrow();

  // 4)
  // After the funds are transferred, store the transaction details in the DB
  // and mark the transaction as completed
  const executeEscrowTransaction = async (
    signedTransaction: string,
    userRole: "Creator" | "Acceptor"
  ) => {
    try {
      const exeRes = await executeEscrowMutateAsync({
        signedTransaction: signedTransaction,
        transactionId: escrowData?.transactionId,
        vaultId: escrowData?.vaultId,
        inviteCode,
        userId: user?.id,
        userRole,
      });
      if (!exeRes.success) {
        showMessage(exeRes.message, "error");
      }
      return true;
    } catch (e) {
      showMessage("Error while execute escrow", "error");
      return false;
    }
  };

  // 3.1)
  // Transfer the funds by signing the transaction as a creator
  const handleCreateGame = async () => {
    const tx = await transfer(escrowData?.serializedTransaction);
    if (tx.success) {
      const executeSuccessfully = await executeEscrowTransaction(
        tx?.data?.encodedSerializedSignedTx,
        "Creator"
      );

      if (executeSuccessfully) {
        createGame();
        setTransactionApproved(true);
        showMessage(tx.message);
      }

      handleClose();
    } else {
      showMessage(tx.message, "error");
    }
  };

  // 3.2)
  // Transfer the funds by signing the transaction as an acceptor
  const handleAcceptGame = async () => {
    const tx = await transfer(escrowData?.serializedTransaction);
    if (tx.success) {
      const executeSuccessfully = await executeEscrowTransaction(
        tx?.data?.encodedSerializedSignedTx,
        "Acceptor"
      );

      if (executeSuccessfully) {
        // 5.2)
        // After all the funds are transferred successfully, accept the game with the
        // game details and acceptor details
        await acceptGameMutateAsync({
          acceptorId: user?.id,
          joiningCode: inviteCode,
        });
        setTransactionApproved(true);
        showMessage(tx.message);
        router.push("/my-games");
      }
      handleClose();
    } else {
      showMessage(tx.message, "error");
    }
  };

  // 2)
  // While signing we'll see if to call accept or create API
  const handleSign = async () => {
    if (type == "ACCEPT") {
      handleAcceptGame();
    } else {
      handleCreateGame();
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
          ≈ 149.53 USD
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
          <b>Sender address</b> : {user?.publicKey}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <b>Escrow id</b> : {escrowData?.vaultId}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="body2" fontWeight={"bold"}>
            Amount:{" "}
          </Typography>
          <Typography variant="body2">{betAmount} SOL</Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSign}
          disabled={isLoading || transactionApproved}
          sx={{ py: 1.5, mt: 4 }}
        >
          {isLoading ? <CircularProgress size={24} /> : "Sign Transaction"}
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

export default SignTransactionModal;
