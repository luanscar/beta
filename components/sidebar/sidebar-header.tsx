"use client";

import { MemberRole } from "@prisma/client";
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  UserPlus,
  Users,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal-store";
import { CompanyWithMembersWithUsers } from "@/types/db-types";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { SkeletonHeader } from "../skeleton/skeleton-header";

interface SidebarHeaderProps {
  company: CompanyWithMembersWithUsers;
  role?: MemberRole;
}

export const SidebarHeader = ({ company, role }: SidebarHeaderProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const { onOpen } = useModal();

  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <SkeletonHeader />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="w-full text-md font-semibold px-3 flex items-center h-12  dark:border-neutral-800 border-b hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
          {company.name}
          <ChevronDown className="h-5 w-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]"
      >
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("invite", { company })}
            className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
          >
            Invite People
            <UserPlus className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("editCompany", { company })}
            className="px-3 py-2 text-sm cursor-pointer"
          >
            Company Settings
            <Settings className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("createUser", { company })}
            className="px-3 py-2 text-sm cursor-pointer"
          >
            Criar Usuários
            <Users className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("createChannel")}
            className="px-3 py-2 text-sm cursor-pointer"
          >
            Create Channel
            <PlusCircle className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          onClick={() => signOut()}
          className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
        >
          Sair
          <LogOut className="h-4 w-4 ml-auto" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
