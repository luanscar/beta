import fetcher from "@/lib/fetcher";
import useSWR, { useSWRConfig } from "swr";

const useUsers = (companyId?: string) => {
  if(!companyId){
    const url = `/api/company/user`;
  }

  const url =  `/api/company/user?companyId=${companyId}`
  
  const { data, error, isLoading } = useSWR(url, fetcher);

   const { refreshInterval, mutate, cache} = useSWRConfig()

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

export default useUsers;
