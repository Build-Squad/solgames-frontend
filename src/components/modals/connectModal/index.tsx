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
  Divider,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Image from "next/image";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWeb3Auth } from "@/context/web3AuthProvider";
import { HelpOutline } from "@mui/icons-material";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

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

const CryptoInfoModal: FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const [expanded, setExpanded] = useState<string | false>(false);
  const [userWalletAddress, setUserWalletAddress] = useState<string>("");
  const [balance, setBalance] = useState<number | null>(null);

  const { connection } = useConnection();
  const { select, wallets, publicKey, disconnect, connecting } = useWallet();

  const { login } = useWeb3Auth();

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  useEffect(() => {
    if (!connection || !publicKey) return;

    connection.onAccountChange(
      publicKey,
      (updatedAccountInfo) => {
        setBalance(updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
      },
      "confirmed"
    );

    connection.getAccountInfo(publicKey).then((info) => {
      if (info) {
        setBalance(info.lamports / LAMPORTS_PER_SOL);
      }
    });
  }, [publicKey, connection]);

  useEffect(() => {
    setUserWalletAddress(publicKey?.toBase58()!);
  }, [publicKey]);

  const handleWalletSelect = async (walletName: any) => {
    if (walletName) {
      try {
        select(walletName);
      } catch (error) {
        console.log("wallet connection err : ", error);
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "20px",
          bgcolor: "#1a1a1a",
          padding: "20px",
          width: "90%",
          maxWidth: "600px",
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          color: "white",
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
            sx={{ bgcolor: "#333", borderRadius: "10px", mb: 2 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
              sx={{ bgcolor: "#444", borderRadius: "10px", color: "white" }}
            >
              <Typography>Sign in with your email or socials.</Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                bgcolor: "#333",
                borderRadius: "10px",
                color: "white",
                textAlign: "center",
                padding: "20px",
              }}
            >
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#007bff",
                  color: "white",
                  "&:hover": {
                    bgcolor: "#0056b3",
                  },
                }}
                onClick={login}
              >
                Connect with Social Media
              </Button>
            </AccordionDetails>
          </Accordion>
          <Typography sx={{ textAlign: "center", color: "white" }}>
            OR
          </Typography>
          <Divider
            sx={{ my: 3, borderColor: "white", borderStyle: "dashed" }}
          />

          <Accordion
            expanded={expanded === "existingWallet"}
            onChange={handleAccordionChange("existingWallet")}
            sx={{ bgcolor: "#333", borderRadius: "10px" }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
              sx={{ bgcolor: "#444", borderRadius: "10px", color: "white" }}
            >
              <Typography>
                If you&apos;re a pro, connect your wallet?
              </Typography>
            </AccordionSummary>
            <AccordionDetails
              sx={{
                bgcolor: "#333",
                borderRadius: "10px",
                color: "white",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 2,
                padding: 2,
              }}
            >
              {wallets.map((wallet) => (
                <Button
                  disabled={wallet.adapter.readyState !== "Installed"}
                  key={wallet.adapter.name}
                  onClick={() => handleWalletSelect(wallet.adapter.name)}
                  variant="outlined"
                  sx={{
                    position: "relative",
                    borderRadius: "100%",
                    width: "40px",
                    height: "60px",
                    borderColor: "transparent",
                    backgroundColor: "#444",
                    color: "white",
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                    "&:hover": {
                      backgroundColor: "#555",
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
                    <Tooltip title="This wallet is not installed on your browser">
                      <a
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                        }}
                        href={getInstallUrl(wallet.adapter.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <HelpOutline
                          sx={{ fontSize: "20px", color: "white" }}
                        />
                      </a>
                    </Tooltip>
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

export default CryptoInfoModal;
