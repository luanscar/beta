import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { memberId: string; companyId: string; } }
) {
  try {
    const user = await currentUser();
    const { name, email, role } = await req.json();

    const { searchParams } = new URL(req.url);

    const userId = searchParams.get("userId");

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if(!userId){
      return new NextResponse("Company ID missing", { status: 400 });
    }
    if(!params.memberId){
      return new NextResponse("Member ID missing", { status: 400 });
    }
   
    const updateMember = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        email,
        image: "https://picsum.photos/200/300",
        members: {
          update: {
            where: {
              id: params.memberId
            },
            data: {
              role
            }
          }
        }
      }
    });

    return NextResponse.json(updateMember, { status: 200 });
  } catch (error) {
    console.log("[CREATE_USER_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
