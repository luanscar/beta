"use client";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { useInfiniteUser } from "@/hooks/use-infinite-user";
import { MembersWithUsers } from "@/types/db-types";
import { MemberRole } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { ElementRef, Fragment, useRef } from "react";
import { ScrollArea } from "../ui/scroll-area";
import UserBox from "./user-box";

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

  return (
    <ScrollArea className="h-full flex flex-col py-4 overflow-y-auto">
      <div ref={chatRef} className="f">
        {!hasNextPage && <div className="flex-1" />}

        <div className="flex flex-col mt-auto">
          {data?.pages?.map((group, i) => (
            <Fragment key={i}>
              {group.items.map((member: MembersWithUsers) => (
                <UserBox data={member} key={member.id} role={role} />
              ))}
            </Fragment>
          ))}
        </div>
        <div ref={bottomRef} />
      </div>
      {/* {users?.map((item) => (
          <UserBox data={item} key={item.id} role={role} />
        ))} */}

      {hasNextPage ? (
        <div className="flex justify-center mb-44">
          {isFetching ? (
            <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
            >
              Ver mais...
            </button>
          )}
        </div>
      ) : (
        <div className="flex justify-center mb-4">
          <p className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition">
            Todos os usuários já foram carregados.
          </p>
        </div>
      )}
    </ScrollArea>
  );
};
