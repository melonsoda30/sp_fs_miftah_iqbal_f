import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _: Request,
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

    const projectExists = await prisma.project.findUnique({
      where: { id },
    });

    if (!projectExists) {
      return NextResponse.json(
        { success: false, message: "Project not found" },
        { status: 400 }
      );
    }

    const tasks = await prisma.task.findMany({
      where: { projectId: id },
      include: {
        assignee: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ data: tasks, success: true, message: "ok" });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { message: "Failed to fetch tasks", success: false },
      { status: 500 }
    );
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
    const body = await req.json();
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message: "Project not found",
        },
        { status: 400 }
      );
    }

    const userExist = await prisma.user.findUnique({
      where: { id: body.assigneeId },
    });

    if (!userExist)
      return NextResponse.json(
        {
          success: false,
          message: "Assignee not found",
        },
        { status: 400 }
      );

    const isMember = await prisma.membership.findFirst({
      where: {
        userId: body.assigneeId,
        projectId: id,
      },
    });

    if (!isMember) {
      return NextResponse.json(
        { error: "User is not a member of this project" },
        { status: 400 }
      );
    }

    const newTask = await prisma.task.create({
      data: {
        title: body.title,
        description: body.description,
        status: body.status,
        assigneeId: body.assigneeId,
        projectId: id,
      },
    });

    return NextResponse.json(
      {
        data: newTask,
        success: true,
        message: "Task created successfully",
      },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
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
    const body = await req.json();
    const { taskId, title, description, status, assigneeId } = body;

    if (!taskId) {
      return NextResponse.json(
        { success: false, message: "Missing taskId" },
        {
          status: 400,
        }
      );
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(status && { status }),
        ...(assigneeId !== undefined && { assigneeId }), // bisa `null` juga
      },
    });

    return NextResponse.json(
      {
        data: updatedTask,
        success: true,
        message: "Task updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
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
    const body = await req.json();
    const { taskId } = body;

    if (!taskId) {
      return NextResponse.json(
        { success: false, message: "Missing taskId" },
        {
          status: 400,
        }
      );
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    return NextResponse.json(
      {
        data: {},
        success: true,
        message: "Task deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete task" },
      { status: 500 }
    );
  }
}
