import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
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
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        memberships: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: project,
        message: "Project fetched successfully",
      },
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
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
    const { id } = params;
    const body = await req.json();
    const { name } = body as { name: string };

    const updateProject = await prisma.project.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });
    return NextResponse.json(
      {
        data: updateProject,
        success: true,
        message: "Project updated successfully",
      },
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
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

    await prisma.task.deleteMany({
      where: {
        projectId: id,
      },
    });

    await prisma.membership.deleteMany({
      where: {
        projectId: id,
      },
    });

    const deleteProject = await prisma.project.delete({
      where: {
        id,
      },
      include: { memberships: true },
    });
    console.log(deleteProject);
    return NextResponse.json(
      {
        success: true,
        message: "Project deleted successfully",
        data: {},
      },
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
