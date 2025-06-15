"use client";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TaskForm } from "@/components/form/task-form";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { useParams } from "next/navigation";
import { DndContainer } from "@/components/dnd/dnd-container";
import { ChartPie, Loader2, Plus } from "lucide-react";
import { PieChart } from "@/components/chart/pie-chart";
import { ButtonExport } from "@/components/ui/button-export";
import { Project } from "@prisma/client";
import { MembershipWithUser, TaskWithAssigneeProps } from "@/types/db";
import { LinkSetting } from "../settings/link-setting";

interface TaskListProps {
  data: TaskWithAssigneeProps[];
}

interface ProjectWithMembershipProps extends Project {
  memberships: MembershipWithUser[];
}

interface ProjectDetailProps {
  data: ProjectWithMembershipProps;
  tasks: TaskListProps;
}
export function ProjectDetail() {
  const params = useParams();
  const id = params.id;

  const { data, isLoading } = useSWR<ProjectDetailProps | undefined>(
    `/api/projects/${id}`,
    fetcher
  );
  const { data: tasks } = useSWR<TaskListProps | undefined>(
    `/api/projects/${id}/task`,
    fetcher
  );
  if (isLoading)
    return <Loader2 className="ml-2 h-4 w-4 animate-spin opacity-50" />;
  return (
    <>
      <div className="w-full flex justify-between items-center p-2 border-b">
        <h5 className="text-md font-semibold">Project - {data?.data?.name}</h5>{" "}
        <div>
          <TaskForm type="create">
            <Button variant="secondary" size="sm">
              <Plus /> New Task
            </Button>
          </TaskForm>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm">
                <ChartPie /> Analytics
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Task analytics</DialogTitle>
              </DialogHeader>
              <PieChart />
            </DialogContent>
          </Dialog>
          <ButtonExport />
          <LinkSetting ownerId={data?.data?.ownerId} />
        </div>
      </div>
      <div className="h-full overflow-x-auto">
        <DndContainer task={tasks?.data ?? []} />
      </div>
    </>
  );
}
