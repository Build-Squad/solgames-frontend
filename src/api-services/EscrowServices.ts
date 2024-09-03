import CoreAPIService from "./CoreServiceAPI";
import {
  CreateAndDepositEscrowResponse,
  CreateAndDepositEscrowRequest,
  ExecuteEscrowRequest,
  ExecuteEscrowResponse,
  DepositAcceptTransactionRequest,
  WithdrawalTransactionRequest,
  ExecuteWithdrawalEscrowRequest,
} from "./interfaces/escrowInterface";

class EscrowServices {
  createEscrow = async (payload: CreateAndDepositEscrowRequest) => {
    return CoreAPIService.post<CreateAndDepositEscrowResponse>(
      `/escrow/create-escrow`,
      payload
    );
  };
  depositAcceptTransaction = async (
    payload: DepositAcceptTransactionRequest
  ) => {
    return CoreAPIService.post<any>(
      `/escrow/deposit-accept-transaction`,
      payload
    );
  };
  executeEscrow = async (payload: ExecuteEscrowRequest) => {
    return CoreAPIService.post<ExecuteEscrowResponse>(
      `/escrow/execute-deposit`,
      payload
    );
  };
  withdrawlTransaction = async (payload: WithdrawalTransactionRequest) => {
    return CoreAPIService.post<any>(`/escrow/withdrawal-transaction`, payload);
  };
  executeWithdrawal = async (payload: ExecuteWithdrawalEscrowRequest) => {
    return CoreAPIService.post<any>(
      `/escrow/execute-withdrawal`,
      payload
    );
  };
}
export default new EscrowServices();
