import Link from "next/link";
import { Plus } from "lucide-react";
import * as projectService from "@/lib/services/projectService";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";

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

      <DataTable
        rows={projects}
        rowKey={(project) => project.id}
        emptyMessage="No projects yet. Create your first one."
        columns={[
          {
            header: "Title",
            cell: (project) => (
              <Link href={`/admin/projects/${project.id}`} className="font-medium text-white hover:text-brand">
                {project.title}
              </Link>
            ),
          },
          { header: "Slug", cell: (project) => <span className="font-mono text-xs">{project.slug}</span> },
          { header: "Status", cell: (project) => <StatusBadge status={project.status} /> },
          { header: "Featured", cell: (project) => (project.featured ? "Yes" : "—") },
          { header: "Order", cell: (project) => project.order },
        ]}
      />
    </div>
  );
}
