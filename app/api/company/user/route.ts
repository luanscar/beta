import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { MembersWithUsers } from "@/types/db-types";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

const USERS_BATCH = 10;

export async function GET(req: NextRequest) {
  try {
    const loggedUser = await currentUser();

    if (!loggedUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");

    const companyId = searchParams.get("companyId");

    if (!companyId) {
      return new NextResponse("Conversation ID missing", { status: 400 });
    }

    let membersWithUsers: MembersWithUsers[] = [];


    if (cursor) {
       membersWithUsers = await db.member.findMany({
         where: {
           companyId,
           NOT:{
            userId: loggedUser.id
           }
          },
          include: {
            user: true,
          },
          take: USERS_BATCH,
          skip: 1,
          cursor: {
              id: cursor
             },
          
          orderBy: {
            user: {
              name: "asc"
            }
          },
          
      });
    } else {
       membersWithUsers = await db.member.findMany({
        take: USERS_BATCH,
        where: {
          companyId,
          NOT:{
            userId: loggedUser.id
           }
        },
        include: {
          user: true,
        },
        orderBy: {
            user: {
              name: "asc"
            }
          },
      });
    }
    let nextCursor = null;

    // console.log(membersWithUsers)


    if (membersWithUsers.length === USERS_BATCH) {
      nextCursor = membersWithUsers[USERS_BATCH - 1].id;
    }

    return NextResponse.json({
      items: membersWithUsers,
      nextCursor,
    });
  } catch (error) {
    console.log("[USERS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { companyId: string } }
) {
  try {
    const { name, email, role } = await req.json();

    const loggedUser = await currentUser();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const companyId = searchParams.get("companyId");

    if (!loggedUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!companyId) {
      return new NextResponse("Company ID is missing", { status: 401 });
    }

    const isUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (isUser) {
      return NextResponse.json(
        {
          error:
            "Ops! Parece que já existe uma conta com este endereço de e-mail.",
        },
        { status: 400 }
      );
    }

    const newUser = await db.user.create({
      data: {
        name,
        email,
        image: "https://avatar.iran.liara.run/public",
        userToken: uuidv4(),
        members: {
          create: {
            companyId: companyId,
            role,
          },
        },
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.log("[CREATE_USER_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
