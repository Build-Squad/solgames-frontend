import UserServices from "@/api-services/UserServices";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: [`all-users`],
    queryFn: () => UserServices.getUsers(),
  });
};

export const useConnectUser = () => {
  const {
    isPending: isConnectionLoading,
    data: connectionResponse,
    mutateAsync: connectionMutateAsync,
  } = useMutation({
    mutationFn: (payload:any) => UserServices.connectUsers(payload),
  });

  return {
    isConnectionLoading,
    connectionResponse,
    connectionMutateAsync,
  };
};
