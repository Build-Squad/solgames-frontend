import CoreAPIService from "./CoreServiceAPI";
import {
  CreateEscrowRequest,
  CreateEscrowResponse,
  ExecuteEscrowRequest,
  ExecuteEscrowResponse,
} from "./interfaces/escrowInterface";

class EscrowServices {
  createEscrow = async (payload: CreateEscrowRequest) => {
    return CoreAPIService.post<CreateEscrowResponse>(
      `/escrow/deposit`,
      payload
    );
  };
  executeEscrow = async (payload: ExecuteEscrowRequest) => {
    return CoreAPIService.post<ExecuteEscrowResponse>(
      `/escrow/execute`,
      payload
    );
  };
}
export default new EscrowServices();
