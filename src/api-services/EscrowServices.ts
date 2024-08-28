import CoreAPIService from "./CoreServiceAPI";
import {
  CreateAndDepositEscrowResponse,
  CreateAndDepositEscrowRequest,
  ExecuteEscrowRequest,
  ExecuteEscrowResponse,
} from "./interfaces/escrowInterface";

class EscrowServices {
  createEscrow = async (payload: CreateAndDepositEscrowRequest) => {
    return CoreAPIService.post<CreateAndDepositEscrowResponse>(
      `/escrow/create-escrow`,
      payload
    );
  };
  executeEscrow = async (payload: ExecuteEscrowRequest) => {
    return CoreAPIService.post<ExecuteEscrowResponse>(
      `/escrow/execute-deposit`,
      payload
    );
  };
}
export default new EscrowServices();
