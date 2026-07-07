import Link from "next/link";
import { Plus } from "lucide-react";
import * as postService from "@/lib/services/postService";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DataTable } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";

export default async function AdminPostsPage() {
  const posts = await postService.listPosts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="eyebrow mb-3">Admin</span>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Posts</h1>
        </div>
        <Link
          href="/admin/posts/new"
          className={cn(buttonVariants(), "rounded-full bg-brand px-5 text-[#05140b] hover:bg-brand-dark")}
        >
          <Plus className="mr-2 size-4" />
          New Post
        </Link>
      </div>

      <DataTable
        rows={posts}
        rowKey={(post) => post.id}
        emptyMessage="No posts yet. Write your first one."
        columns={[
          {
            header: "Title",
            cell: (post) => (
              <Link href={`/admin/posts/${post.id}`} className="font-medium text-white hover:text-brand">
                {post.title}
              </Link>
            ),
          },
          { header: "Slug", cell: (post) => <span className="font-mono text-xs">{post.slug}</span> },
          { header: "Status", cell: (post) => <StatusBadge status={post.status} /> },
          {
            header: "Published",
            cell: (post) => (post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "—"),
          },
        ]}
      />
    </div>
  );
}
