import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authSchema } from "./validation";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
  }
  interface Session {
    user: {
      id: string;
      email: string;
    };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const validate = authSchema.safeParse(credentials);
        if (!validate.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        console.log("user", user.password);
        console.log("password", credentials.password);
        console.log(passwordMatch);

        if (!passwordMatch) {
          return null;
        }

        console.log(user);

        return {
          id: user.id,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Tambahkan id ke token
        token.email = user.email; // Tambahkan email ke token
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string; // Tambahkan id ke session.user
        session.user.email = token.email as string; // Tambahkan email ke session.user
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    // signUp: "/register",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.AUTH_SECRET,
});
