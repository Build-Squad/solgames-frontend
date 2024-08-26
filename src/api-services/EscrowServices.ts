import CoreAPIService from "./CoreServiceAPI";
import {
  CreateEscrowRequest,
  CreateEscrowResponse,
  ExecuteEscrowRequest,
  ExecuteEscrowResponse,
} from "./interfaces/escrowInterface";

class EscrowServices {
  createAndInitiateEscrow = async (payload: CreateEscrowRequest) => {
    return CoreAPIService.post<CreateEscrowResponse>(
      `/escrow/create-initialize`,
      payload
    );
  };
  acceptAndInitiateEscrow = async (payload: CreateEscrowRequest) => {
    return CoreAPIService.post<CreateEscrowResponse>(
      `/escrow/accept-initialize`,
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
