import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.userId) {
      return new NextResponse("Profile ID missing", { status: 400 });
    }

    const deleteUser = await db.user.delete({
      where: {
        id: params.userId,
      },
    });

    return NextResponse.json(deleteUser);
  } catch (error) {
    console.log("[USER_ID_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { memberId: string; userId: string } }
) {
  try {
    const user = await currentUser();
    const { name, email, role } = await req.json();

    const { searchParams } = new URL(req.url);

    const memberId = searchParams.get("memberId");

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!memberId) {
      return new NextResponse("Member ID missing", { status: 400 });
    }
    if (!params.userId) {
      return new NextResponse("User ID missing", { status: 400 });
    }

    const updateMember = await db.user.update({
      where: {
        id: params.userId,
      },
      data: {
        name,
        email,
        image: "https://picsum.photos/200/300",
        members: {
          update: {
            where: {
              id: memberId,
            },
            data: {
              role,
            },
          },
        },
      },
    });

    return NextResponse.json({});
  } catch (error) {
    console.log("[CREATE_USER_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
