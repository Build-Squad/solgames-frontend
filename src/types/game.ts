export type GameStatus =
  | "Scheduled"
  | "Accepted"
  | "InProgress"
  | "Completed"
  | "Draw"
  | "Expired";

export type Game = {
  id: string;
  creatorId: string;
  acceptorId: string;
  winnerId: string;
  token: string;
  betAmount: number;
  inviteCode: string;
  gameDateTime: Date;
  isGameAccepted: boolean;
  gameStatus: GameStatus;
};
