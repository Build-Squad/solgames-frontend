import GameServices from "@/api-services/GameServices";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";

export const useGetAllGames = (id: string) => {
  const [currentId, setCurrentId] = useState<string>(id);

  const { data, isLoading, refetch } = useQuery({
    queryKey: [`all-games-with-id-${currentId}`],
    queryFn: () => GameServices.getGamesWithId(currentId),
    enabled: !!currentId,
    staleTime: 0,
  });

  const updatedRefetch = useCallback(
    (id: string) => {
      setCurrentId(id);
    },
    [id]
  );

  return {
    data,
    isLoading,
    updatedRefetch,
    refetch,
  };
};

export const useGetGameWithInviteCode = (inviteCode: string) => {
  return useQuery({
    queryKey: [`game-detail-${inviteCode}`],
    queryFn: () => GameServices.getGameWithInviteCode(inviteCode),
    enabled: !!inviteCode,
    staleTime: 0,
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
