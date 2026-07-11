import * as postService from "@/lib/services/postService";
import { PostCalendar } from "@/components/admin/PostCalendar";

export default async function AdminPostCalendarPage() {
  const posts = await postService.listPosts();

  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow mb-3">Admin</span>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Calendar</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Drag a post onto a day to schedule or reschedule it.
        </p>
      </div>

      <PostCalendar posts={posts} />
    </div>
  );
}
