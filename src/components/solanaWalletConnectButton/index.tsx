"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Menu,
  MenuItem,
  CircularProgress,
  Typography,
  Box,
} from "@mui/material";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import Image from "next/image";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

// Handle wallet balance fixed to 2 decimal numbers without rounding
export function toFixed(num: number, fixed: number): string {
  const re = new RegExp(`^-?\\d+(?:\\.\\d{0,${fixed || -1}})?`);
  return num.toString().match(re)![0];
}

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

const WalletConnection = () => {
  const { connection } = useConnection();
  const { select, wallets, publicKey, disconnect, connecting } = useWallet();

  const [userWalletAddress, setUserWalletAddress] = useState<string>("");
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [balance, setBalance] = useState<number | null>(null);

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
        setOpenDialog(false);
      } catch (error) {
        console.log("wallet connection err : ", error);
      }
    }
  };

  const handleDisconnect = async () => {
    disconnect();
    setAnchorEl(null);
  };

  const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ color: "white" }}>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: "20px",
            bgcolor: "#1a1a1a",
            padding: "20px",
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
          Select Wallet
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center", padding: "0 20px" }}>
          {wallets.map((wallet) => (
            <Button
              key={wallet.adapter.name}
              onClick={() => handleWalletSelect(wallet.adapter.name)}
              variant="outlined"
              sx={{
                my: 1,
                borderRadius: "15px",
                borderColor: "transparent",
                backgroundColor: "#333",
                color: "white",
                width: "100%",
                justifyContent: "center",
                padding: "12px",
                "&:hover": {
                  backgroundColor: "#444",
                },
              }}
            >
              <Image
                src={wallet.adapter.icon}
                alt={wallet.adapter.name}
                height={30}
                width={30}
                style={{ marginRight: 10 }}
              />
              {wallet.adapter.name}
              {wallet.adapter.readyState != "Installed" && (
                <Typography variant="body2" sx={{ ml: 3 }}>
                  <a
                    href={getInstallUrl(wallet.adapter.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "grey", textTransform: "none", textDecoration:"none" }}
                  >
                    Install {wallet.adapter.name}?
                  </a>
                </Typography>
              )}
            </Button>
          ))}
        </DialogContent>
      </Dialog>

      {!publicKey ? (
        <Button
          onClick={() => setOpenDialog(true)}
          variant="contained"
          sx={{
            bgcolor: "#333",
            color: "white",
            padding: "12px 20px",
            fontSize: "18px",
            borderRadius: "10px",
            "&:hover": {
              backgroundColor: "#444",
            },
          }}
        >
          {connecting ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Connect Wallet"
          )}
        </Button>
      ) : (
        <Box>
          <Button
            onClick={handleClickMenu}
            variant="contained"
            sx={{
              bgcolor: "#333",
              color: "white",
              display: "flex",
              alignItems: "center",
              padding: "12px 20px",
              fontSize: "18px",
              borderRadius: "10px",
              "&:hover": {
                backgroundColor: "#444",
              },
            }}
          >
            <Typography
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "150px",
                whiteSpace: "nowrap",
                mr: 2,
              }}
            >
              {publicKey?.toBase58()}
            </Typography>
            <ChevronRightIcon />
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            PaperProps={{
              sx: {
                bgcolor: "#1a1a1a",
                color: "white",
                borderRadius: "10px",
                padding: "10px",
                "& .MuiMenuItem-root": {
                  borderRadius: "8px",
                  "&:hover": {
                    bgcolor: "#333",
                  },
                },
              },
            }}
          >
            <MenuItem>
              {balance ? `${toFixed(balance, 2)} SOL` : "0 SOL"}
            </MenuItem>
            <MenuItem onClick={handleDisconnect} sx={{ color: "#ff5555" }}>
              Disconnect
            </MenuItem>
          </Menu>
        </Box>
      )}
    </Box>
  );
};

export default WalletConnection;
