import { useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useAuth } from "@/context/authContext";

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
