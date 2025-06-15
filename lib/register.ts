import { FormActionState } from "@/types/auth";
import { authSchema } from "./validation";

export async function register(formData: FormData): Promise<FormActionState> {
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

    const response = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();

    return json;
  } catch (e) {
    console.error("/register POST:", e);
    return {
      success: false,
      errors: {
        general: ["Unexpected error occurred."],
      },
    };
  }
}
