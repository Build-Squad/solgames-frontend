import GameServices from "@/api-services/GameServices";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetAllGames = (id: string) => {
  return useQuery({
    queryKey: [`all-games-with-id-${id}`],
    queryFn: () => GameServices.getGamesWithId(id),
    enabled: !!id,
  });
};

export const useGetGameWithInviteCode = (inviteCode: string) => {
  return useQuery({
    queryKey: [`game-details-${inviteCode}`],
    queryFn: () => GameServices.getGameWithInviteCode(inviteCode),
    enabled: !!inviteCode,
  });
};

export const useCreateGame = () => {
  const {
    isPending: isCreateGameLoading,
    data: createGameResponse,
    mutateAsync: createGameMutateAsync,
  } = useMutation({
    mutationFn: (payload: any) => GameServices.createGame(payload),
  });

  return {
    isCreateGameLoading,
    createGameResponse,
    createGameMutateAsync,
  };
};

export const useAcceptGame = () => {
  const {
    isPending: isAcceptingGameLoading,
    data: acceptGameResponse,
    mutateAsync: acceptGameMutateAsync,
  } = useMutation({
    mutationFn: (payload: any) => GameServices.acceptGame(payload),
  });

  return {
    isAcceptingGameLoading,
    acceptGameResponse,
    acceptGameMutateAsync,
  };
};
