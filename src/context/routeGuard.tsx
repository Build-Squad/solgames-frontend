"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuth } from "./authContext";
import AccessCodeModal from "@/components/modals/accessCodeModal";
import { useVerifyAccessCode } from "@/hooks/api-hooks/useAccessCode";

interface RouteGuardProps {
  children: React.ReactNode;
}

const homePageRoute = "/";
const joinGameRoute = "/join-game";

const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();

  const { user, setUser } = useAuth();
  const [showEnterAccessCode, setShowEnterAccessCode] = useState(false);
  const { verifyEscrowMutateAsync } = useVerifyAccessCode();

  useEffect(() => {
    // Case 1: User is not logged in
    if (!user?.id) {
      // 1.1: If the route is not "/join-game", redirect to the home page
      if (!pathname.includes(joinGameRoute) && pathname !== "/") {
        router.push(homePageRoute);
      }
      // If the user is on the "join-game" route, do nothing
    }
    // Case 2: User is logged in
    else {
      // 2.1: User does not have an access code
      if (!user?.accessCode) {
        // 2.2.2: If the route is any other than "join-game", show the access code modal
        if (!joinGameRoute.includes(pathname)) {
          setShowEnterAccessCode(true);
        }
        // 2.2.1: If the route is "join-game", let the user operate normally
      }
      // 2.2: User has an access code, let them operate everywhere
      else {
        setShowEnterAccessCode(false);
      }
    }
  }, [user, pathname, router, user?.accessCode]);

  const handleSubmitAccessCodeVerification = async (code: string) => {
    // verify the access code, if valid, fetch user details and store in the useAuth login method
    const verifyRes = await verifyEscrowMutateAsync({ code, userId: user?.id });
    if (verifyRes?.success) {
      setUser((prevUser) => ({
        ...prevUser,
        accessCode: code,
      }));
    }
  };

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
