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
import Web3 from "web3";

const clientId =
  "BIaVlcUD-SUS5jlLfPG-V9Bj_EsI19Z31-HitBrMEhWDnOb-jEqKuwtq4W6mTymgwMQhhM5E9RbunQKkYAqnlSc";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.SOLANA,
  chainId: "0x1",

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
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    if (web3auth.connected) {
      setLoggedIn(true);
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
  };

  const getAccounts = async () => {
    if (!provider) {
      return "provider not initialized yet";
    }
    const web3 = new Web3(provider as any);
    const address = await web3.eth.getAccounts();
    return address;
  };

  const getBalance = async () => {
    if (!provider) {
      return "provider not initialized yet";
    }
    const web3 = new Web3(provider as any);
    const address = (await web3.eth.getAccounts())[0];
    const balance = web3.utils.fromWei(
      await web3.eth.getBalance(address),
      "ether"
    );
    return balance;
  };

  const signMessage = async (message: string) => {
    if (!provider) {
      return "provider not initialized yet";
    }
    const web3 = new Web3(provider as any);
    const fromAddress = (await web3.eth.getAccounts())[0];
    const signedMessage = await web3.eth.personal.sign(
      message,
      fromAddress,
      "test password!"
    );
    return signedMessage;
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
