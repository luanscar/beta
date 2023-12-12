import fetcher from "@/lib/fetcher";
import useSWR from "swr";

const useUsers = (userId?: string) => {
  const url = "/api/company/user";
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

export default useUsers;
