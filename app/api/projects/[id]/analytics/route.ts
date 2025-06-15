import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type TaskStatus = "todo" | "in-progress" | "done";

type StatusCount = {
  total: number;
  unassigned: number;
} & {
  [key in TaskStatus]: number;
};

type Task = {
  id: string;
  status: TaskStatus;
  assigneeId: string | null;
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
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

    const tasks = (await prisma.task.findMany({
      where: { projectId: id },
      select: {
        id: true,
        status: true,
        assigneeId: true,
      },
    })) as Task[];

    const statusCount = tasks.reduce(
      (acc: StatusCount, task: Task) => {
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
      } satisfies StatusCount
    );

    return NextResponse.json(
      {
        success: true,
        message: "Analytics fetched successfully",
        data: statusCount,
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
