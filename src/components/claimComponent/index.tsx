import { WithdrawalTypes } from "@/api-services/interfaces/escrowInterface";
import { useAuth } from "@/context/authContext";
import { useSnackbar } from "@/context/snackbarContext";
import { useWeb3Auth } from "@/context/web3AuthProvider";
import {
  useExecuteWithdrawalTransaction,
  useWithdrawalTransaction,
} from "@/hooks/api-hooks/useEscrow";
import { CLAIM_ALERTS, STATUS_COLORS } from "@/utils/constants";
import { signTransactionWithSolanaWallet } from "@/utils/helper";
import {
  Cancel,
  EmojiFlags,
  EventBusy,
  HourglassEmpty,
  MonetizationOn,
} from "@mui/icons-material";
import { Box, Tooltip } from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";

const ClaimsComponent = ({
  winnerId,
  gameStatus,
  inviteCode,
}: {
  winnerId?: string;
  gameStatus: string;
  inviteCode: string;
}) => {
  const {
    isWithdrawalTransactionLoading,
    withdrawalTransactionResponse,
    withdrawalTransactionMutateAsync,
  } = useWithdrawalTransaction();

  const {
    isExecuteWithdrawalTransactionLoading,
    executeWithdrawalTransactionResponse,
    executeWithdrawalTransactionMutateAsync,
  } = useExecuteWithdrawalTransaction();
  const { showMessage } = useSnackbar();
  const { user } = useAuth();

  const { publicKey, signTransaction } = useWallet();
  const { transfer } = useWeb3Auth();

  const handleTransaction = async ({ type }: { type: WithdrawalTypes }) => {
    try {
      const withdrawalTransaction = await withdrawalTransactionMutateAsync({
        inviteCode,
        publicKey: user?.publicKey,
        type,
      });
      if (withdrawalTransaction.success) {
        let tx;
        console.log(user?.verifier);
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
  };

  const handleOnClick = async (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    type: "WON" | "LOST" | "PENDING" | "EXPIRED" | "DRAW"
  ) => {
    e.stopPropagation();

    // Handle notifications with no withdrawl
    if (type == "LOST") {
      showMessage(CLAIM_ALERTS.LOST, "info");
    }
    if (type == "PENDING") {
      showMessage(CLAIM_ALERTS.PENDING, "info");
    }

    // Handle withdrawls
    if (type == "WON" || type == "EXPIRED" || type == "DRAW") {
      await handleTransaction({ type });
    }
  };

  const gameNotCompletedStatusArr = [
    STATUS_COLORS.Accepted.value,
    STATUS_COLORS.Scheduled.value,
    STATUS_COLORS.InProgress.value,
  ];

  return (
    <Box sx={{ mt: 1 }}>
      {/* The game has a winner */}
      {winnerId == user?.id && (
        <Tooltip title="Claim Funds">
          <MonetizationOn
            sx={{ cursor: "pointer", color: "#4CAF50" }}
            onClick={(e) => {
              handleOnClick(e, "WON");
            }}
          />
        </Tooltip>
      )}
      {/* The game has a winner but not the current user */}
      {winnerId && winnerId != user?.id && (
        <Tooltip title="You've lost the game.">
          <Cancel
            sx={{ color: "#E53935" }} // Bright Red for Lost Game
            onClick={(e) => {
              handleOnClick(e, "LOST");
            }}
          />
        </Tooltip>
      )}
      {/* The game is pending */}
      {gameNotCompletedStatusArr.includes(gameStatus) && (
        <Tooltip title="Decision Pending">
          <HourglassEmpty
            sx={{ color: "#FFA000" }}
            onClick={(e) => {
              handleOnClick(e, "PENDING");
            }}
          />
        </Tooltip>
      )}
      {/* Game is expired due to no acceptor before the game starts.*/}
      {gameStatus === STATUS_COLORS.Expired.value && (
        <Tooltip title="Expired Game">
          <EventBusy
            sx={{ color: "#E53935" }}
            onClick={(e) => {
              handleOnClick(e, "EXPIRED");
            }}
          />
        </Tooltip>
      )}
      {/* Game is draw*/}
      {gameStatus === STATUS_COLORS.Draw.value && (
        <Tooltip title="Game Draw">
          <EmojiFlags
            sx={{ color: "#42A5F5" }}
            onClick={(e) => {
              handleOnClick(e, "DRAW");
            }}
          />
        </Tooltip>
      )}
    </Box>
  );
};

export default ClaimsComponent;
