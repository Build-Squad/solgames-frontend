"use client";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import {
  SolanaPrivateKeyProvider,
  SolanaWallet,
} from "@web3auth/solana-provider";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { Web3Auth } from "@web3auth/modal";
import { Connection, PublicKey } from "@solana/web3.js";
import { useSnackbar } from "./snackbarContext";
import { useConnectUser } from "@/hooks/api-hooks/useUsers";
import { useAuth } from "./authContext";

const clientId =
  "BIaVlcUD-SUS5jlLfPG-V9Bj_EsI19Z31-HitBrMEhWDnOb-jEqKuwtq4W6mTymgwMQhhM5E9RbunQKkYAqnlSc";

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

interface Web3AuthContextProps {
  provider: IProvider | null;
  loggedIn: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getUserInfo: () => Promise<any>;
  getAccounts: (provider: IProvider) => Promise<string[] | string>;
  getBalance: () => Promise<string>;
  signMessage: (message: string) => Promise<string>;
}

interface Web3AuthProviderProps {
  children: ReactNode;
}

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
  const { login: loginUser, logout: logoutUser } = useAuth();

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal();
        setProvider(web3auth.provider);

        if (web3auth.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const login = async () => {
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
    const {
      email,
      name,
      profileImage,
      typeOfLogin,
      verifier,
      verifierId,
      aggregateVerifier,
      isMfaEnabled,
      idToken,
    } = userInfo;
    try {
      const payload = {
        email,
        name,
        profileImage,
        typeOfLogin,
        verifier,
        verifierId,
        aggregateVerifier,
        isMfaEnabled,
        idToken,
        publicKey,
      };

      const res = await connectionMutateAsync(payload);
      loginUser(res.data);
      showMessage(res.message, "success");
    } catch (e) {
      console.log(e);
      logout();
      showMessage("Error connecting!", "error");
    }
  };

  const logout = async () => {
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
    logoutUser();
    showMessage("Logged out!", "success");
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
  const getPrivateKey = async () => {
    const privateKey = await web3auth.provider.request({
      method: "solanaPrivateKey",
    });
  };

  const getBalance = async () => {
    const solanaWallet = new SolanaWallet(provider);
    const accounts = await solanaWallet.requestAccounts();

    const connection = new Connection(chainConfig.rpcTarget);

    // Fetch the balance for the specified public key
    const balance = await connection.getBalance(new PublicKey(accounts[0]));
    return (balance / 1e9).toString(); // Convert lamports to SOL
  };

  const signMessage = async (message: string) => {
    if (!provider) {
      return "provider not initialized yet";
    }
    const solanaWallet = new SolanaWallet(provider);

    const msg = Buffer.from(message, "utf8");
    await solanaWallet.signMessage(msg);
    return;
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
        signMessage,
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
