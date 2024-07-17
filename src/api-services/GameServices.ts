import CoreAPIService from "./CoreServiceAPI";

class GameServices {
  getGamesWithId = async (id: string) => {
    return CoreAPIService.get(`/games?id=${id}`);
  };
  createGame = async (payload) => {
    return CoreAPIService.post<any>(`/games`, payload);
  };
}
export default new GameServices();
