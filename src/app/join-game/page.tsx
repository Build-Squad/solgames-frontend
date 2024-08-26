"use client";
import SignTransactionModal from "@/components/modals/SignTransactionModal";
import NoDataFound from "@/components/noDataFound";
import { useAuth } from "@/context/authContext";
import { useSnackbar } from "@/context/snackbarContext";
import { useWeb3Auth } from "@/context/web3AuthProvider";
import { useAcceptAndInitializeEscrow } from "@/hooks/api-hooks/useEscrow";
import { useGetGameWithInviteCode } from "@/hooks/api-hooks/useGames";
import { STATUS_COLORS } from "@/utils/constants";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {};

export default function JoinGame({}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const joiningCode = searchParams.get("joiningCode");

  const { user } = useAuth();
  const { login } = useWeb3Auth();
  const { showMessage } = useSnackbar();

  const { data: gameData, refetch: refetchGameData } =
    useGetGameWithInviteCode(joiningCode);

  const { acceptEscrowMutateAsync, acceptEscrowResponse } =
    useAcceptAndInitializeEscrow();

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
    } else {
      initializeAcceptGame();
    }
  }, [gameData, user?.id]);

  const initializeAcceptGame = async () => {
    try {
      const res = await acceptEscrowMutateAsync({
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

  if (!user?.id) {
    login();
    return null;
  }

  return (
    <SignTransactionModal
      open={true}
      handleClose={() => {}}
      type={"ACCEPT"}
      betAmount={gameData.data.betAmount}
      inviteCode={joiningCode}
      escrowData={acceptEscrowResponse?.data}
    />
  );
}
