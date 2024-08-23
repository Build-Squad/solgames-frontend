import EscrowServices from "@/api-services/EscrowServices";
import { CreateEscrowRequest } from "@/api-services/interfaces/escrowInterface";
import { useMutation } from "@tanstack/react-query";

export const useCreateEscrow = () => {
  const {
    isPending: isCreateEscrowLoading,
    data: createEscrowResponse,
    mutateAsync: createEscrowMutateAsync,
  } = useMutation({
    mutationFn: (payload: CreateEscrowRequest) =>
      EscrowServices.createEscrow(payload),
  });

  return {
    isCreateEscrowLoading,
    createEscrowMutateAsync,
    createEscrowResponse,
  };
};
