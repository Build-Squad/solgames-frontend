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
  createdEscrowData: CreateEscrowResponse["data"];
}

const SignTransactionModal = ({
  open,
  handleClose,
  type = "ACCEPT",
  betAmount,
  createGame,
  inviteCode,
  createdEscrowData,
}: SignTransactionProps) => {
  const router = useRouter();
  const [transactionApproved, setTransactionApproved] = useState(false);
  const { showMessage } = useSnackbar();
  const { user } = useAuth();
  const { acceptGameMutateAsync } = useAcceptGame();
  const { transfer, isLoading } = useWeb3Auth();
  const { isExecuteEscrowLoading, executeEscrowMutateAsync } =
    useExecuteEscrow();

  // const handleAcceptGame = async () => {
  //   try {
  //     const tx = await transfer({
  //       recipientAddress: escrowAccount,
  //       amountInSol: parseInt(betAmount),
  //     });

  //     if (tx.success) {
  //       await acceptGameMutateAsync({
  //         acceptorId: user?.id,
  //         joiningCode,
  //       });
  //       setTransactionApproved(true);
  //       showMessage("Accepted Successfully!");
  //       setTimeout(() => {
  //         router.push("/my-games");
  //         handleClose();
  //       }, 3000);
  //     } else {
  //       showMessage("Transaction Failed!", "error");
  //     }
  //   } catch (err) {
  //     showMessage(err, "error");
  //   }
  // };

  const executeEscrowTransaction = async (signedTransaction) => {
    try {
      const exeRes = await executeEscrowMutateAsync({
        signedTransaction: signedTransaction,
        transactionId: createdEscrowData?.transactionId,
        vaultId: createdEscrowData?.vaultId,
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

  const handleCreateGame = async () => {
    const tx = await transfer(createdEscrowData?.serializedTransaction);
    if (tx.success) {
      const executeSuccessfully = await executeEscrowTransaction(
        tx?.data?.encodedSerializedSignedTx
      );

      if (executeSuccessfully) {
        setTransactionApproved(true);
        showMessage(tx.message);
      }

      createGame();
      handleClose();
    } else {
      showMessage(tx.message, "error");
    }
  };
  const handleAcceptGame = () => {};

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
          <b>Escrow id</b> : {createdEscrowData?.vaultId}
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
