import { NextResponse } from "next/server";

import { currentUser } from "@/lib/current-user";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { faker } from "@faker-js/faker";

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const slug = name.trim().replaceAll(" ", "-").toLowerCase();
    
    const newCompany = await db.company.create({
      data: {
        userId: user.id,
        name,
        image: faker.image.avatarGitHub(),
        slug: slug,
        channels: {
          create: [
            {
              name: name, userId: user.id
            }
          ]
        },
        members: {
          create: [
            {
              userId: user.id,
              role: MemberRole.ADMIN
            }
          ]
        }
     
      }
    });

    return NextResponse.json(newCompany);
  } catch (error) {
    console.log("[COMPANY_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
