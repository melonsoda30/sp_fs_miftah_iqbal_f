"use client";

import { fetcher } from "@/lib/fetcher";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { CustomAvatar } from "../ui/custom-avatar";
import { Button } from "../ui/button";
import { Loader2, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { Membership } from "@prisma/client";
import { UserSummary } from "@/types/db";
import { toast } from "sonner";

interface MembershipWithUser extends Membership {
  user: UserSummary;
}
interface MembershipWithUserProps {
  data: MembershipWithUser[];
}

export function ListMembers() {
  const { id } = useParams();
  const { data, mutate, isLoading } = useSWR<
    MembershipWithUserProps | undefined
  >(`/api/projects/${id}/membership`, fetcher);
  const { data: detail } = useSWR(`/api/projects/${id}`, fetcher);

  const deleteMembers = async (memberId: string) => {
    try {
      const response = await fetch(`/api/projects/${id}/membership`, {
        method: "DELETE",
        body: JSON.stringify({ userId: memberId }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await response.json();
      if (!json.success) {
        toast.error("Failed to delete member");
        // throw new Error(`HTTP error! status: ${response.status}`);
      }
      await mutate();
      console.log(response);
    } catch (error) {
      console.error("Delete member error:", error);
      toast.error("Failed to delete member");
    }
  };

  return (
    <div className="space-y-4">
      {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
      {data?.data.map((member) => (
        <div
          key={member.id}
          className="flex items-center justify-between p-4 rounded-lg border bg-gray-50/50"
        >
          <div className="flex items-center gap-3">
            <CustomAvatar data={[member.user]} />
            <div>
              <p className="font-medium text-gray-900">{member.user.email}</p>
              {/* <p className="text-sm text-gray-500">{member.email}</p> */}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant={
                detail?.data?.ownerId === member.userId
                  ? "default"
                  : "secondary"
              }
            >
              {detail?.data?.ownerId === member.userId ? "Owner" : "Member"}
            </Badge>
            {detail?.data?.ownerId !== member.userId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteMembers(member.userId)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
