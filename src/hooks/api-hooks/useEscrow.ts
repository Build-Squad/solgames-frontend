import EscrowServices from "@/api-services/EscrowServices";
import {
  CreateEscrowRequest,
  ExecuteEscrowRequest,
} from "@/api-services/interfaces/escrowInterface";
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

export const useExecuteEscrow = () => {
  const {
    isPending: isExecuteEscrowLoading,
    data: executeEscrowResponse,
    mutateAsync: executeEscrowMutateAsync,
  } = useMutation({
    mutationFn: (payload: ExecuteEscrowRequest) =>
      EscrowServices.executeEscrow(payload),
  });

  return {
    isExecuteEscrowLoading,
    executeEscrowResponse,
    executeEscrowMutateAsync,
  };
};
