"use client";
import ConnectModal from "@/components/modals/connectModal";
import SignTransactionModal from "@/components/modals/SignTransactionModal";
import NoDataFound from "@/components/noDataFound";
import { useAuth } from "@/context/authContext";
import { useLoader } from "@/context/loaderContext";
import { useSnackbar } from "@/context/snackbarContext";
import { useWeb3Auth } from "@/context/web3AuthProvider";
import { useDepositAcceptTransaction } from "@/hooks/api-hooks/useEscrow";
import { useGetGameWithInviteCode } from "@/hooks/api-hooks/useGames";
import { STATUS_COLORS } from "@/utils/constants";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {};

export default function JoinGame({}: Props) {
  // Next hooks
  const router = useRouter();
  const searchParams = useSearchParams();
  const joiningCode = searchParams.get("joiningCode");

  // Component states
  const [openConnectModal, setOpenConnectModal] = useState(false);

  // custom context hooks
  const { user } = useAuth();
  const { showMessage } = useSnackbar();
  const { showLoader, hideLoader } = useLoader();

  const { data: gameData, refetch: refetchGameData } =
    useGetGameWithInviteCode(joiningCode);

  const {
    depositAcceptGameResponse,
    depositAcceptGameMutateAsync,
    isDepositAcceptGameLoading,
  } = useDepositAcceptTransaction();

  useEffect(() => {
    if (isDepositAcceptGameLoading) {
      showLoader();
    } else {
      hideLoader();
    }
  }, [isDepositAcceptGameLoading]);

  useEffect(() => {
    if (!user?.id) {
      setOpenConnectModal(true);
    } else {
      setOpenConnectModal(false);
    }
  }, [user]);

  useEffect(() => {
    if (
      gameData?.data &&
      (gameData.data.gameStatus !== STATUS_COLORS.Scheduled.value ||
        gameData.data.isGameAccepted)
    ) {
      showMessage(
        "The game is completed or another player has already joined the game!",
        "error"
      );
      setTimeout(() => {
        router.back();
      }, 3000);
    } else if (!user?.id) {
    } else {
      initializeAcceptGame();
    }
  }, [gameData, user?.id]);

  const initializeAcceptGame = async () => {
    try {
      const res = await depositAcceptGameMutateAsync({
        publicKey: user?.publicKey,
        inviteCode: joiningCode,
      });
      if (!res.success) {
        showMessage(res.message, "error");
      }
    } catch (e) {
      showMessage("Something went wrong!", "error");
    }
  };

  if (!gameData?.success) {
    return <NoDataFound onRetry={refetchGameData} />;
  }

  if (!joiningCode) {
    return <NoDataFound message="No joining code found!" />;
  }

  return (
    <>
      {user?.id && !openConnectModal ? (
        <SignTransactionModal
          open={true}
          handleClose={() => {}}
          type={"ACCEPT"}
          betAmount={gameData.data.betAmount}
          inviteCode={joiningCode}
          escrowData={depositAcceptGameResponse?.data}
        />
      ) : null}
      <ConnectModal
        open={openConnectModal}
        onClose={() => {
          setOpenConnectModal(false);
        }}
      />
    </>
  );
}
