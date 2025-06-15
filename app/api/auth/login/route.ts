import { prisma } from "@/lib/prisma";
import { authSchema } from "@/lib/validation";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

interface LoginRequest {
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: LoginRequest = await req.json();
    const { email, password } = body;
    const validate = authSchema.safeParse(body);
    if (!validate.success) {
      return NextResponse.json(
        { errors: validate.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        {
          errors: {
            password: ["Incorrect password or email"],
            email: ["Email not found"],
          },
          success: false,
          message: "Incorrect password or email",
        },
        { status: 400 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          errors: {
            password: ["Incorrect password or email"],
            email: ["Email not found"],
          },
          success: false,
          message: "Incorrect password or email",
        },
        { status: 400 }
      );
    }
  } catch (e) {
    console.error("/login POST: ", e);
    return NextResponse.json(
      { errors: "Internal server error" },
      { status: 500 }
    );
  }
}
