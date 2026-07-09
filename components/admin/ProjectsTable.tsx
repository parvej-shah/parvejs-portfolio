"use client";

import { useState } from "react";
import Link from "next/link";
import { GripVertical } from "lucide-react";
import type { Project } from "@/lib/types";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { cn } from "@/lib/utils";

type ProjectsTableProps = {
  initialProjects: Project[];
};

export function ProjectsTable({ initialProjects }: ProjectsTableProps) {
  const [projects, setProjects] = useState(initialProjects);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (projects.length === 0) {
    return (
      <div className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-line bg-ink-3/50 text-sm text-muted-foreground">
        No projects yet. Create your first one.
      </div>
    );
  }

  function handleDrop(targetId: string) {
    if (!draggedId || draggedId === targetId) return;

    const reordered = [...projects];
    const fromIndex = reordered.findIndex((p) => p.id === draggedId);
    const toIndex = reordered.findIndex((p) => p.id === targetId);
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);

    setProjects(reordered);
    setDraggedId(null);
    void saveOrder(reordered.map((p) => p.id));
  }

  async function saveOrder(orderedIds: string[]) {
    setIsSaving(true);
    try {
      await fetch("/api/projects/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line">
      <table className="w-full text-left text-sm">
        <thead className="bg-ink-2/60 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="w-10 px-4 py-3" />
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Slug</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Featured</th>
            <th className="px-4 py-3 font-medium">Order</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {projects.map((project, index) => (
            <tr
              key={project.id}
              draggable
              onDragStart={() => setDraggedId(project.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(project.id)}
              className={cn(
                "bg-ink-2/20 hover:bg-ink-3/60",
                draggedId === project.id && "opacity-50"
              )}
            >
              <td className="cursor-grab px-4 py-3 text-muted-foreground active:cursor-grabbing">
                <GripVertical className="size-4" />
              </td>
              <td className="px-4 py-3 text-white">
                <Link href={`/admin/projects/${project.id}`} className="font-medium text-white hover:text-brand">
                  {project.title}
                </Link>
              </td>
              <td className="px-4 py-3 text-white">
                <span className="font-mono text-xs">{project.slug}</span>
              </td>
              <td className="px-4 py-3 text-white">
                <StatusBadge status={project.status} />
              </td>
              <td className="px-4 py-3 text-white">{project.featured ? "Yes" : "—"}</td>
              <td className="px-4 py-3 text-white">{index}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {isSaving && <p className="px-4 py-2 text-xs text-muted-foreground">Saving order…</p>}
    </div>
  );
}
