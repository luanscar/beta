import { db } from "./db";
import { getCurrentSession } from "./session";

export const currentUser = async () => {
  const session = await getCurrentSession();

  if (!session?.user.id) {
    return null;
  }

  const user = await db.user.findUnique({
    where: {
      id: session?.user.id
    },
  });

  return user;
};
