"use client";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { useInfiniteUser } from "@/hooks/use-infinite-user";
import { MemberRole } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { ElementRef, Fragment, useRef } from "react";

interface UserProps {
  apiUrl: string;
  paramKey: "companyId" | "userId";
  paramValue: string;
  queryKey: string;
  role?: MemberRole;
}
export const Users = ({
  role,
  apiUrl,
  paramKey,
  paramValue,
  queryKey,
}: UserProps) => {
  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);
  // const { data, isLoading } = useUsers(companyId);

  // const { data, error, isLoading } = useFetch({
  //   apiUrl,
  //   paramKey,
  //   paramValue,
  //   queryKey,
  // });

  const { data, status, isFetching, hasNextPage, fetchNextPage } =
    useInfiniteUser({
      apiUrl,
      paramKey,
      paramValue,
      queryKey,
    });

  useInfiniteScroll({
    chatRef,
    bottomRef,
    count: data?.pages?.[0]?.items?.length ?? 0,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetching && !!hasNextPage,
  });

  if (status === "pending") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Carregando Usuários...
        </p>
      </div>
    );
  }

  console.log(JSON.stringify(data, null, 2));
  return (
    <div>
      <div>
        <div
          ref={chatRef}
          className="flex-1 flex flex-col py-4 overflow-y-auto"
        >
          {!hasNextPage && <div className="flex-1" />}

          {hasNextPage && (
            <div className="flex justify-center">
              {isFetching ? (
                <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
              ) : (
                <button
                  onClick={() => fetchNextPage()}
                  className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
                >
                  Load previous messages
                </button>
              )}
            </div>
          )}
          <div className="flex flex-col-reverse mt-auto">
            {data?.pages?.map((group, i) => (
              <Fragment key={i}>{JSON.stringify(group)}</Fragment>
            ))}
          </div>
          <div ref={bottomRef} />
        </div>
        {/* {users?.map((item) => (
          <UserBox data={item} key={item.id} role={role} />
        ))} */}
      </div>
    </div>
  );
};
