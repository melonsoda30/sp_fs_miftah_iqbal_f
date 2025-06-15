"use client";
import { projectSchema } from "@/lib/validation";
import { useState } from "react";
import { Button } from "../ui/button";
import { Field } from "../ui/Field";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { toast } from "sonner";

export function ProjectForm({
  id,
  name: data,
  children,
}: {
  id?: string;
  name?: string;
  children?: React.ReactNode;
}) {
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(data ?? "");
  const [open, setOpen] = useState(false);

  const { mutate } = useSWR("/api/projects", fetcher);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);

      const validate = projectSchema.safeParse({ name });
      if (!validate.success) {
        setErrors(validate.error.flatten().fieldErrors);
        setLoading(false);
        return;
      }

      const url = id ? `/api/projects/${id}` : "/api/projects";
      const message = id
        ? "Project updated successfully"
        : "Project created successfully";

      const response = await fetch(url, {
        method: id ? "PATCH" : "POST",
        body: JSON.stringify({ name }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      if (!json.success) {
        toast.error(json.message);
        return;
      }

      await mutate();
      setOpen(false);
      setLoading(false);
      setName("");
      toast.success(message);
    } catch (e) {
      console.error("login error", e);
      setLoading(false);
      toast.error("Unexpected error occurred. Please try again.");
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{!id ? "Create New" : "Update"} Project</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 w-full max-w-sm"
        >
          <Field
            label="Name"
            name="name"
            type="text"
            placeholder="your project name..."
            errors={errors?.name}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Button disabled={loading} type="submit">
            {loading ? "Submitting" : "Submit"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
