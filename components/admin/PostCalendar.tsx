"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import type { Post } from "@/lib/types";

type PostCalendarProps = {
  posts: Post[];
};

const statusDotStyles: Record<Post["status"], string> = {
  PUBLISHED: "bg-brand",
  SCHEDULED: "bg-amber-400",
  DRAFT: "border border-line",
};

// A post lands on the calendar day that reflects its current lifecycle: when it will go
// (or went) live for scheduled/published posts, or its last-touched day while still a draft.
function calendarDate(post: Post) {
  return post.publishedAt ? new Date(post.publishedAt) : new Date(post.updatedAt);
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function buildMonthGrid(monthStart: Date) {
  const firstDay = startOfMonth(monthStart);
  const gridStart = new Date(firstDay);
  gridStart.setDate(gridStart.getDate() - firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + index);
    return day;
  });
}

export function PostCalendar({ posts: initialPosts }: PostCalendarProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [monthStart, setMonthStart] = useState(() => startOfMonth(new Date()));
  const [dragPostId, setDragPostId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const days = useMemo(() => buildMonthGrid(monthStart), [monthStart]);
  const today = new Date();

  const postsByDay = useMemo(() => {
    const map = new Map<string, Post[]>();
    for (const post of posts) {
      const key = calendarDate(post).toDateString();
      map.set(key, [...(map.get(key) ?? []), post]);
    }
    return map;
  }, [posts]);

  function moveToDay(postId: string, targetDay: Date) {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const current = calendarDate(post);
    if (sameDay(current, targetDay)) return;

    // Dragging a draft onto a day only makes sense as "schedule it for that day" — keep
    // its existing time-of-day if it had one, default to 9am otherwise.
    const nextDate = new Date(targetDay);
    nextDate.setHours(current.getHours() || 9, current.getMinutes(), 0, 0);

    const previousPosts = posts;
    const nextStatus = nextDate > new Date() ? "SCHEDULED" : post.status;

    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, publishedAt: nextDate, status: nextStatus } : p))
    );
    setError(null);

    startTransition(async () => {
      try {
        await apiClient.updatePost(postId, { publishedAt: nextDate, status: nextStatus });
      } catch (updateError) {
        setPosts(previousPosts);
        setError(updateError instanceof Error ? updateError.message : "Failed to reschedule post.");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          {monthStart.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-lg border border-line p-1.5 text-muted-foreground hover:text-white"
            onClick={() => setMonthStart((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
            aria-label="Previous month"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            className="rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-white"
            onClick={() => setMonthStart(startOfMonth(new Date()))}
          >
            Today
          </button>
          <button
            type="button"
            className="rounded-lg border border-line p-1.5 text-muted-foreground hover:text-white"
            onClick={() => setMonthStart((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
            aria-label="Next month"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-2xl border border-line bg-line text-xs">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label) => (
          <div key={label} className="bg-ink-3 px-2 py-2 text-center font-medium text-muted-foreground">
            {label}
          </div>
        ))}

        {days.map((day) => {
          const dayPosts = postsByDay.get(day.toDateString()) ?? [];
          const isCurrentMonth = day.getMonth() === monthStart.getMonth();
          const isToday = sameDay(day, today);

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "min-h-[7rem] bg-ink-2 p-2 transition-colors",
                !isCurrentMonth && "bg-ink-2/40",
                dragPostId && "outline-1 outline-dashed outline-line/60"
              )}
              onDragOver={(event) => {
                if (!dragPostId) return;
                event.preventDefault();
              }}
              onDrop={(event) => {
                event.preventDefault();
                const postId = event.dataTransfer.getData("text/plain") || dragPostId;
                if (postId) moveToDay(postId, day);
                setDragPostId(null);
              }}
            >
              <span
                className={cn(
                  "text-xs",
                  isCurrentMonth ? "text-muted-foreground" : "text-muted-foreground/40",
                  isToday && "font-bold text-brand"
                )}
              >
                {day.getDate()}
              </span>

              <div className="mt-1.5 flex flex-col gap-1">
                {dayPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/admin/posts/${post.id}`}
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData("text/plain", post.id);
                      setDragPostId(post.id);
                    }}
                    onDragEnd={() => setDragPostId(null)}
                    className={cn(
                      "flex items-center gap-1.5 truncate rounded-md border border-line/60 bg-ink-3 px-1.5 py-1 text-xs text-white transition-opacity hover:border-brand/40",
                      isPending && dragPostId === post.id && "opacity-50"
                    )}
                    title={post.title}
                  >
                    <span className={cn("size-1.5 shrink-0 rounded-full", statusDotStyles[post.status])} />
                    <span className="truncate">{post.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
