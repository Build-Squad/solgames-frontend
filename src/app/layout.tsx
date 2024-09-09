"use client";
import { Inter } from "next/font/google";
import Navbar from "../components/navbar/navbar";
import "./globals.css";
import { Web3AuthProvider } from "@/context/web3AuthProvider";
import { SnackbarProvider } from "@/context/snackbarContext";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/lib/queryClient";
import { AuthProvider } from "@/context/authContext";
import { LoaderProvider } from "@/context/loaderContext";
import GameStartNotificationComponent from "@/components/gameStartNotifComp";
import JoinGameNotificationComponent from "@/components/joinGameNotifComp";
import SolanaWalletContextProvider from "@/context/solanaWalletContextProvider";
import RouteGuard from "@/context/routeGuard";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LoaderProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <SnackbarProvider>
                <SolanaWalletContextProvider>
                  <Web3AuthProvider>
                    <RouteGuard>
                      <Navbar />
                      {children}
                      <GameStartNotificationComponent />
                      <JoinGameNotificationComponent />
                    </RouteGuard>
                  </Web3AuthProvider>
                </SolanaWalletContextProvider>
              </SnackbarProvider>
            </AuthProvider>
          </QueryClientProvider>
        </LoaderProvider>
      </body>
    </html>
  );
}
