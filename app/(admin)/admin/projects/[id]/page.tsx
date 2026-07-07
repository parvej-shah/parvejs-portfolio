import { notFound } from "next/navigation";
import * as projectService from "@/lib/services/projectService";
import { ProjectForm } from "@/components/admin/ProjectForm";

type Params = { params: Promise<{ id: string }> };

export default async function EditProjectPage({ params }: Params) {
  const { id } = await params;

  try {
    const project = await projectService.getProject(id);
    return <ProjectForm project={project} />;
  } catch (error) {
    if (error instanceof projectService.ProjectNotFoundError) notFound();
    throw error;
  }
}
