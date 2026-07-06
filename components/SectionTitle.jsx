/** Small pill used for tech tags / small labels. */
export default function SectionTitle({ title }) {
  return (
    <span className="inline-flex w-fit items-center rounded-full border border-line bg-ink-3 px-3 py-1 text-xs font-medium text-muted-foreground">
      {title}
    </span>
  );
}
