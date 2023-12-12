"use client";

import { ElementRef, useRef } from "react";

import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { useUserQuery } from "@/hooks/use-user-query";
import { Member, User } from "@prisma/client";
import { Loader2, ServerCrash } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import UserBox from "./user-box";

type CompanyWithMembersWithUsers = {
  members: Member & {
    user: User;
  };
};

interface UserQueryProps {
  chatId: string;
  apiUrl: string;
  paramKey: "companyId" | "userId";
  paramValue: string;
}

export const UserList = ({ apiUrl, paramKey, paramValue }: UserQueryProps) => {
  const queryKey = `UserList`;

  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useUserQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });

  useInfiniteScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0]?.items?.length ?? 0,
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

  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    );
  }

  return (
    <div ref={chatRef}>
      <ScrollArea className="h-screen ">
        {data?.pages.map((group, i) =>
          group.items.map((company: CompanyWithMembersWithUsers) =>
            company.members.map((member) => (
              <>
                <UserBox key={member.id} data={member} role={member.role} />
              </>
            ))
          )
        )}
        {hasNextPage && (
          <div className="flex justify-center">
            {isFetchingNextPage ? (
              <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
            ) : (
              <button
                onClick={() => fetchNextPage()}
                className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
              >
                Carregar mais usuários
              </button>
            )}
          </div>
        )}

        <div className="mb-14">
          {!hasNextPage && (
            <div className="flex justify-center">
              <div className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition">
                Fim
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div ref={bottomRef} />
    </div>
  );
};
