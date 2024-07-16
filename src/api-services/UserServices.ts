import CoreAPIService from "./CoreServiceAPI";

class UserService {
  getUsers = async () => {
    return CoreAPIService.get(`/user`);
  };
}
export default new UserService();
