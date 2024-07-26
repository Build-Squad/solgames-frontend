import CoreAPIService from "./CoreServiceAPI";

class GameServices {
  getGamesWithId = async (id: string) => {
    return CoreAPIService.post<any>(`/games/my-games`, { userId: id });
  };
  createGame = async (payload) => {
    return CoreAPIService.post<any>(`/games`, payload);
  };
  acceptGame = async (payload) => {
    return CoreAPIService.post<any>(`/games/accept-game`, payload);
  };
  getGameWithInviteCode = async (inviteCode: string) => {
    return CoreAPIService.get<any>(`/games/by-code/${inviteCode}`);
  };
}
export default new GameServices();
