import { db } from "./db";
import { getCurrentSession } from "./session";

export const currentUser = async () => {
  const id = await getCurrentSession();

  if (!id) {
    return null;
  }

  const user = await db.user.findUnique({
    where: {
      id,
    },
  });

  return user;
};
