import CoreAPIService from "./CoreServiceAPI";
import {
  CreateEscrowRequest,
  CreateEscrowResponse,
} from "./interfaces/escrowInterface";

class EscrpwServices {
  createEscrow = async (payload: CreateEscrowRequest) => {
    return CoreAPIService.post<CreateEscrowResponse>(
      `/escrow/deposit`,
      payload
    );
  };
}
export default new EscrpwServices();
