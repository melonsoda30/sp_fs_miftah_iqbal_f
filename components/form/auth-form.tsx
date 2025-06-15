"use client";
import { login } from "@/lib/login";
import { register } from "@/lib/register";
import React, { useActionState } from "react";
import { Field } from "../ui/Field";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { FormActionState } from "@/types/auth";
import { toast } from "sonner";

interface AuthProps {
  type: "login" | "register";
}

export function AuthForm({ type }: AuthProps) {
  const router = useRouter();
  const handleSubmit = async (
    _: FormActionState,
    formData: FormData
  ): Promise<FormActionState> => {
    try {
      const data = await (type === "login"
        ? login(formData)
        : register(formData));

      if (data.success) {
        toast.success(
          type === "login" ? "Login successful" : "Registration successful"
        );
        router.push(type === "login" ? "/dashboard" : "/login");
      }
      return data;
    } catch (e) {
      console.error("login error", e);
      toast.error("Unexpected error occurred. Please try again.");
      return {
        success: false,
        errors: { general: ["An unexpected error occurred."] },
      };
    }
  };

  const [state, action, isPending] = useActionState(handleSubmit, {
    success: false,
    errors: {},
  });
  return (
    <>
      {state?.errors?.general?.map((err, i) => (
        <p key={i} className="text-sm text-red-500">
          {err}
        </p>
      ))}
      <form action={action} className="flex flex-col gap-4 w-full max-w-sm">
        <Field
          type="email"
          name="email"
          label="Email"
          placeholder="Email"
          errors={state.errors?.email}
        />
        <Field
          type="password"
          name="password"
          label="Password"
          placeholder="Password"
          errors={state.errors?.password}
        />
        <Button type="submit" disabled={isPending}>
          {type === "login" ? "Login" : "Register"}
        </Button>
      </form>
    </>
  );
}
