import Link from "next/link";
import { Plus } from "lucide-react";
import * as projectService from "@/lib/services/projectService";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProjectsTable } from "@/components/admin/ProjectsTable";

export default async function AdminProjectsPage() {
  const projects = await projectService.listProjects();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="eyebrow mb-3">Admin</span>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Projects</h1>
        </div>
        <Link
          href="/admin/projects/new"
          className={cn(buttonVariants(), "rounded-full bg-brand px-5 text-[#05140b] hover:bg-brand-dark")}
        >
          <Plus className="mr-2 size-4" />
          New Project
        </Link>
      </div>

      <ProjectsTable initialProjects={projects} />
    </div>
  );
}
