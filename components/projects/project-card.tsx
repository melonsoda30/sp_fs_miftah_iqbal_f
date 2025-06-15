import { Card, CardDescription, CardFooter, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Edit, SquareArrowOutUpRight } from "lucide-react";

import { CustomAvatar } from "../ui/custom-avatar";
import { ProjectForm } from "../form/project-form";
import { ProjectWithRelations } from "@/types/db";
import Link from "next/link";

export function ProjectCard({ project }: { project: ProjectWithRelations }) {
  console.log(project);
  return (
    <Card className={"relative transition-all duration-200 w-full max-w-full "}>
      <CardHeader className="pb-3">
        <div className="flex flex-row justify-between items-center min-w-0">
          <span className="text-sm text-foreground/60 flex-shrink-0">
            {project.createdAt && new Date(project.createdAt).toDateString()}
          </span>
          <ProjectForm id={project.id} name={project.name}>
            <Button
              variant="ghost"
              size="sm"
              className="z-10 relative flex-shrink-0 ml-2"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </ProjectForm>
        </div>
        <h5
          className="text-2xl font-semibold min-w-0 break-words hyphens-auto"
          title={project.name}
        >
          <span className="block overflow-hidden text-ellipsis whitespace-nowrap">
            {project.name}
          </span>
        </h5>
      </CardHeader>

      <CardDescription className="px-6 pb-4">
        <CustomAvatar data={project.memberships.map((m) => m.user)} />
      </CardDescription>

      <CardFooter className="flex gap-2 items-center justify-between pt-0 min-w-0">
        <div className="flex gap-2">
          <Badge
            variant="destructive"
            className="text-xs flex-shrink-0 max-w-[120px]"
            title="To Do"
          >
            <span className="truncate">
              {project.tasks.filter((t) => t.status === "todo").length}
            </span>
          </Badge>
          <Badge
            variant="secondary"
            className="text-xs flex-shrink-0 max-w-[120px]"
            title="in Progress"
          >
            <span className="truncate">
              {project.tasks.filter((t) => t.status === "in-progress").length}
            </span>
          </Badge>
          <Badge className="text-xs flex-shrink-0 max-w-[120px]" title="Done">
            <span className="truncate">
              {project.tasks.filter((t) => t.status === "done").length}
            </span>
          </Badge>
        </div>

        <Link title="View Project" href={`/project/${project.id}`}>
          <Button variant="secondary" size="sm">
            <SquareArrowOutUpRight />
          </Button>
        </Link>
        {/* <GripVertical className="h-4 w-4 text-muted-foreground opacity-50 flex-shrink-0 ml-2" /> */}
      </CardFooter>
    </Card>
  );
}
