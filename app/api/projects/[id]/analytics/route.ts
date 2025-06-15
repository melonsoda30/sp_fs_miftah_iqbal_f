import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

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
    const tasks = await prisma.task.findMany({
      where: { projectId: id },
      select: {
        id: true,
        status: true,
        assigneeId: true,
      },
    });

    type TaskStatus = "todo" | "in-progress" | "done";
    const statusCount = tasks.reduce(
      (acc, task) => {
        acc.total += 1;
        acc[task.status as TaskStatus] += 1;
        if (!task.assigneeId) acc.unassigned += 1;
        return acc;
      },
      {
        total: 0,
        todo: 0,
        "in-progress": 0,
        done: 0,
        unassigned: 0,
      }
    );

    // Task count per assignee
    // const taskDistribution: Record<string, number> = {};
    // for (const task of tasks) {
    //   if (task.assigneeId) {
    //     taskDistribution[task.assigneeId] =
    //       (taskDistribution[task.assigneeId] || 0) + 1;
    //   }
    // }

    return NextResponse.json(
      {
        success: true,
        message: "Analytics fetched successfully",
        data: {
          ...statusCount,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("analytics error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch analytics",
      },
      { status: 500 }
    );
  }
}
