import { WithdrawalTypes } from "@/api-services/interfaces/escrowInterface";
import { useAuth } from "@/context/authContext";
import { useSnackbar } from "@/context/snackbarContext";
import { useWeb3Auth } from "@/context/web3AuthProvider";
import {
  useExecuteWithdrawalTransaction,
  useGetEscrowDetails,
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
import { useState } from "react";
import SignTransactionModal from "../modals/SignTransactionModal";
import { User } from "@/types/user";

interface ClaimInterface {
  winnerId?: string;
  gameStatus: string;
  inviteCode: string;
  withdrawals?: {
    amount: string;
    id: string;
    transactionHash: string;
    transactionId: string;
    user: User;
  }[];
  refetch: any;
}

const ClaimsComponent = ({
  winnerId,
  gameStatus,
  inviteCode,
  withdrawals,
  refetch,
}: ClaimInterface) => {
  // Component states
  const [withdrawalType, setWithdrawalType] = useState<WithdrawalTypes>();
  const [showSignTransactionModal, setShowSignTransactionModal] =
    useState(false);

  // Custom hooks
  const { showMessage } = useSnackbar();
  const { user } = useAuth();
  const { data: escrowData } = useGetEscrowDetails(inviteCode);

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
      setShowSignTransactionModal(true);
      setWithdrawalType(type);
    }
  };

  const gameNotCompletedStatusArr = [
    STATUS_COLORS.Accepted.value,
    STATUS_COLORS.Scheduled.value,
    STATUS_COLORS.InProgress.value,
  ];

  const getWithdrawalAmount = () => {
    switch (withdrawalType) {
      case "WON":
        return escrowData?.data?.amount * 2;
      case "DRAW":
      case "EXPIRED":
        return escrowData?.data?.amount;
      default:
        return 0;
    }
  };

  const isDisabled = () => {
    return (
      withdrawals?.some((withdrawal) => withdrawal.user.id === user?.id) ??
      false
    );
  };

  const iconStyle = {
    cursor: isDisabled() ? "not-allowed" : "pointer",
    transition: "transform 0.2s ease, color 0.2s ease",
    borderRadius: "50%",
    padding: "4px",
    "&:hover": {
      transform: isDisabled() ? "none" : "scale(1.2)",
    },
  };

  return (
    <Box sx={{ mt: 1 }}>
      {/* The game has a winner */}
      {winnerId == user?.id && (
        <Tooltip
          title={
            isDisabled() ? "You've already claimed your funds!" : "Claim Funds"
          }
        >
          <MonetizationOn
            sx={{
              ...iconStyle,
              color: isDisabled() ? "#9E9E9E" : "#4CAF50",
              backgroundColor: "transparent",
              "&:hover": {
                ...iconStyle["&:hover"],
                color: isDisabled() ? "#9E9E9E" : "#388E3C",
              },
            }}
            onClick={(e) => {
              if (!isDisabled()) {
                handleOnClick(e, "WON");
              }
            }}
            fontSize="large"
          />
        </Tooltip>
      )}
      {/* The game has a winner but not the current user */}
      {winnerId && winnerId != user?.id && (
        <Tooltip title="You've lost the game.">
          <Cancel
            sx={{
              color: "#E53935",
              transition: "transform 0.2s ease, color 0.2s ease",
              "&:hover": {
                transform: "scale(1.2)",
                color: "#D32F2F",
              },
              fontSize: "28px",
            }}
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
            sx={{
              color: "#FFA000",
              transition: "transform 0.2s ease, color 0.2s ease",
              "&:hover": {
                transform: "scale(1.2)",
                color: "#FF8F00",
              },
              fontSize: "28px",
            }}
            onClick={(e) => {
              handleOnClick(e, "PENDING");
            }}
          />
        </Tooltip>
      )}
      {/* Game is expired due to no acceptor before the game starts.*/}
      {gameStatus === STATUS_COLORS.Expired.value && (
        <Tooltip
          title={
            isDisabled()
              ? "You've already claimed your refund!"
              : "Expired Game"
          }
        >
          <EventBusy
            sx={{
              ...iconStyle,
              color: isDisabled() ? "#9E9E9E" : "#E53935",
              backgroundColor: "transparent",
              "&:hover": {
                ...iconStyle["&:hover"],
                color: isDisabled() ? "#9E9E9E" : "#D32F2F",
              },
              fontSize: "28px",
            }}
            onClick={(e) => {
              if (!isDisabled()) {
                handleOnClick(e, "EXPIRED");
              }
            }}
          />
        </Tooltip>
      )}
      {/* Game is draw*/}
      {gameStatus === STATUS_COLORS.Draw.value && (
        <Tooltip
          title={
            isDisabled() ? "You've already claimed your funds!" : "Game Draw"
          }
        >
          <EmojiFlags
            sx={{
              ...iconStyle,
              color: isDisabled() ? "#9E9E9E" : "#42A5F5",
              backgroundColor: "transparent",
              "&:hover": {
                ...iconStyle["&:hover"],
                color: isDisabled() ? "#9E9E9E" : "#1E88E5",
              },
              fontSize: "28px",
            }}
            onClick={(e) => {
              if (!isDisabled()) {
                handleOnClick(e, "DRAW");
              }
            }}
          />
        </Tooltip>
      )}

      {showSignTransactionModal ? (
        <SignTransactionModal
          open={true}
          handleClose={() => {
            setTimeout(() => {
              refetch(user?.id);
            }, 8000);
            setShowSignTransactionModal(false);
          }}
          type={"WITHDRAWAL"}
          withDrawalType={withdrawalType}
          inviteCode={inviteCode}
          vaultId={escrowData?.data?.vaultId}
          withdrawalAmount={getWithdrawalAmount()}
        />
      ) : null}
    </Box>
  );
};

export default ClaimsComponent;
