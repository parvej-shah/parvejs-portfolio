import Link from "next/link";
import * as projectService from "@/lib/services/projectService";
import * as postService from "@/lib/services/postService";

export default async function AdminDashboardPage() {
  const [projects, posts] = await Promise.all([projectService.listProjects(), postService.listPosts()]);

  const publishedProjects = projects.filter((project) => project.status === "PUBLISHED").length;
  const publishedPosts = posts.filter((post) => post.status === "PUBLISHED").length;

  const stats = [
    { label: "Projects", total: projects.length, published: publishedProjects, href: "/admin/projects" },
    { label: "Posts", total: posts.length, published: publishedPosts, href: "/admin/posts" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <span className="eyebrow mb-3">Admin</span>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Dashboard</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Manage projects, posts, and homepage sections.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-2xl border border-line bg-ink-2 p-6 transition-colors hover:border-brand/40"
          >
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-white">{stat.total}</p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.published} published</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
