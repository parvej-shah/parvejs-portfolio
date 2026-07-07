import { notFound } from "next/navigation";
import * as postService from "@/lib/services/postService";
import { PostForm } from "@/components/admin/PostForm";

type Params = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Params) {
  const { id } = await params;

  try {
    const post = await postService.getPost(id);
    return <PostForm post={post} />;
  } catch (error) {
    if (error instanceof postService.PostNotFoundError) notFound();
    throw error;
  }
}
