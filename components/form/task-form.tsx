"use client";
import React, { useState } from "react";
import { Field } from "../ui/Field";
import { Button } from "../ui/button";
import { createTaskSchema } from "@/lib/validation";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { ApiResponse } from "@/types/api";
import { Membership, Task } from "@prisma/client";
import { UserSummary } from "@/types/db";
import { toast } from "sonner";

interface MembershipWithUser extends Membership {
  user: UserSummary;
}

type ErrorState = {
  title?: string[];
  description?: string[];
  status?: string[];
  assigneeId?: string[];
};

type TaskSummary = Omit<Task, "id" | "projectId" | "createdAt" | "updatedAt">;

interface TaskFormProps {
  children?: React.ReactNode;
  initialValues?: TaskSummary;
  type: "create" | "edit";
}

export function TaskForm({ children, initialValues, type }: TaskFormProps) {
  const [errors, setErrors] = useState<ErrorState>({});
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { id } = useParams();
  const [form, setForm] = useState<TaskSummary>(
    initialValues ?? {
      title: "",
      description: "",
      status: "todo",
      assigneeId: "",
    }
  );

  const { mutate } = useSWR(`/api/projects/${id}/task`, fetcher);

  const { data: member } = useSWR<
    ApiResponse<MembershipWithUser[] | undefined>
  >(`/api/projects/${id}/membership`, fetcher);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      setLoading(true);
      e.preventDefault();

      const validate = createTaskSchema.safeParse(form);

      if (!validate.success) {
        setErrors(validate.error.flatten().fieldErrors);
        setLoading(false);
        return;
      }

      await fetch(`/api/projects/${id}/task`, {
        method: type === "create" ? "POST" : "PATCH",
        body: JSON.stringify(form),
        headers: {
          "Content-Type": "application/json",
        },
      });

      // const json = await response.json();

      toast.success("Task created successfully");

      await mutate();
      setLoading(false);
      setOpen(false);
    } catch (e) {
      console.error("login error", e);
      setLoading(false);
      toast.error("Unexpected error occurred. Please try again.");
    }
  };

  const handleFormChange = (key: keyof typeof form, value: string) => {
    console.log(key, value);
    setForm((prevForm) => ({ ...prevForm, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            {type === "create" ? "Create New" : "Update"} Task
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full max-w-sm"
        >
          <Field
            label="Title"
            type="text"
            name="title"
            placeholder="title"
            errors={errors?.title}
            value={form.title ?? ""}
            onChange={(e) => handleFormChange("title", e.target.value)}
          />
          <Field
            label="Description"
            type="textarea"
            name="description"
            placeholder="description"
            errors={errors?.description}
            value={form.description ?? ""}
            onChange={(e) => handleFormChange("description", e.target.value)}
          />
          <Field
            label="Status"
            type="select"
            name="status"
            placeholder="status"
            errors={errors?.status}
            value={form.status}
            onValueChange={(value: string) => handleFormChange("status", value)}
            dropdown={[
              { value: "todo", label: "Todo" },
              { value: "in-progress", label: "In Progress" },
              { value: "done", label: "Done" },
            ]}
          />
          <Field
            label="Assignee"
            type="select"
            name="assigneeId"
            placeholder="assignee"
            errors={errors?.assigneeId}
            value={form.assigneeId ?? ""}
            onValueChange={(value: string) =>
              handleFormChange("assigneeId", value)
            }
            dropdown={
              member?.data?.map((dropdown) => ({
                value: dropdown.user.id,
                label: dropdown.user.email,
              })) ?? []
            }
          />

          <Button type="submit" disabled={loading}>
            {loading ? "submitting" : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
