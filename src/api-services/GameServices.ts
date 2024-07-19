import CoreAPIService from "./CoreServiceAPI";

class GameServices {
  getGamesWithId = async (id: string) => {
    return CoreAPIService.post<any>(`/games/my-games`, { userId: id });
  };
  createGame = async (payload) => {
    return CoreAPIService.post<any>(`/games`, payload);
  };
}
export default new GameServices();
