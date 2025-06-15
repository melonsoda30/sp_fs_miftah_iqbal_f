import { z } from "zod";

export const authSchema = z.object({
  email: z
    .string()
    .email({ message: "email invalid" })
    .min(1, { message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export const projectSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.string().min(1, "Status is required"),
  assigneeId: z.string().min(1, "Assignee is required"),
});
