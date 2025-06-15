import { ProjectDetail } from "@/components/projects/project-detail";
import { auth } from "@/lib/auth";
import { checkProjectAccess } from "@/lib/auth-util";
import { redirect } from "next/navigation";

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session) {
    return redirect("/login");
  }
  const { id } = await params;
  const hasAccess = await checkProjectAccess(id, session?.user?.id);
  console.log(id);
  if (!hasAccess) {
    return redirect("/dashboard");
  }

  return (
    <>
      <ProjectDetail />
    </>
  );
}
