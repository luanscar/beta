import SidebarManager from "@/components/sidebar/sidebar-manager";
import UserList from "@/components/user/user-list";
import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";

export default async function UsersLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { companyId: string };
}) {
  const user = await currentUser();
  // const members = await db.company.findMany({
  //   where: {
  //     id: params.companyId,
  //   },
  //   include: {
  //     members: {
  //       where: {
  //         NOT: {
  //           userId: user?.id,
  //         },
  //       },
  //     },
  //   },
  // });

  const membersWithUsers = await db.member.findMany({
    where: {
      companyId: params.companyId,
      NOT: {
        userId: user?.id,
      },
    },
    include: {
      user: true,
    },
  });

  return (
    <>
      <SidebarManager companyId={params.companyId}>
        <UserList membersWithUsers={membersWithUsers} />
      </SidebarManager>
      <div className="">{children}</div>
    </>
  );
}
