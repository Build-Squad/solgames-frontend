import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAuth } from "@/context/authContext";

// To check if the wallet connected to DApp is the same that the browser is connected to
const useVerifySolanaWallet = () => {
  const { publicKey, disconnect } = useWallet();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (user?.verifier == "wallet") {
      if (user?.publicKey != publicKey) {
        disconnect();
        logout();
      }
    }
  }, [user, publicKey]);
};

export default useVerifySolanaWallet;
