import { PostForm } from "@/components/admin/PostForm";

type NewPostPageProps = {
  searchParams: Promise<{ date?: string }>;
};

export default async function NewPostPage({ searchParams }: NewPostPageProps) {
  const { date } = await searchParams;
  // Calendar links here with ?date=YYYY-MM-DD when starting a post from an empty day.
  const defaultScheduledAt = date && !Number.isNaN(Date.parse(date)) ? new Date(`${date}T09:00`) : undefined;

  return <PostForm defaultScheduledAt={defaultScheduledAt} />;
}
