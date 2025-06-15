import { DeleteProject } from "@/components/settings/delete-project";
import { ListMembers } from "@/components/settings/list-members";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import InputFetch from "@/components/ui/input-fetch";
import { auth } from "@/lib/auth";
import { checkIsOwner } from "@/lib/auth-util";
import { redirect } from "next/navigation";

export default async function ProjectSettings({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return redirect("/login");
  }

  const { id } = await params;
  const hasAccess = await checkIsOwner(id, session?.user?.id);
  if (!hasAccess) {
    return redirect("/dashboard");
  }

  return (
    <div className="relative w-full h-full flex flex-col gap-8 justify-center items-center">
      <Card className="w-full max-w-3xl mt-8">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Project Members</CardTitle>
            <CardDescription>
              Manage who has access to this project
            </CardDescription>
          </div>

          <InputFetch />
        </CardHeader>
        <CardContent>
          <ListMembers />
        </CardContent>
      </Card>

      <DeleteProject />
    </div>
  );
}
