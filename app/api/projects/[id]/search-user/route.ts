import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // sesuaikan dengan lokasi file prisma kamu
import { auth } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const { projectId } = await params;
  const search = req.nextUrl.searchParams.get("query")?.toLowerCase() || "";

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }
    const users = await prisma.user.findMany({
      where: {
        email: {
          contains: search,
          mode: "insensitive", // case-insensitive search
        },
        memberships: {
          none: {
            projectId,
          },
        },
      },
      select: {
        id: true,
        email: true,
      },
      take: 10, // optional: batasi hasil
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Search user error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
