import GameServices from "@/api-services/GameServices";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetAllGames = (id: string) => {
  return useQuery({
    queryKey: [`all-games-with-id-${id}`],
    queryFn: () => GameServices.getGamesWithId(id),
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
