import SidebarManager from "@/components/sidebar/sidebar-manager";
import { Users } from "@/components/user/users";
import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function UsersLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { companyId: string };
}) {
  const user = await currentUser();

  if (!user) {
    return redirect("/");
  }

  const company = await db.company.findUnique({
    where: {
      id: params.companyId,
    },
    include: {
      members: {
        include: {
          user: true,
        },
      },
    },
  });

  const members = company?.members.filter(
    (member) => member.userId !== user.id
  );

  if (!company) {
    return redirect("/");
  }

  const role = company.members.find(
    (member) => member.userId === user.id
  )?.role;

  return (
    <>
      <div className="h-full">
        <div className="hidden md:flex h-full w-96 z-20 flex-col fixed inset-y-0">
          <SidebarManager companyId={params.companyId}>
            <Users
              apiUrl="/api/company/user"
              paramKey="companyId"
              paramValue={company.id}
              queryKey="ListUsers"
              role={role}
            />
            {/* <UserList
              apiUrl="/api/company/user"
              chatId={company.id}
              paramKey="companyId"
              paramValue={params.companyId}
            /> */}
          </SidebarManager>
        </div>
        <main className="h-full md:pl-96">{children}</main>
      </div>
    </>
  );
}
