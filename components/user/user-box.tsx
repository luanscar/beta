"use client";
import { useModal } from "@/hooks/use-modal-store";
import { cn } from "@/lib/utils";
import { Member, MemberRole, User } from "@prisma/client";
import { Loader2, Pen, ShieldAlert, ShieldCheck, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Avatar from "../avatar";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import qs from "query-string";
import { Button } from "../ui/button";

interface UserBoxProps {
  data: Member & { user: User };
  role?: MemberRole;
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
};

const UserBox: React.FC<UserBoxProps> = ({ data, role }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const icon = roleIconMap[data.role];
  const { onOpen } = useModal();
  const [loadingId, setLoadingId] = useState("");

  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  //   const handleClick = useCallback(() => {
  //     setIsLoading(true);

  //     axios
  //       .post("/api/conversations", { userId: data.id })
  //       .then((data) => {
  //         router.push(`/conversations/${data.data.id}`);
  //       })
  //       .finally(() => setIsLoading(false));
  //   }, [data, router]);

  const onDelete = async (userId: string) => {
    try {
      setLoadingId(userId);
      const url = qs.stringifyUrl({
        url: `/api/company/user/${userId}`,
      });

      await axios.delete(url);
    } catch (error) {
      console.log(error);
    } finally {
      router.refresh();
      setLoadingId("");
    }
  };

  const queryClient = useQueryClient();
  const mutationDelete = useMutation({
    mutationFn: onDelete,

    onSuccess: () => {
      queryClient.invalidateQueries(["ListUsers"]);
    },
  });

  return (
    <div
      // onClick={handleClick}
      className="
          w-full
          relative 
          flex
          h-full
          items-center 
          space-x-3 
          bg-white 
          p-3 
          hover:bg-neutral-100
          transition
          cursor-pointer

          group
        "
    >
      <Avatar user={data.user} />
      <div className="min-w-0 flex-1">
        <div className="focus:outline-none">
          <span className="absolute inset-0" aria-hidden="true" />
          <div className="flex  flex-col items-start mb-1">
            <div className="flex justify-start items-center">
              <p className="text-sm font-medium text-gray-900">
                {data.user.name}
              </p>
              {icon}
            </div>
            <p className="text-sm font-medium text-gray-500">
              {data.user.email}
            </p>
          </div>
        </div>
      </div>
      <div>
        {(isModerator && data.role === "ADMIN") ||
          (isModerator && (
            <div>
              <div>
                <Button
                  onClick={() => onOpen("editUser", data)}
                  className={`${cn(
                    `
            absolute 
            bg-white 
            hover:bg-gray-100 
            drop-shadow-lg 
            shrink-0 h-10 w-10 
            p-0 top-4  mr-14 rounded-full right-0 hidden group-hover:flex`
                  )}`}
                >
                  <Pen size={16} stroke="black" />
                </Button>
              </div>

              <div>
                <Button
                  onClick={() => mutationDelete.mutate(data.userId)}
                  className={cn(
                    `
                    absolute 
                  bg-white 
            hover:bg-gray-100 
            drop-shadow-lg 
            shrink-0 h-10 w-10 
            p-0 top-4  mr-2 rounded-full right-0 hidden group-hover:flex`,
                    loadingId && "group-hover:hidden"
                  )}
                >
                  <Trash2 size={16} stroke="red" />
                </Button>
              </div>
            </div>
          ))}
      </div>
      {loadingId === data.userId && (
        <Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
      )}
    </div>
  );
};

export default UserBox;
