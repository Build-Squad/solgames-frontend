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
import {
  useExecuteEscrow,
  useExecuteWithdrawalTransaction,
  useWithdrawalTransaction,
} from "@/hooks/api-hooks/useEscrow";
import {
  CreateAndDepositEscrowResponse,
  WithdrawalTypes,
} from "@/api-services/interfaces/escrowInterface";
import { VersionedTransaction } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnectUser } from "@/hooks/api-hooks/useUsers";
import { signTransactionWithSolanaWallet } from "@/utils/helper";

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
  betAmount?: string;
  createGame?: () => Promise<void>;
  inviteCode: string;
  // Need to change for accept and deposit as well
  escrowData?: CreateAndDepositEscrowResponse["data"];

  // For withdrawal transaction
  withDrawalType?: WithdrawalTypes;
  vaultId?: string;
  withdrawalAmount?: string;
}

const SignTransactionModal = ({
  open,
  handleClose,
  type = "ACCEPT",
  betAmount,
  createGame,
  inviteCode,
  escrowData,

  // For withdrawal transaction
  withDrawalType,
  vaultId,
  withdrawalAmount,
}: SignTransactionProps) => {
  // Component states
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [transactionApproved, setTransactionApproved] = useState(false);

  // Custom hooks
  const { withdrawalTransactionMutateAsync } = useWithdrawalTransaction();

  const { executeWithdrawalTransactionMutateAsync } =
    useExecuteWithdrawalTransaction();
  const { publicKey, signTransaction } = useWallet();
  const { showMessage } = useSnackbar();
  const { user, login: loginUser } = useAuth();
  const { acceptGameMutateAsync } = useAcceptGame();
  const { transfer } = useWeb3Auth();
  const { executeEscrowMutateAsync } = useExecuteEscrow();
  const { connectionMutateAsync } = useConnectUser();

  // 4)
  // After the funds are transferred, execute the transaction
  // and store the transaction details in the DB
  const executeEscrowTransaction = async (
    signedTransaction: string,
    userRole: "Creator" | "Acceptor"
  ) => {
    try {
      return await executeEscrowMutateAsync({
        signedTransaction: signedTransaction,
        transactionId: escrowData?.depositSerializedTransaction?.transactionId,
        vaultId: escrowData?.escrowDetails?.vaultId,
        inviteCode,
        userId: user?.id,
        userRole,
      });
    } catch (e) {
      showMessage("Error while execute escrow", "error");
      return null;
    }
  };

  // 3.1)
  // Transfer the funds by signing the transaction as a creator
  const handleCreateGame = async () => {
    setIsLoading(true);
    let tx;
    if (user?.verifier == "wallet") {
      tx = await signTransactionWithSolanaWallet(
        escrowData?.depositSerializedTransaction?.serializedTransaction,
        signTransaction,
        publicKey,
        showMessage
      );
    } else {
      tx = await transfer(
        escrowData?.depositSerializedTransaction?.serializedTransaction
      );
    }
    if (tx.success) {
      const res = await executeEscrowTransaction(
        tx?.data?.encodedSerializedSignedTx,
        "Creator"
      );

      if (res?.success) {
        createGame();
        setTransactionApproved(true);
        showMessage(res.message);
        handleClose();
      } else {
        showMessage(res?.message, "error");
      }
    } else {
      showMessage(tx.message, "error");
    }
    setIsLoading(false);
  };

  // 3.2)
  // Transfer the funds by signing the transaction as an acceptor
  const handleAcceptGame = async () => {
    setIsLoading(true);
    let tx;
    if (user?.verifier == "wallet") {
      tx = await signTransactionWithSolanaWallet(
        escrowData?.depositSerializedTransaction?.serializedTransaction,
        signTransaction,
        publicKey,
        showMessage
      );
    } else {
      tx = await transfer(
        escrowData?.depositSerializedTransaction?.serializedTransaction
      );
    }
    if (tx.success) {
      const res = await executeEscrowTransaction(
        tx?.data?.encodedSerializedSignedTx,
        "Acceptor"
      );

      if (res.success) {
        // 5.2)
        // After all the funds are transferred successfully, accept the game with the
        // game details and acceptor details
        await acceptGameMutateAsync({
          acceptorId: user?.id,
          joiningCode: inviteCode,
        });
        setTransactionApproved(true);
        showMessage(res.message);

        // Here we need to recall the login so as to update the user in the useAuth
        const connectedUser = await connectionMutateAsync({
          publicKey: user?.publicKey,
        });
        if (connectedUser?.data?.id) {
          loginUser(connectedUser.data);
        }

        router.push("/my-games");
        handleClose();
      } else {
        showMessage(res?.message, "error");
      }
    } else {
      showMessage(tx.message, "error");
    }
    setIsLoading(false);
  };

  const handleWithdrawalTransaction = async ({
    type,
  }: {
    type: WithdrawalTypes;
  }) => {
    if (!type) return;
    setIsLoading(true);
    try {
      const withdrawalTransaction = await withdrawalTransactionMutateAsync({
        inviteCode,
        publicKey: user?.publicKey,
        type,
      });
      if (withdrawalTransaction.success) {
        let tx;
        if (user?.verifier == "wallet") {
          tx = await signTransactionWithSolanaWallet(
            withdrawalTransaction?.data?.serializedTransaction,
            signTransaction,
            publicKey,
            showMessage
          );
        } else {
          tx = await transfer(
            withdrawalTransaction?.data?.serializedTransaction
          );
        }
        if (tx.success) {
          setTransactionApproved(true);
          handleClose();
          const res = await executeWithdrawalTransactionMutateAsync({
            inviteCode,
            publicKey: user?.publicKey,
            signedTransaction: tx.data.encodedSerializedSignedTx,
            transactionId: withdrawalTransaction?.data?.transactionId,
            type,
          });

          if (res.success) {
            showMessage(res.message, "success");
          } else {
            showMessage(res?.message, "error");
          }
        } else {
          showMessage(withdrawalTransaction.message, "error");
        }
      }
    } catch (e) {
      console.error(e);
      showMessage("Error initiating withdrawal transaction!", "error");
    }
    setIsLoading(false);
  };

  // 2)
  // While signing we'll see if to call accept create or withdrawal API
  const handleSign = async () => {
    if (type == "ACCEPT") {
      handleAcceptGame();
    } else if (type == "WITHDRAWAL") {
      if (withDrawalType) handleWithdrawalTransaction({ type: withDrawalType });
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
        {type == "WITHDRAWAL" ? (
          <>
            <Typography variant="body2">
              <b>Escrow address</b> : {vaultId}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <b>User address: </b> : {user?.publicKey}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2" fontWeight={"bold"}>
                Withdrawal amount:{" "}
              </Typography>
              <Typography variant="body2">{withdrawalAmount} SOL</Typography>
            </Box>
          </>
        ) : (
          <>
            <Typography variant="body2">
              <b>Sender address</b> : {user?.publicKey}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <b>Escrow id</b> : {escrowData?.escrowDetails?.vaultId}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2" fontWeight={"bold"}>
                Amount:{" "}
              </Typography>
              <Typography variant="body2">{betAmount} SOL</Typography>
            </Box>
          </>
        )}

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
