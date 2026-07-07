import type { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type SlugInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function SlugInput({ value, onChange }: SlugInputProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-white">Slug</span>
      <Input
        type="text"
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(slugify(event.target.value))}
        placeholder="my-post-slug"
        className="rounded-xl border-line bg-ink-3 font-mono text-sm"
      />
    </label>
  );
}

export { slugify };
