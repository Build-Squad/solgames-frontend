import EscrowServices from "@/api-services/EscrowServices";
import {
  CreateAndDepositEscrowRequest,
  DepositAcceptTransactionRequest,
  ExecuteEscrowRequest,
  ExecuteWithdrawalEscrowRequest,
  WithdrawalTransactionRequest,
} from "@/api-services/interfaces/escrowInterface";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetEscrowDetails = (inviteCode: string) => {
  return useQuery({
    queryKey: [`escrow-details-${inviteCode}`],
    queryFn: () => EscrowServices.getEscrow(inviteCode),
    enabled: !!inviteCode,
  });
};

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

export const useDepositAcceptTransaction = () => {
  const {
    isPending: isDepositAcceptGameLoading,
    data: depositAcceptGameResponse,
    mutateAsync: depositAcceptGameMutateAsync,
  } = useMutation({
    mutationFn: (payload: DepositAcceptTransactionRequest) =>
      EscrowServices.depositAcceptTransaction(payload),
  });

  return {
    isDepositAcceptGameLoading,
    depositAcceptGameResponse,
    depositAcceptGameMutateAsync,
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

export const useWithdrawalTransaction = () => {
  const {
    isPending: isWithdrawalTransactionLoading,
    data: withdrawalTransactionResponse,
    mutateAsync: withdrawalTransactionMutateAsync,
  } = useMutation({
    mutationFn: (payload: WithdrawalTransactionRequest) =>
      EscrowServices.withdrawlTransaction(payload),
  });

  return {
    isWithdrawalTransactionLoading,
    withdrawalTransactionResponse,
    withdrawalTransactionMutateAsync,
  };
};

export const useExecuteWithdrawalTransaction = () => {
  const {
    isPending: isExecuteWithdrawalTransactionLoading,
    data: executeWithdrawalTransactionResponse,
    mutateAsync: executeWithdrawalTransactionMutateAsync,
  } = useMutation({
    mutationFn: (payload: ExecuteWithdrawalEscrowRequest) =>
      EscrowServices.executeWithdrawal(payload),
  });

  return {
    isExecuteWithdrawalTransactionLoading,
    executeWithdrawalTransactionResponse,
    executeWithdrawalTransactionMutateAsync,
  };
};
