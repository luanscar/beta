import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { companyId: string } }
) {
  try {
    const user = await currentUser();
    const { name, email, role } = await req.json();

    const { searchParams } = new URL(req.url);

    const companyId = searchParams.get("companyId");

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if(!companyId){
      return new NextResponse("Company ID missing", { status: 400 });
    }


    console.log(params.companyId);
  } catch (error) {
    console.log("[CREATE_USER_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
