"use client";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import { ProjectCard } from "./project-card";
import { ProjectWithRelations } from "@/types/db";
import { Loader2 } from "lucide-react";

interface ProjectListProps {
  data: ProjectWithRelations[];
}

export function ProjectList() {
  const { data, isLoading } = useSWR<ProjectListProps | undefined>(
    "/api/projects",
    fetcher
  );
  console.log(data);
  if (isLoading)
    return <Loader2 className="ml-2 h-4 w-4 animate-spin opacity-50" />;
  if (!data) return <div>No projects found.</div>;
  return data?.data?.map((project) => (
    <ProjectCard key={project.id} project={project} />
  ));
}
