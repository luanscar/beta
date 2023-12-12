import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";

interface UserQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: "companyId" | "userId";
  paramValue: string;
}

export const useUserQuery = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue,
}: UserQueryProps) => {
  const fetchUsers = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam,
          [paramKey]: paramValue,
        },
      },
      { skipNull: true }
    );

    const res = await fetch(url);
    return res.json();
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: fetchUsers,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      // refetchInterval: 1000,
    });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
};
