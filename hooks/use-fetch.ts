import { useQuery } from "@tanstack/react-query";
import queryString from "query-string";
interface useFetchProps {
  apiUrl: string;
  paramKey: "companyId" | "userId";
  paramValue: string;
  queryKey: string;
}
const useFetch = ({
  apiUrl,
  paramKey,
  paramValue,
  queryKey,
}: useFetchProps) => {
  const fetchUsers = async () => {
    const url = queryString.stringifyUrl({
      url: apiUrl,
      query: {
        [paramKey]: paramValue,
      },
    });

    const res = await fetch(url);
    return res.json();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: [queryKey],
    queryFn: fetchUsers,
  });

  return { data, isLoading, error };
};

export default useFetch;
