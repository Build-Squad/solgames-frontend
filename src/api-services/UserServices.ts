import CoreAPIService from "./CoreServiceAPI";

class UserService {
  getUsers = async () => {
    return CoreAPIService.get(`/user`);
  };
  connectUsers = async (payload) => {
    return CoreAPIService.post<any>(`/user`, payload);
  };
}
export default new UserService();
