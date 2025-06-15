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
        {
          success: false,
          message: "Validation failed",
          errors: validate.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const isUserExist = await prisma.user.findUnique({
      where: { email },
    });

    if (isUserExist) {
      return NextResponse.json(
        {
          success: false,
          message: "Email already exist",
          errors: { email: ["email already exist"] },
        },
        { status: 400 }
      );
    }

    const salt = 10;
    const hashedPassword = await bcrypt.hashSync(password, salt);

    const addUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          user: addUser,
        },
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("register error: ", e);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
