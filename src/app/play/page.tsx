"use client";
import { Backdrop, Box, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import Chessboard from "@/components/playComponents/chessboard";
import { useGetGameWithInviteCode } from "@/hooks/api-hooks/useGames";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSnackbar } from "@/context/snackbarContext";
import { useAuth } from "@/context/authContext";
import { STATUS_COLORS } from "@/utils/constants";
import { useSocket } from "@/context/socketContext";
import GameInstructionModal from "@/components/modals/gameInstructionModal";

type Props = {};

export default function Play({}: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { socket } = useSocket();
  const [isInstructionModalOpen, setIsInstructionModalOpen] = useState(true);
  const [isStale, setIsStale] = useState(true);

  const handleCloseModal = () => setIsInstructionModalOpen(false);

  const inviteCode = searchParams.get("inviteCode");

  const {
    data: gameData,
    isLoading,
    isFetching,
  } = useGetGameWithInviteCode(inviteCode);
  const { showMessage } = useSnackbar();

  // Wait for fresh data if it's still fetching
  useEffect(() => {
    if (gameData?.data && !isFetching) {
      setIsStale(false);
    }
  }, [gameData, isFetching]);

  useEffect(() => {
    if (
      socket &&
      gameData?.success &&
      gameData?.data?.gameStatus == STATUS_COLORS.InProgress.value &&
      !isInstructionModalOpen &&
      !isStale
    ) {
      socket.emit("joinGame", { userId: user?.id, gameCode: inviteCode });
    }
  }, [user, inviteCode, gameData, socket, isInstructionModalOpen]);

  if (!isLoading && !!gameData && !isStale) {
    let hasError = false;

    // The user is not logged in and tried to visit the join game page.
    if (!user?.id) {
      hasError = true;
      showMessage("Login to play the game", "error");
      setTimeout(() => {
        router.push("/");
      }, 3000);
    }

    // Any random user is trying to access the game.
    if (
      !(
        gameData?.data?.creatorId == user?.id ||
        gameData?.data?.acceptorId == user?.id
      )
    ) {
      hasError = true;
      showMessage("This game does not belong to you", "error");
      setTimeout(() => {
        router.push("/my-games");
      }, 3000);
    }

    // Game has not started yet as the status is not inProgress
    if (gameData?.data?.gameStatus != STATUS_COLORS.InProgress.value) {
      hasError = true;
      showMessage("The game has not started or is finished", "error");
      setTimeout(() => {
        router.push("/my-games");
      }, 2000);
    }
    if (hasError) {
      return (
        <>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </>
      );
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          height: "fit-content",
          width: "100%",
        }}
      >
        {isInstructionModalOpen ? (
          <GameInstructionModal
            open={isInstructionModalOpen}
            onClose={handleCloseModal}
            creatorPubKey={gameData?.data?.creator?.publicKey}
            acceptorPubKey={gameData?.data?.acceptor?.publicKey}
          />
        ) : (
          <Chessboard
            creator={gameData?.data?.creator}
            acceptor={gameData?.data?.acceptor}
          />
        )}
      </Box>
    </Box>
  );
}
