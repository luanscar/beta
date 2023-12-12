import NavLinks from "@/components/sidebar/nav-links";

export default async function CompanyIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { companyId: string };
}) {
  return (
    <>
      <div className="h-full">
        <div className="hidden gap-y-1 md:flex p-1 h-full z-30 flex-col fixed inset-y-0">
          <NavLinks companyId={params.companyId} />
        </div>
        <main className="md:pl-[136px] h-full">{children}</main>
      </div>
    </>
  );
}
