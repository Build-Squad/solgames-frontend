import { PublicKey } from "@solana/web3.js";
import { IProvider } from "@web3auth/base";
import { ReactNode } from "react";

export interface Web3AuthContextProps {
  provider: IProvider | null;
  loggedIn: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getUserInfo: () => Promise<any>;
  getAccounts: (provider: IProvider) => Promise<string[] | string>;
  getBalance: () => Promise<string>;
  transfer: ({
    recipientAddress,
    amountInSol,
  }: {
    recipientAddress: string;
    amountInSol: number;
  }) => Promise<{
    data: any;
    message: string;
    success: boolean;
  }>;
  isLoading: boolean;
  signMessage: () => Promise<{
    base64Signature?: string;
    message?: string;
  }>;
  verifySignature: (
    message: string,
    signature: string,
    publicKey: PublicKey
  ) => boolean;
}

export interface Web3AuthProviderProps {
  children: ReactNode;
}
