import { PublicKey } from "@solana/web3.js";

// Escrow related interfaces
export interface CreateEscrowRequest {
  amount: number;
  publicKey: PublicKey;
  userId: string;
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
