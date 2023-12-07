import NavLinks from "@/components/sidebar/nav-links";

export default function CompanyIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { companyId: string };
}) {
  console.log(params.companyId);
  return (
    <div className="flex h-screen relative flex-col md:flex-row md:overflow-hidden">
      <div className="flex flex-col items-start  gap-2 p-2 ">
        <NavLinks companyId={params.companyId} />
      </div>
      {/* flex-grow md:mt-0 flex-1 w-full md:overflow-y-auto max-w-7xl mx-auto */}
      <div className="flex flex-col">
        Sidebar
        {/* parei aquii */}
        {children}
      </div>
    </div>
  );
}
