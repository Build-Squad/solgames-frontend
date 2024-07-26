"use client";
import { Backdrop, Box, CircularProgress } from "@mui/material";
import React from "react";
import Chessboard from "@/components/playComponents/chessboard";
import { useGetGameWithInviteCode } from "@/hooks/api-hooks/useGames";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSnackbar } from "@/context/snackbarContext";

type Props = {};

export default function Play({}: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const inviteCode = searchParams.get("inviteCode");

  const { data: gameData } = useGetGameWithInviteCode(inviteCode);
  const { showMessage } = useSnackbar();

  if (gameData && !gameData?.success) {
    showMessage(gameData.message, "error", 3000);
    setTimeout(() => {
      router.back();
    }, 3000);
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
