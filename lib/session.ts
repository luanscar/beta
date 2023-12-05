
import { getServerSession } from "next-auth"

import { authOptions } from "./auth"

export async function getCurrentSession(){
    const session = await getServerSession(authOptions)
    return session?.user.id
}