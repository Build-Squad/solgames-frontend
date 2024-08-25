import { PublicKey } from "@solana/web3.js";

// Escrow related interfaces

// Create escrow
export interface CreateEscrowRequest {
  amount: number;
  publicKey: PublicKey;
  userId: string;
  inviteCode: string;
}

export interface CreateEscrowResponse {
  success: boolean;
  data: {
    transactionId: string;
    vaultId: string;
    serializedTransaction: string;
    expiresIn: string;
    asset: Asset;
  };
  message: string;
}
interface Asset {
  token: string;
  amount: number;
  decimals: number;
  symbol: string;
  name: string;
  logoUri: string;
}

// Execute escrow

export interface ExecuteEscrowRequest {
  vaultId: string;
  signedTransaction: string;
  transactionId: string;
  inviteCode: string;
  userId: string;
  userRole: "Creator" | "Acceptor";
}

export interface ExecuteEscrowResponse {
  data: {
    tx_hash: string;
  };
  success: boolean;
  message: string;
}
