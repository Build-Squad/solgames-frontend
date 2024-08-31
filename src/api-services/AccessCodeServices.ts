import CoreAPIService from "./CoreServiceAPI";
import { VerifyAccessCodeRequest } from "./interfaces/accessCodeInterface";

class AccessCodeServices {
  verifyAccessCode = async (payload: VerifyAccessCodeRequest) => {
    return CoreAPIService.post<any>(`/access-code/verify`, payload);
  };
}
export default new AccessCodeServices();
