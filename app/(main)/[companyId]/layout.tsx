import { TabPanel } from "@/components/sidebar/TabPanel";
import NavLinks from "@/components/sidebar/nav-links";
import SidebarManager from "@/components/sidebar/sidebar-manager";

export default function MainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { companyId: string };
}) {
  return (
    <div className="flex h-screen relative flex-col md:flex-row md:overflow-hidden">
      <div className="flex flex-col items-center gap-2 p-2 ">
        <NavLinks companyId={params.companyId} />
      </div>
      <div className="w-96 flex flex-row lg:w-96 ">
        <SidebarManager companyId={params.companyId}>
          <TabPanel />
        </SidebarManager>
      </div>
      <div className="flex-grow md:mt-0 flex-1 w-full md:overflow-y-auto max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
}
