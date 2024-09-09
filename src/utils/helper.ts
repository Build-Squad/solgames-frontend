import { PublicKey, VersionedTransaction } from "@solana/web3.js";

export const generateInviteCode = (length = 8) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let inviteCode = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    inviteCode += characters[randomIndex];
  }
  return inviteCode;
};

export function hexToUint8Array(hexString: string) {
  return Uint8Array.from(Buffer.from(hexString, "hex"));
}

export const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
export const signTransactionWithSolanaWallet = async (
  serializedTransaction: string,
  signTransaction: any,
  publicKey: PublicKey,
  showMessage: any
) => {
  try {
    if (!publicKey || !signTransaction) {
      showMessage(
        "Wallet not connected or no signing capability available.",
        "info"
      );
      return {
        data: null,
        success: false,
        message: "Account not connected!",
      };
    }
    const transaction = VersionedTransaction.deserialize(
      new Uint8Array(Buffer.from(serializedTransaction, "base64"))
    );
    const signedTransaction = await signTransaction(transaction);

    // Serialize the signed transaction
    const serializedSignedTx = signedTransaction.serialize();
    const encodedSerializedSignedTx =
      Buffer.from(serializedSignedTx).toString("base64");

    return {
      data: { encodedSerializedSignedTx },
      success: true,
      message: "Transaction Successfully executed!",
    };
  } catch (error) {
    console.error("Error signing the transaction: ", error);
    return {
      data: null,
      success: false,
      message: "Transfer failed!",
    };
  }
};
