"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import type { z } from "zod";
import { apiClient } from "@/lib/api-client";
import { createProjectSchema } from "@/lib/validators/project";
import type { CreateProject, Project } from "@/lib/types";

type UseProjectFormOptions = {
  project?: Project;
};

type ProjectFormValues = z.input<typeof createProjectSchema>;

export function useProjectForm({ project }: UseProjectFormOptions = {}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: project
      ? {
          slug: project.slug,
          title: project.title,
          summary: project.summary,
          status: project.status,
          problem: project.problem ?? "",
          approach: project.approach ?? "",
          solution: project.solution ?? "",
          results: project.results ?? "",
          client: project.client ?? "",
          role: project.role ?? "",
          timeline: project.timeline ?? "",
          techStack: project.techStack,
          order: project.order,
          featured: project.featured,
        }
      : {
          slug: "",
          title: "",
          summary: "",
          status: "DRAFT",
          problem: "",
          approach: "",
          solution: "",
          results: "",
          client: "",
          role: "",
          timeline: "",
          techStack: [],
          order: 0,
          featured: false,
        },
  });

  async function onSubmit(values: ProjectFormValues) {
    setError(null);
    setIsSubmitting(true);

    try {
      const parsed: CreateProject = createProjectSchema.parse(values);
      if (project) {
        await apiClient.updateProject(project.id, parsed);
      } else {
        await apiClient.createProject(parsed);
      }
      router.push("/admin/projects");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to save project.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onDelete() {
    if (!project) return;
    setIsDeleting(true);
    setError(null);

    try {
      await apiClient.deleteProject(project.id);
      router.push("/admin/projects");
      router.refresh();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete project.");
      setIsDeleting(false);
    }
  }

  return {
    form,
    error,
    isSubmitting,
    isDeleting,
    onSubmit: form.handleSubmit(onSubmit),
    onDelete,
  };
}
