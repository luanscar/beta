import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import { SidebarHeader } from "./sidebar-header";

interface SidebarManagerProps {
  companyId: string;
  children: React.ReactNode;
}

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

  const role = company?.members.find(
    (member) => member.userId === user.id
  )?.role;

  return (
    <div className="hidden md:border-l md:border-r md:flex flex-col w-full h-full ">
      <SidebarHeader company={company} role={role} />
      {children}
    </div>
  );
};

export default SidebarManager;
