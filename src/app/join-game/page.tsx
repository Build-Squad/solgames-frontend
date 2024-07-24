"use client";
import DummySignTransaction from "@/components/modals/dummySignTransaction";
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
  const [isTransactionSigned, setIsTransactionSigned] = useState(false);

  const { user } = useAuth();
  const { login, signMessage } = useWeb3Auth();
  const { showMessage } = useSnackbar();

  const { data: gameData, refetch: refetchGameData } =
    useGetGameWithInviteCode(joiningCode);

  useEffect(() => {
    if (user?.id) {
      signMessage("Signing a random message");
    }
  }, [user?.id]);

  useEffect(() => {
    if (isTransactionSigned) {
      setTimeout(() => {
        router.push("/my-games");
      }, 3000);
    }
  }, [isTransactionSigned]);

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
      router.back();
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
    <DummySignTransaction
      open={true}
      handleClose={() => {}}
      setIsTransactionSigned={setIsTransactionSigned}
      joiningCode={joiningCode}
    />
  );
}
