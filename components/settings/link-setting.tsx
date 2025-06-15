"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { Settings } from "lucide-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";

export function LinkSetting({ ownerId }: { ownerId: string | undefined }) {
  const { data } = useSession();
  const { id } = useParams();
  console.log(data?.user?.id !== ownerId, data?.user?.id, ownerId);
  if (data?.user?.id !== ownerId) {
    return null;
  }

  return (
    <Link title="View Project" href={`/project/${id}/settings`}>
      <Button variant="secondary" size="sm">
        <Settings /> Settings
      </Button>
    </Link>
  );
}
