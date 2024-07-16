import UserServices from "@/api-services/UserServices";
import { useQuery } from "@tanstack/react-query";

export const useUsers = () => {
  return useQuery({
    queryKey: [`all-users`],
    queryFn: () => UserServices.getUsers(),
  });
};
