"use client";
import useUsers from "@/hooks/use-users";
import { MembersWithUsers } from "@/types/db-types";
import { Loader2 } from "lucide-react";

interface UserProps {
  companyId: string;
}
export const Users = ({ companyId }: UserProps) => {
  const { data, isLoading } = useUsers(companyId);
  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Carregando Usuários...
        </p>
      </div>
    );
  }

  const users: MembersWithUsers = data;
  return <div>{JSON.stringify(users?.map((item) => item.user.name))}</div>;
};
