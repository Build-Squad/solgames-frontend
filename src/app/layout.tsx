"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "../components/navbar/navbar";
import "./globals.css";
import { SocketProvider } from "@/context/socketContext";
import { Web3AuthProvider } from "@/context/web3AuthProvider";
import { SnackbarProvider } from "@/context/snackbarContext";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/lib/queryClient";
import { AuthProvider } from "@/context/authContext";
import { LoaderProvider } from "@/context/loaderContext";
import GameNotificationComponent from "@/components/gameNotiSnackbar";

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
                <Web3AuthProvider>
                  <SocketProvider>
                    <Navbar />
                    {children}
                    <GameNotificationComponent />
                  </SocketProvider>
                </Web3AuthProvider>
              </SnackbarProvider>
            </AuthProvider>
          </QueryClientProvider>
        </LoaderProvider>
      </body>
    </html>
  );
}
