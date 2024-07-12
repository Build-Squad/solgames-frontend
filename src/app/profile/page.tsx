"use client";
import { useWeb3Auth } from "@/context/web3AuthProvider";
import { AccountBalanceWallet } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Typography,
  Avatar,
  Grid,
} from "@mui/material";
import React, { useEffect, useState } from "react";

type Props = {};

export default function Profile({}: Props) {
  const { loggedIn, login, logout, getUserInfo, getAccounts, getBalance } =
    useWeb3Auth();
  const [userInfo, setUserInfo] = useState(null);
  const [accounts, setAccounts] = useState<string[] | string>([]);
  const [balance, setBalance] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (loggedIn) {
        const user = await getUserInfo();
        setUserInfo(user);

        const accounts = await getAccounts();
        setAccounts(accounts);

        const balance = await getBalance();
        setBalance(balance);
      }
      setLoading(false);
    };

    fetchUserData();
  }, [loggedIn, getUserInfo, getAccounts, getBalance]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        height: "100%",
        color: "white",
        alignItems: "center",
        position: "relative",
        zIndex: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card>
          <CardHeader
            avatar={
              userInfo ? (
                <Avatar
                  alt={userInfo.name}
                  src={userInfo.picture}
                  sx={{ width: 56, height: 56 }}
                />
              ) : (
                <Avatar sx={{ width: 56, height: 56 }}>
                  <AccountBalanceWallet />
                </Avatar>
              )
            }
            title={userInfo ? userInfo.name : "User"}
            subheader={userInfo ? userInfo.email : "No Email"}
          />
          <CardContent>
            {loggedIn ? (
              <>
                <Box my={2}>
                  <Typography variant="h6">Accounts</Typography>
                  <Grid container spacing={1}>
                    {Array.isArray(accounts) ? (
                      accounts.map((account, index) => (
                        <Grid item xs={12} key={index}>
                          <Typography variant="body1">{account}</Typography>
                        </Grid>
                      ))
                    ) : (
                      <Typography variant="body1">{accounts}</Typography>
                    )}
                  </Grid>
                </Box>
                <Box my={2}>
                  <Typography variant="h6">Balance</Typography>
                  <Typography variant="body1">{balance} SOL</Typography>
                </Box>
                <Box mt={4} display="flex" justifyContent="center">
                  <Button variant="contained" color="primary" onClick={logout}>
                    Logout
                  </Button>
                </Box>
              </>
            ) : (
              <Box mt={4} display="flex" justifyContent="center">
                <Button variant="contained" color="primary" onClick={login}>
                  Login
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
