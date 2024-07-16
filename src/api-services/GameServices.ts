import CoreAPIService from "./CoreServiceAPI";

class GameService {
  getGames = async () => {
    return CoreAPIService.get(`/user`);
  };
}
export default new GameService();
