import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";

interface UserQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: "companyId" | "userId";
  paramValue: string;
}

export const useInfiniteUser = ({
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

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: fetchUsers,
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.nextCursor,
  });

  return {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  };
};
