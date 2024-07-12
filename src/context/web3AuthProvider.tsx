"use client";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { SolanaPrivateKeyProvider } from "@web3auth/solana-provider";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { Web3Auth } from "@web3auth/modal";
import { Connection, PublicKey } from "@solana/web3.js";
import { useSnackbar } from "./snackbarContext";

const clientId =
  "BIaVlcUD-SUS5jlLfPG-V9Bj_EsI19Z31-HitBrMEhWDnOb-jEqKuwtq4W6mTymgwMQhhM5E9RbunQKkYAqnlSc";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.SOLANA,
  chainId: "1",

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

const openloginAdapter = new OpenloginAdapter({ privateKeyProvider });

// Configure web3auth
const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
});
web3auth.configureAdapter(openloginAdapter);

interface Web3AuthContextProps {
  provider: IProvider | null;
  loggedIn: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getUserInfo: () => Promise<any>;
  getAccounts: () => Promise<string[] | string>;
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
        showMessage("Successfully connected!", "success");
      }
    } catch (e) {
      console.log(e);
      showMessage("Error connecting in!", "error");
    }
  };

  const getUserInfo = async () => {
    const user = await web3auth.getUserInfo();
    return user;
  };

  const logout = async () => {
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
    showMessage("Logged out!", "success");
  };

  const getAccounts = async () => {
    if (!provider) {
      return "provider not initialized yet";
    }
    const accounts = await provider.request({ method: "solana_accounts" });
    return accounts[0];
  };

  const getBalance = async () => {
    if (!provider) {
      return "provider not initialized yet";
    }
    const connection = new Connection(chainConfig.rpcTarget);
    const accounts = await provider.request({ method: "solana_accounts" });
    const publicKey = new PublicKey(accounts[0]);
    const balance = await connection.getBalance(publicKey);
    return (balance / 1e9).toString(); // Convert lamports to SOL
  };

  const signMessage = async (message: string) => {
    if (!provider) {
      return "provider not initialized yet";
    }
    const accounts = await provider.request({ method: "solana_accounts" });
    const signedMessage = await provider.request({
      method: "solana_signMessage",
      params: {
        pubkey: accounts[0],
        message,
      },
    });
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
