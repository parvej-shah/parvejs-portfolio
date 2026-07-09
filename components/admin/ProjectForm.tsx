"use client";

import { Controller } from "react-hook-form";
import type { ChangeEvent } from "react";
import { useState } from "react";
import { LoaderCircle, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SlugInput } from "@/components/admin/SlugInput";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { ProjectGalleryUploader } from "@/components/admin/ProjectGalleryUploader";
import { useProjectForm } from "@/lib/admin/hooks/useProjectForm";
import type { Asset, Project } from "@/lib/types";

type ProjectFormProps = {
  project?: Project;
};

export function ProjectForm({ project }: ProjectFormProps) {
  const { form, error, isSubmitting, isDeleting, onSubmit, onDelete } = useProjectForm({ project });
  const { control, register, watch, setValue } = form;
  const status = watch("status") ?? "DRAFT";
  const [gallery, setGallery] = useState<Asset[]>(project?.gallery ?? []);

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {project ? "Edit Project" : "New Project"}
          </h1>
          <StatusBadge status={status} />
        </div>
        <div className="flex items-center gap-3">
          {project ? (
            <Button
              type="button"
              variant="outline"
              className="rounded-full border-line bg-transparent text-white hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
              disabled={isDeleting}
              onClick={onDelete}
            >
              {isDeleting ? <LoaderCircle className="mr-2 size-4 animate-spin" /> : <Trash2 className="mr-2 size-4" />}
              Delete
            </Button>
          ) : null}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-brand px-5 text-[#05140b] hover:bg-brand-dark"
          >
            {isSubmitting ? <LoaderCircle className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
            Save Project
          </Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-white">Title</span>
          <Input type="text" className="rounded-xl border-line bg-ink-3" {...register("title")} />
        </label>

        <Controller
          control={control}
          name="slug"
          render={({ field }) => <SlugInput value={field.value} onChange={field.onChange} />}
        />
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-white">Summary</span>
        <Textarea rows={3} className="rounded-xl border-line bg-ink-3" {...register("summary")} />
      </label>

      <div className="grid gap-6 md:grid-cols-3">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-white">Client</span>
          <Input type="text" className="rounded-xl border-line bg-ink-3" {...register("client")} />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-white">Role</span>
          <Input type="text" className="rounded-xl border-line bg-ink-3" {...register("role")} />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-white">Timeline</span>
          <Input type="text" className="rounded-xl border-line bg-ink-3" {...register("timeline")} />
        </label>
      </div>

      <ProjectGalleryUploader projectId={project?.id} value={gallery} onChange={setGallery} />

      <div className="grid gap-6 md:grid-cols-2">
        <Controller
          control={control}
          name="techStack"
          render={({ field }) => (
            <label className="block space-y-2">
              <span className="text-sm font-medium text-white">Tech stack (comma-separated)</span>
              <Input
                type="text"
                className="rounded-xl border-line bg-ink-3"
                value={(field.value ?? []).join(", ")}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  field.onChange(
                    event.target.value
                      .split(",")
                      .map((item) => item.trim())
                      .filter(Boolean)
                  )
                }
              />
            </label>
          )}
        />

        <Controller
          control={control}
          name="keyFeatures"
          render={({ field }) => (
            <label className="block space-y-2">
              <span className="text-sm font-medium text-white">Key features (comma-separated)</span>
              <Input
                type="text"
                className="rounded-xl border-line bg-ink-3"
                value={(field.value ?? []).join(", ")}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  field.onChange(
                    event.target.value
                      .split(",")
                      .map((item) => item.trim())
                      .filter(Boolean)
                  )
                }
              />
            </label>
          )}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Controller
          control={control}
          name="problem"
          render={({ field }) => (
            <MarkdownEditor label="Problem" value={field.value ?? ""} onChange={field.onChange} />
          )}
        />
        <Controller
          control={control}
          name="approach"
          render={({ field }) => (
            <MarkdownEditor label="Approach" value={field.value ?? ""} onChange={field.onChange} />
          )}
        />
        <Controller
          control={control}
          name="solution"
          render={({ field }) => (
            <MarkdownEditor label="Solution" value={field.value ?? ""} onChange={field.onChange} />
          )}
        />
        <Controller
          control={control}
          name="results"
          render={({ field }) => (
            <MarkdownEditor label="Results" value={field.value ?? ""} onChange={field.onChange} />
          )}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-white">Order</span>
          <Input
            type="number"
            className="rounded-xl border-line bg-ink-3"
            {...register("order", { valueAsNumber: true })}
          />
        </label>

        <label className="flex items-center gap-2 pt-7">
          <input
            type="checkbox"
            className="size-4 rounded border-line"
            checked={watch("featured")}
            onChange={(event) => setValue("featured", event.target.checked)}
          />
          <span className="text-sm font-medium text-white">Featured</span>
        </label>

        <label className="flex items-center gap-2 pt-7">
          <input
            type="checkbox"
            className="size-4 rounded border-line"
            checked={status === "PUBLISHED"}
            onChange={(event) => setValue("status", event.target.checked ? "PUBLISHED" : "DRAFT")}
          />
          <span className="text-sm font-medium text-white">Published</span>
        </label>
      </div>
    </form>
  );
}
