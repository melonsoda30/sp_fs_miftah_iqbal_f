import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }

    const member = await prisma.membership.findMany({
      where: { projectId: id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: member,
        message: "Member fetched successfully",
      },
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    const body: Promise<{ userId: string }> = await req.json();
    const { userId } = await body;
    const { id } = await params;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "id not found" },
        { status: 400 }
      );
    }

    const userExist = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExist) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 400 }
      );
    }

    const userAlreadyMember = await prisma.membership.findFirst({
      where: {
        userId,
        projectId: id,
      },
    });

    if (userAlreadyMember) {
      return NextResponse.json(
        { success: false, message: "User already member" },
        { status: 400 }
      );
    }

    const addMember = await prisma.membership.create({
      data: {
        userId,
        projectId: id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          ...addMember,
        },
        message: "Member added successfully",
      },
      { status: 200 }
    );
  } catch (e) {
    console.log("error add member", e);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body: Promise<{ userId: string }> = await req.json();
    const { userId } = await body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 404 }
      );
    }
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID not found" },
        { status: 400 }
      );
    }

    const userExist = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExist) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 400 }
      );
    }

    const userAlreadyMember = await prisma.membership.findFirst({
      where: {
        userId,
        projectId: id,
      },
    });

    if (!userAlreadyMember) {
      return NextResponse.json(
        { success: false, message: "User not member" },
        { status: 400 }
      );
    }

    await prisma.membership.delete({
      where: {
        userId_projectId: {
          userId,
          projectId: id,
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {},
        message: "Member deleted successfully",
      },
      { status: 200 }
    );
  } catch (e) {
    console.log("error add member", e);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
