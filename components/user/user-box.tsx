"use client";
import { Member, MemberRole, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Avatar from "../avatar";
import { Pen, ShieldAlert, ShieldCheck, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { ModalType, useModal } from "@/hooks/use-modal-store";

interface UserBoxProps {
  data: Member & { user: User };
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
};

const UserBox: React.FC<UserBoxProps> = ({ data }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const icon = roleIconMap[data.role];
  const { onOpen } = useModal();

  //   const handleClick = useCallback(() => {
  //     setIsLoading(true);

  //     axios
  //       .post("/api/conversations", { userId: data.id })
  //       .then((data) => {
  //         router.push(`/conversations/${data.data.id}`);
  //       })
  //       .finally(() => setIsLoading(false));
  //   }, [data, router]);

  return (
    <>
      <div
        // onClick={handleClick}
        className="
          w-full 
          relative 
          flex 
          items-center 
          space-x-3 
          bg-white 
          p-3 
          hover:bg-neutral-100
          rounded-lg
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
          <Button
            onClick={() => onOpen("editUser", data)}
            className="
            absolute 
            bg-white 
            hover:bg-gray-100 
            drop-shadow-lg 
            shrink-0 h-10 w-10 
            p-0 top-4 mr-14 rounded-full right-0 hidden group-hover:flex"
          >
            <Pen size={16} stroke="black" />
          </Button>
          <Button
            // onClick={() => onDelete(data.profileId)}
            className="absolute bg-white hover:bg-gray-100 drop-shadow-lg shrink-0 h-10 w-10 top-4 p-0 mr-2 rounded-full right-0 hidden group-hover:flex"
          >
            <Trash2 size={16} stroke="red" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default UserBox;
