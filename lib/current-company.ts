import { db } from "./db";
import { getCurrentSession } from "./session";

export const currentCompany = async () => {
  const {...session} = await getCurrentSession();

  if (!session.user.id) {
    return null;
  }

  const companyByUser = await db.user.findUnique({
    where: {
      id: session.user.id
    },
    select: {
        companies: true
    }
  });

  return {...companyByUser};
};
