import { TabPanel } from "@/components/sidebar/TabPanel";
import SidebarManager from "@/components/sidebar/sidebar-manager";

export default function UsersLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { companyId: string };
}) {
  return (
    <>
      <SidebarManager companyId={params.companyId}>
        <TabPanel />
      </SidebarManager>
      <div className="">{children}</div>
    </>
  );
}
