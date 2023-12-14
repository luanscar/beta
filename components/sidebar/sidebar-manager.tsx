import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import { Separator } from "../ui/separator";
import { Searchbar } from "./searchbar";
import { SidebarHeader } from "./sidebar-header";

interface SidebarManagerProps {
  children: React.ReactNode;
  companyId: string;
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="h-4 w-4 mr-2 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500" />,
};

const SidebarManager: React.FC<SidebarManagerProps> = async ({
  children,
  companyId,
}) => {
  const user = await currentUser();

  if (!user) {
    return redirect("/");
  }

  const company = await db.company.findUnique({
    where: {
      id: companyId,
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!company) {
    return redirect("/");
  }

  const members = company?.members.filter(
    (member) => member.userId !== user.id
  );
  const role = company?.members.find(
    (member) => member.userId === user.id
  )?.role;

  return (
    <div className="flex flex-col px2 h-full border text-primary w-full">
      <SidebarHeader company={company} role={role} />
      <div className="mt-2 mb-2 px-2">
        <Searchbar
          data={[
            {
              label: "Members",
              type: "member",
              data: members?.map((member) => ({
                id: member.id,
                name: member.user.name,
                icon: roleIconMap[member.role],
              })),
            },
          ]}
        />
      </div>
      <Separator className="px-10" />

      <main className="h-full">{children}</main>
    </div>
  );
};

export default SidebarManager;
