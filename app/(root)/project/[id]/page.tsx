import { auth } from "@/lib/auth";
import { checkProjectAccess } from "@/lib/auth-util";
import { redirect } from "next/navigation";
import { ProjectDetail } from "@/components/projects/project-detail";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: PageProps) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  // Need to await params since it's a Promise
  const { id: projectId } = await params;

  const hasAccess = await checkProjectAccess(projectId, session.user?.id);
  if (!hasAccess) {
    redirect("/dashboard");
  }

  return <ProjectDetail />;
}
