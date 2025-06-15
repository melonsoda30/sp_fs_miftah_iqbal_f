import { ProjectForm } from "@/components/form/project-form";
import { ProjectList } from "@/components/projects/project-list";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const session = auth();
  if (!session) {
    return redirect("/login");
  }

  return (
    <>
      <div className="w-full flex justify-between items-center p-2 border-b">
        <h5 className="text-md font-semibold">Dashboard</h5>{" "}
        <div>
          <ProjectForm>
            <Button variant="ghost" size="sm">
              + New Project
            </Button>
          </ProjectForm>
        </div>
      </div>
      <div className="p-4">
        <h5 className="text-md font-semibold tracking-wider mb-4">Projects</h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  lg:grid-cols-4 gap-12">
          <ProjectList />
        </div>
      </div>
    </>
  );
}
