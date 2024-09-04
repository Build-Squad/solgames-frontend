import AccessCodeServices from "@/api-services/AccessCodeServices";
import { VerifyAccessCodeRequest } from "@/api-services/interfaces/accessCodeInterface";
import { useMutation } from "@tanstack/react-query";

export const useVerifyAccessCode = () => {
  const {
    isPending: isVerifyEscrowLoading,
    data: verifyEscrowResponse,
    mutateAsync: verifyEscrowMutateAsync,
  } = useMutation({
    mutationFn: (payload: VerifyAccessCodeRequest) =>
      AccessCodeServices.verifyAccessCode(payload),
  });

  return {
    isVerifyEscrowLoading,
    verifyEscrowResponse,
    verifyEscrowMutateAsync,
  };
};
