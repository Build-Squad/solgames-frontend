"use client";

import React, { useState, FC, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Image from "next/image";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWeb3Auth } from "@/context/web3AuthProvider";
import { HelpOutline } from "@mui/icons-material";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useLoader } from "@/context/loaderContext";
import { useAuth } from "@/context/authContext";
import { useSnackbar } from "@/context/snackbarContext";
import { useConnectUser } from "@/hooks/api-hooks/useUsers";

export const getInstallUrl = (walletName: string): string => {
  switch (walletName) {
    case "Phantom":
      return "https://phantom.app/";
    case "Solflare":
      return "https://solflare.com/";
    case "MathWallet":
      return "https://mathwallet.org/";
    case "TrustWallet":
      return "https://trustwallet.com/";
    case "Coinbase Wallet":
      return "https://www.coinbase.com/wallet";
    default:
      return "#";
  }
};

const ConnectModal: FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  // States
  const [expanded, setExpanded] = useState<string | false>(false);
  const [selectedWallet, setSelectedWallet] = useState<string>("");

  // Webhooks and contexts
  const { select, wallets, publicKey, disconnect } = useWallet();
  const { showMessage } = useSnackbar();
  const { connectionMutateAsync } = useConnectUser();
  const { login } = useWeb3Auth();
  const { login: loginUser, logout: logoutUser } = useAuth();

  const createUser = async () => {
    try {
      const userInfo = {
        typeOfLogin: selectedWallet,
        verifier: "wallet",
        publicKey: publicKey.toString(),
      };
      const res = await connectionMutateAsync({ ...userInfo, publicKey });
      loginUser(res.data);
      showMessage(res.message, "success");
      onClose();
    } catch (e) {
      console.log(e);
      disconnect();
      logoutUser();
      showMessage("Error connecting!", "error");
    }
  };

  useEffect(() => {
    if (publicKey && typeof publicKey === "object" && publicKey.toString()) {
      createUser();
    }
  }, [publicKey]);

  const handleWalletSelect = async (walletName: any) => {
    if (walletName) {
      try {
        setSelectedWallet(walletName);
        select(walletName);
      } catch (error) {
        console.log("wallet connection err : ", error);
      }
    }
  };

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "20px",
          bgcolor: "rgba(30, 30, 30, 0.9)",
          backdropFilter: "blur(10px)",
          padding: "20px",
          width: "90%",
          maxWidth: "600px",
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          color: "#e0e0e0",
          paddingBottom: "10px",
          fontSize: "1.5rem",
        }}
      >
        Connect with Chessmate
      </DialogTitle>
      <DialogContent>
        <Box>
          <Accordion
            expanded={expanded === "newCrypto"}
            onChange={handleAccordionChange("newCrypto")}
            sx={{
              bgcolor: "rgba(50, 50, 50, 0.7)",
              borderRadius: "10px",
              mb: 2,
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "#e0e0e0" }} />}
              sx={{
                bgcolor: "rgba(40, 40, 40, 0.8)",
                borderRadius: "10px",
                color: "#e0e0e0",
              }}
            >
              <Typography>Sign in with your email or socials.</Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                bgcolor: "rgba(50, 50, 50, 0.6)", // more transparency
                borderRadius: "10px",
                color: "#e0e0e0",
                textAlign: "center",
                padding: "20px",
              }}
            >
              <Button
                variant="contained"
                sx={{
                  bgcolor: "rgba(70, 70, 70, 0.8)", // muted dark
                  color: "#e0e0e0",
                  "&:hover": {
                    bgcolor: "rgba(90, 90, 90, 0.9)",
                  },
                }}
                onClick={() => {
                  onClose();
                  login();
                }}
              >
                Connect with Social Media
              </Button>
            </AccordionDetails>
          </Accordion>
          <Typography sx={{ textAlign: "center", color: "#e0e0e0" }}>
            OR
          </Typography>

          <Accordion
            expanded={expanded === "existingWallet"}
            onChange={handleAccordionChange("existingWallet")}
            sx={{
              bgcolor: "rgba(50, 50, 50, 0.7)",
              borderRadius: "10px",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
              mt: 2,
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "#e0e0e0" }} />}
              sx={{
                bgcolor: "rgba(40, 40, 40, 0.8)",
                borderRadius: "10px",
                color: "#e0e0e0",
              }}
            >
              <Typography>
                If you&apos;re a pro, connect your wallet?
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                bgcolor: "rgba(50, 50, 50, 0.6)",
                borderRadius: "10px",
                color: "#e0e0e0",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 2,
                padding: 2,
              }}
            >
              {wallets.map((wallet) => (
                <Button
                  key={wallet.adapter.name}
                  disabled={wallet.adapter.readyState !== "Installed"}
                  onClick={() => handleWalletSelect(wallet.adapter.name)}
                  variant="outlined"
                  sx={{
                    position: "relative",
                    borderRadius: "12px",
                    width: "60px",
                    height: "60px",
                    borderColor: "rgba(100, 100, 100, 0.4)",
                    backgroundColor: "rgba(60, 60, 60, 0.7)",
                    color: "#e0e0e0",
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                    "&:hover": {
                      backgroundColor: "rgba(70, 70, 70, 0.8)",
                      border: "none",
                    },
                  }}
                >
                  <Image
                    src={wallet.adapter.icon}
                    alt={wallet.adapter.name}
                    height={30}
                    width={30}
                  />
                  {wallet.adapter.readyState !== "Installed" && (
                    <a
                      style={{
                        position: "absolute",
                        top: -5,
                        right: -5,
                      }}
                      href={getInstallUrl(wallet.adapter.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <HelpOutline
                        sx={{ fontSize: "20px", color: "#e0e0e0" }}
                      />
                    </a>
                  )}
                </Button>
              ))}
            </AccordionDetails>
          </Accordion>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectModal;
