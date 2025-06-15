"use client";
import { signOut } from "next-auth/react";

import { Button } from "./button";

export function SignoutButton() {
  return (
    <Button size="sm" onClick={() => signOut()}>
      Logout
    </Button>
  );
}
