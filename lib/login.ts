import { signIn } from "next-auth/react";
import { authSchema } from "./validation";
import { toast } from "sonner";
import { FormActionState } from "@/types/auth";

export async function login(formData: FormData): Promise<FormActionState> {
  try {
    const payload = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const validate = authSchema.safeParse(payload);

    if (!validate.success) {
      return {
        success: false,
        errors: validate.error.flatten().fieldErrors,
      };
    }

    const response = await signIn("credentials", {
      ...payload,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    if (response?.error) {
      const credentialsError =
        response.error === "CredentialsSignin"
          ? {
              email: ["Invalid email"],
              password: ["Invalid password"],
            }
          : {};
      return {
        success: false,
        errors: {
          ...credentialsError,
        },
      };
    }

    return {
      success: true,
    };
  } catch (e) {
    console.error("login error", e);
    toast.error("Unexpected error occurred. Please try again.");
    return {
      success: false,
      errors: {
        email: ["Unexpected error occurred. Please try again."],
      },
    };
  }
}
