"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import {
  SolanaPrivateKeyProvider,
  SolanaWallet,
} from "@web3auth/solana-provider";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { Web3Auth } from "@web3auth/modal";
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import { useSnackbar } from "./snackbarContext";
import { useConnectUser } from "@/hooks/api-hooks/useUsers";
import { useAuth } from "./authContext";
import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";
import { Web3AuthContextProps, Web3AuthProviderProps } from "./interfaces";
import { hexToUint8Array } from "@/utils/helper";

const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.SOLANA,
  chainId: "0x3",

  // RPC client api endpoint to query or interact with the database
  rpcTarget: "https://api.devnet.solana.com",
  displayName: "Solana Devnet",
  blockExplorerUrl: "https://explorer.solana.com/",
  ticker: "SOL",
  tickerName: "Solana",
};

const privateKeyProvider = new SolanaPrivateKeyProvider({
  config: { chainConfig },
});

// Configure web3auth
const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
});
const openloginAdapter = new OpenloginAdapter({ privateKeyProvider });
web3auth.configureAdapter(openloginAdapter);

const Web3AuthContext = createContext<Web3AuthContextProps | undefined>(
  undefined
);

export const Web3AuthProvider: React.FC<Web3AuthProviderProps> = ({
  children,
}) => {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const { showMessage } = useSnackbar();
  const { connectionMutateAsync } = useConnectUser();
  const [isInitialized, setIsInitialized] = useState(false);
  const { login: loginUser, logout: logoutUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const init = async () => {
    try {
      await web3auth.initModal();
      setProvider(web3auth.provider);

      if (web3auth.connected) {
        setLoggedIn(true);
      }
      setIsInitialized(true);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    init();
  }, []);

  const login = async () => {
    if (!isInitialized) {
      showMessage("Wallet is not ready yet. Please wait.", "info");
      return;
    }
    try {
      const web3authProvider = await web3auth.connect();
      setProvider(web3authProvider);
      if (web3auth.connected) {
        setLoggedIn(true);

        const userInfo = await getUserInfo();
        const publicKey = await getAccounts(web3authProvider);
        await createUser({ userInfo, publicKey });
      }
    } catch (e) {
      console.log(e);
      logout();
      showMessage("Error connecting in!", "error");
    }
  };

  const createUser = async ({ userInfo, publicKey }) => {
    try {
      const res = await connectionMutateAsync({ ...userInfo, publicKey });
      loginUser(res.data);
      showMessage(res.message, "success");
    } catch (e) {
      console.log(e);
      logout();
      showMessage("Error connecting!", "error");
    }
  };

  const logout = async () => {
    try {
      await web3auth.logout();
      setProvider(null);
      setLoggedIn(false);
      logoutUser();
      showMessage("Logged out!", "success");
    } catch (e) {
      console.error(e);
      showMessage("Something went wrong while logging out!", "error");
    }
  };

  const getUserInfo = async () => {
    const user = await web3auth.getUserInfo();
    return user;
  };

  const getAccounts = async (newProvider: IProvider) => {
    const solanaWallet = new SolanaWallet(newProvider);
    // Get user's Solana public address
    const accounts = await solanaWallet.requestAccounts();
    return accounts[0];
  };

  //Assuming user is already logged in.
  const getPrivateKey = async (): Promise<string> => {
    const privateKey = await web3auth.provider.request({
      method: "solanaPrivateKey",
    });
    return typeof privateKey == "string" ? privateKey : "";
  };

  const getBalance = async () => {
    const solanaWallet = new SolanaWallet(provider);
    const accounts = await solanaWallet.requestAccounts();

    const connection = new Connection(chainConfig.rpcTarget);

    // Fetch the balance for the specified public key
    const balance = await connection.getBalance(new PublicKey(accounts[0]));
    return (balance / 1e9).toString(); // Convert lamports to SOL
  };
  // Function to handle SOL transfer
  const transfer = async (serializedTransaction: string) => {
    if (!provider) {
      showMessage("Provider is not initialized.", "info");
      return;
    }

    setIsLoading(true);
    try {
      const solanaWallet = new SolanaWallet(provider);

      // Deserialize the transaction received from the backend
      const transaction = VersionedTransaction.deserialize(
        new Uint8Array(Buffer.from(serializedTransaction, "base64"))
      );

      // Sign the transaction with the user's wallet
      const signedTx = await solanaWallet.signTransaction(transaction);

      // // Serialize the signed transaction
      const serializedSignedTx = signedTx.serialize();
      const encodedSerializedSignedTx =
        Buffer.from(serializedSignedTx).toString("base64");

      return {
        data: {
          encodedSerializedSignedTx,
          serializedSignedTx,
        },
        success: true,
        message: "Transaction Successfully signed!",
      };
    } catch (error) {
      console.log("error: ", error);
      return {
        data: null,
        success: false,
        message: "Transfer failed!",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signMessage = async () => {
    setIsLoading(true);
    try {
      if (!provider) {
        throw new Error("Web3Auth provider is not initialized.");
      }
      // Convert message to Uint8Array
      const message = "Authenticate to confirm your identity for this game.";
      const messageBytes = new TextEncoder().encode(message);

      // Sign the message
      const solanaWallet = new SolanaWallet(provider);
      const signature = await solanaWallet.signMessage(messageBytes);
      const base64Signature = Buffer.from(signature).toString("base64");
      setIsLoading(false);

      return { base64Signature: base64Signature, message: message };
    } catch (error) {
      console.error("Error during authentication:", error);
      setIsLoading(false);
      return {};
    }
  };

  const verifySignature = (
    message: string,
    signature: string,
    publicKey: PublicKey
  ): boolean => {
    try {
      // Convert message to Uint8Array
      const messageBytes = naclUtil.decodeUTF8(message);

      // Convert signature string to Uint8Array
      const signatureBytes = naclUtil.decodeBase64(signature);

      // Convert PublicKey to Uint8Array
      const publicKeyBytes = publicKey.toBytes();

      // Verify the signature using tweetnacl
      return nacl.sign.detached.verify(
        messageBytes,
        signatureBytes,
        publicKeyBytes
      );
    } catch (error) {
      console.error("Error verifying signature:", error);
      return false;
    }
  };

  return (
    <Web3AuthContext.Provider
      value={{
        provider,
        loggedIn,
        login,
        logout,
        getUserInfo,
        getAccounts,
        getBalance,
        transfer,
        isLoading,
        signMessage,
        verifySignature,
      }}
    >
      {children}
    </Web3AuthContext.Provider>
  );
};

export const useWeb3Auth = () => {
  const context = useContext(Web3AuthContext);
  if (context === undefined) {
    throw new Error("useWeb3Auth must be used within a Web3AuthProvider");
  }
  return context;
};
