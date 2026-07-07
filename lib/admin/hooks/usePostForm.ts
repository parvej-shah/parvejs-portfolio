"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import type { z } from "zod";
import { apiClient } from "@/lib/api-client";
import { createPostSchema } from "@/lib/validators/post";
import type { CreatePost, Post } from "@/lib/types";

type UsePostFormOptions = {
  post?: Post;
};

type PostFormValues = z.input<typeof createPostSchema>;

export function usePostForm({ post }: UsePostFormOptions = {}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<PostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: post
      ? {
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          status: post.status,
          featured: post.featured,
          coverImageId: post.coverImageId ?? null,
        }
      : {
          slug: "",
          title: "",
          excerpt: "",
          content: "",
          status: "DRAFT",
          featured: false,
          coverImageId: null,
        },
  });

  async function onSubmit(values: PostFormValues) {
    setError(null);
    setIsSubmitting(true);

    try {
      const parsed: CreatePost = createPostSchema.parse(values);
      if (post) {
        await apiClient.updatePost(post.id, parsed);
      } else {
        await apiClient.createPost(parsed);
      }
      router.push("/admin/posts");
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to save post.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onDelete() {
    if (!post) return;
    setIsDeleting(true);
    setError(null);

    try {
      await apiClient.deletePost(post.id);
      router.push("/admin/posts");
      router.refresh();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete post.");
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
