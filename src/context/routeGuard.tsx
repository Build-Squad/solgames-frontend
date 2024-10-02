"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAuth } from "./authContext";
import AccessCodeModal from "@/components/modals/accessCodeModal";
import { useVerifyAccessCode } from "@/hooks/api-hooks/useAccessCode";
import useVerifySolanaWallet from "@/hooks/verifySolanaWallet";
import useVerifyAccessCodeHook from "@/hooks/verifyAccessCode";

interface RouteGuardProps {
  children: React.ReactNode;
}

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const [showEnterAccessCode, setShowEnterAccessCode] = useState(false);

  // To check if the wallet connected to DApp is the same that the browser is connected to
  useVerifySolanaWallet();

  // Check if the user if logged in and check routes and if he/she has access code or not.
  const { handleSubmitAccessCodeVerification } = useVerifyAccessCodeHook({
    setShowEnterAccessCode,
  });

  return (
    <>
      {showEnterAccessCode ? (
        <AccessCodeModal
          open={true}
          onClose={() => {}}
          onSubmit={handleSubmitAccessCodeVerification}
        />
      ) : (
        children
      )}
    </>
  );
};

export default RouteGuard;
