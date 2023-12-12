import { CreateCompanyModal } from "@/components/modals/create-company-modal";
import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const SetupPage = async () => {
  const user = await currentUser();

  if (!user) {
    return redirect("/");
  }

  const isCompanyMember = await db.company.findFirst({
    where: {
      members: {
        some: {
          userId: user.id,
        },
      },
    },
  });

  if (isCompanyMember) {
    return redirect(`/${isCompanyMember.id}/dashboard`);
  }

  return <CreateCompanyModal />;
};

export default SetupPage;
