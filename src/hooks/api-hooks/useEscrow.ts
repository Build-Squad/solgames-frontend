import EscrowServices from "@/api-services/EscrowServices";
import {
  CreateAndDepositEscrowRequest,
  ExecuteEscrowRequest,
} from "@/api-services/interfaces/escrowInterface";
import { useMutation } from "@tanstack/react-query";

export const useCreateEscrow = () => {
  const {
    isPending: isCreateEscrowLoading,
    data: createEscrowResponse,
    mutateAsync: createEscrowMutateAsync,
  } = useMutation({
    mutationFn: (payload: CreateAndDepositEscrowRequest) =>
      EscrowServices.createEscrow(payload),
  });

  return {
    isCreateEscrowLoading,
    createEscrowResponse,
    createEscrowMutateAsync,
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
