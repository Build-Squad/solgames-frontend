import CoreAPIService from "./CoreServiceAPI";
import {
  CreateAndDepositEscrowResponse,
  CreateAndDepositEscrowRequest,
  ExecuteEscrowRequest,
  ExecuteEscrowResponse,
  DepositAcceptTransactionRequest,
} from "./interfaces/escrowInterface";

class EscrowServices {
  createEscrow = async (payload: CreateAndDepositEscrowRequest) => {
    return CoreAPIService.post<CreateAndDepositEscrowResponse>(
      `/escrow/create-escrow`,
      payload
    );
  };
  depositAcceptTransaction = async (payload: DepositAcceptTransactionRequest) => {
    return CoreAPIService.post<any>(`/escrow/deposit-accept-transaction`, payload);
  };
  executeEscrow = async (payload: ExecuteEscrowRequest) => {
    return CoreAPIService.post<ExecuteEscrowResponse>(
      `/escrow/execute-deposit`,
      payload
    );
  };
}
export default new EscrowServices();
