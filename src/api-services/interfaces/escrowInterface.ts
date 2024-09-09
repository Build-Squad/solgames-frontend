import { PublicKey } from "@solana/web3.js";

// Escrow related interfaces

// Create escrow

export interface CreateAndDepositEscrowRequest {
  amount: number;
  inviteCode: string;
  publicKey: string;
}

export interface CreateAndDepositEscrowResponse {
  success: boolean;
  data: {
    escrowDetails: EscrowDetails;
    depositSerializedTransaction: TransactionDetails;
  };
  message: string;
}

export interface TransactionDetails {
  serializedTransaction: string;
  transactionId: string;
}
export interface EscrowDetails {
  vaultId: string;
  transactionId: string;
  serializedTransaction: string;
  expiresIn: string;
  asset: Asset;
}

export interface Asset {
  token: string;
  amount: number;
  decimals: number;
  symbol: string;
  name: string;
  logoUri: string;
}

// Deposit accept transaction

export interface DepositAcceptTransactionRequest {
  inviteCode: string;
  publicKey: string;
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

// Withdrawal transactions

export type WithdrawalTypes = "WON" | "EXPIRED" | "DRAW";

export interface WithdrawalTransactionRequest {
  inviteCode: string;
  publicKey: string;
  type: WithdrawalTypes;
}

export interface ExecuteWithdrawalEscrowRequest {
  inviteCode: string;
  transactionId: string;
  signedTransaction: string;
  publicKey: string;
  type: WithdrawalTypes;
}
