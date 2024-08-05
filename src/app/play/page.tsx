"use client";
import { Backdrop, Box, CircularProgress } from "@mui/material";
import React from "react";
import Chessboard from "@/components/playComponents/chessboard";
import { useGetGameWithInviteCode } from "@/hooks/api-hooks/useGames";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSnackbar } from "@/context/snackbarContext";
import { useAuth } from "@/context/authContext";
import { STATUS_COLORS } from "@/utils/constants";

type Props = {};

export default function Play({}: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const inviteCode = searchParams.get("inviteCode");

  const { data: gameData, isLoading } = useGetGameWithInviteCode(inviteCode);
  const { showMessage } = useSnackbar();

  if (!isLoading && !!gameData) {
    let hasError = false;
    if (!user?.id) {
      hasError = true;
      showMessage("Login to play the game", "error");
      setTimeout(() => {
        router.push("/");
      }, 3000);
    }
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
    if (gameData?.data?.gameStatus != STATUS_COLORS.InProgress.value) {
      hasError = true;
      showMessage("The game has not started or is finished", "error");
      setTimeout(() => {
        router.push("/my-games");
      }, 3000);
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
        <Chessboard />
      </Box>
    </Box>
  );
}
