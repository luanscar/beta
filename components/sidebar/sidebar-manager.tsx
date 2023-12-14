import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import { SidebarHeader } from "./sidebar-header";

interface SidebarManagerProps {
  children: React.ReactNode;
  companyId: string;
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
    <div className="flex flex-col h-full text-primary w-full">
      <SidebarHeader company={company} role={role} />

      <main className="h-full">{children}</main>
    </div>
  );
};

export default SidebarManager;
