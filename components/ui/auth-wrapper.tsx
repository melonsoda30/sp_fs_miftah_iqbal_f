import { auth } from "@/lib/auth";
import { checkProjectAccess } from "@/lib/auth-util";
import { redirect } from "next/navigation";

export async function AuthWrapper({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const session = await auth();
  if (!session) {
    return redirect("/login");
  }

  const hasAccess = await checkProjectAccess(params.id, session?.user?.id);
  if (!hasAccess) {
    return redirect("/dashboard");
  }

  return <>{children}</>;
}
