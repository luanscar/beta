import SidebarManager from "@/components/sidebar/sidebar-manager";

export default function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { companyId: string };
}) {
  return (
    <>
      <div className="h-full">
        <div className="hidden md:flex h-full w-96 z-20 flex-col fixed inset-y-0">
          <SidebarManager companyId={params.companyId}>
            Component
          </SidebarManager>
        </div>
        <main className="h-full md:pl-96">{children}</main>
      </div>
    </>
  );
}
