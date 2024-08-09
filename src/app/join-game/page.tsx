"use client";
import SignTransactionModal from "@/components/modals/SignTransactionModal";
import NoDataFound from "@/components/noDataFound";
import { useAuth } from "@/context/authContext";
import { useSnackbar } from "@/context/snackbarContext";
import { useWeb3Auth } from "@/context/web3AuthProvider";
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
      }, 5000);
    }
  }, [gameData]);

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
      joiningCode={joiningCode}
      betAmount={gameData.data.betAmount}
    />
  );
}
