import EscrowServices from "@/api-services/EscrowServices";
import {
  CreateEscrowRequest,
  ExecuteEscrowRequest,
} from "@/api-services/interfaces/escrowInterface";
import { useMutation } from "@tanstack/react-query";

export const useCreateAndInitiateEscrow = () => {
  const {
    isPending: isCreateEscrowLoading,
    data: createEscrowResponse,
    mutateAsync: createEscrowMutateAsync,
  } = useMutation({
    mutationFn: (payload: CreateEscrowRequest) =>
      EscrowServices.createAndInitiateEscrow(payload),
  });

  return {
    isCreateEscrowLoading,
    createEscrowMutateAsync,
    createEscrowResponse,
  };
};

export const useAcceptAndInitializeEscrow = () => {
  const {
    isPending: isAcceptEscrowLoading,
    data: acceptEscrowResponse,
    mutateAsync: acceptEscrowMutateAsync,
  } = useMutation({
    mutationFn: (payload: CreateEscrowRequest) =>
      EscrowServices.acceptAndInitiateEscrow(payload),
  });

  return {
    isAcceptEscrowLoading,
    acceptEscrowResponse,
    acceptEscrowMutateAsync,
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
