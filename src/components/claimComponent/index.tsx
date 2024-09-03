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

const ClaimsComponent = ({
  winnerId,
  gameStatus,
  inviteCode,
}: {
  winnerId?: string;
  gameStatus: string;
  inviteCode: string;
}) => {
  const [withdrawalType, setWithdrawalType] = useState<WithdrawalTypes>();
  const [showSignTransactionModal, setShowSignTransactionModal] =
    useState(false);

  const { showMessage } = useSnackbar();
  const { user } = useAuth();
  const { data: escrowData } = useGetEscrowDetails(inviteCode);
  console.log(escrowData);
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

  return (
    <Box sx={{ mt: 1 }}>
      {/* The game has a winner */}
      {winnerId == user?.id && (
        <Tooltip title="Claim Funds">
          <MonetizationOn
            sx={{
              cursor: "pointer",
              color: "#4CAF50",
              transition: "transform 0.2s ease, color 0.2s ease",
              "&:hover": {
                transform: "scale(1.2)",
                color: "#388E3C", // Darker Green on hover
              },
            }}
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
            sx={{
              color: "#E53935",
              transition: "transform 0.2s ease, color 0.2s ease",
              "&:hover": {
                transform: "scale(1.2)",
                color: "#D32F2F", // Darker Red on hover
              },
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
                color: "#FF8F00", // Darker Orange on hover
              },
            }}
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
            sx={{
              color: "#E53935",
              transition: "transform 0.2s ease, color 0.2s ease",
              "&:hover": {
                transform: "scale(1.2)",
                color: "#D32F2F", // Darker Red on hover
              },
            }}
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
            sx={{
              color: "#42A5F5",
              transition: "transform 0.2s ease, color 0.2s ease",
              "&:hover": {
                transform: "scale(1.2)",
                color: "#1E88E5", // Darker Blue on hover
              },
            }}
            onClick={(e) => {
              handleOnClick(e, "DRAW");
            }}
          />
        </Tooltip>
      )}

      {showSignTransactionModal ? (
        <SignTransactionModal
          open={true}
          handleClose={() => {
            setShowSignTransactionModal(false);
          }}
          type={"WITHDRAWAL"}
          withDrawalType={withdrawalType}
          inviteCode={inviteCode}
          vaultId={escrowData?.data?.vaultId}
          withdrawalAmount={escrowData?.data?.amount}
        />
      ) : null}
    </Box>
  );
};

export default ClaimsComponent;
