"use client";

import { Controller } from "react-hook-form";
import { LoaderCircle, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SlugInput } from "@/components/admin/SlugInput";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { usePostForm } from "@/lib/admin/hooks/usePostForm";
import { useState } from "react";
import type { Asset, Post } from "@/lib/types";

type PostFormProps = {
  post?: Post;
};

export function PostForm({ post }: PostFormProps) {
  const { form, error, isSubmitting, isDeleting, onSubmit, onDelete } = usePostForm({ post });
  const { control, register, watch, setValue } = form;
  const status = watch("status") ?? "DRAFT";
  const [coverAsset, setCoverAsset] = useState<Asset | null>(null);

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-white">{post ? "Edit Post" : "New Post"}</h1>
          <StatusBadge status={status} />
        </div>
        <div className="flex items-center gap-3">
          {post ? (
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
            Save Post
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
        <span className="text-sm font-medium text-white">Excerpt</span>
        <Textarea rows={2} className="rounded-xl border-line bg-ink-3" {...register("excerpt")} />
      </label>

      <ImageUploader
        label="Cover image"
        value={coverAsset}
        onChange={(asset) => {
          setCoverAsset(asset);
          setValue("coverImageId", asset?.id ?? null);
        }}
      />

      <Controller
        control={control}
        name="content"
        render={({ field }) => (
          <MarkdownEditor label="Content" value={field.value} onChange={field.onChange} rows={16} />
        )}
      />

      <div className="flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="size-4 rounded border-line"
            checked={watch("featured")}
            onChange={(event) => setValue("featured", event.target.checked)}
          />
          <span className="text-sm font-medium text-white">Featured on homepage</span>
        </label>

        <label className="flex items-center gap-2">
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
