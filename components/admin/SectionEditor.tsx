"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type ReactNode } from "react";
import { LoaderCircle, Plus, Save, Trash2 } from "lucide-react";
import { apiClient, type SectionData, type SectionKey } from "@/lib/api-client";
import { sectionEditorConfig, type FieldConfig } from "@/lib/admin/section-editor-config";
import { iconSets } from "@/lib/section-rendering";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type { Asset } from "@/lib/types";

type PathSegment = string | number;
type EditorValue = SectionData<SectionKey>;

function getAtPath(value: unknown, path: PathSegment[]) {
  return path.reduce<unknown>((current, segment) => {
    if (current == null) return current;
    return (current as Record<string, unknown> | unknown[])[segment as never];
  }, value);
}

function setAtPath<T>(value: T, path: PathSegment[], nextValue: unknown): T {
  if (path.length === 0) return nextValue as T;

  const [head, ...rest] = path;
  if (Array.isArray(value)) {
    const copy = [...value];
    copy[head as number] = setAtPath(copy[head as number], rest, nextValue);
    return copy as T;
  }

  const copy = { ...(value as Record<string, unknown>) };
  copy[head as string] = setAtPath(copy[head as string], rest, nextValue);
  return copy as T;
}

function createEmptyValue(field: FieldConfig): unknown {
  switch (field.kind) {
    case "text":
    case "textarea":
    case "url":
    case "email":
      return "";
    case "number":
      return 5;
    case "stringArray":
      return [""];
    case "object":
      return Object.fromEntries(
        Object.entries(field.fields).map(([key, childField]) => [key, createEmptyValue(childField)])
      );
    case "objectArray":
      return [createEmptyValue({ kind: "object", label: field.itemLabel, fields: field.fields })];
    default:
      return "";
  }
}

export function SectionEditor() {
  const sectionKeys = useMemo(() => Object.keys(sectionEditorConfig) as SectionKey[], []);
  const [selectedKey, setSelectedKey] = useState<SectionKey>("hero");
  const [draft, setDraft] = useState<EditorValue | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  function createEmptySection(key: SectionKey): EditorValue {
    return Object.fromEntries(
      Object.entries(sectionEditorConfig[key].fields).map(([fieldKey, field]) => [
        fieldKey,
        createEmptyValue(field),
      ])
    ) as EditorValue;
  }

  useEffect(() => {
    let isCancelled = false;

    async function loadSection() {
      setIsLoading(true);
      setError(null);
      setMessage(null);

      try {
        const data = await apiClient.getSection(selectedKey);
        if (!isCancelled) setDraft(data as EditorValue);
      } catch (loadError) {
        if (!isCancelled) {
          const message = loadError instanceof Error ? loadError.message : "Failed to load section.";

          if (message.startsWith("Section not found:")) {
            setDraft(createEmptySection(selectedKey));
            setMessage(`${sectionEditorConfig[selectedKey].label} has not been saved yet. Add content and save it.`);
          } else {
            setError(message);
            setDraft(null);
          }
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    loadSection();
    return () => {
      isCancelled = true;
    };
  }, [selectedKey]);

  async function handleSave() {
    if (!draft) return;

    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      const saved = await apiClient.updateSection(selectedKey, draft as never);
      setDraft(saved as EditorValue);
      setMessage(`${sectionEditorConfig[selectedKey].label} saved.`);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save section.");
    } finally {
      setIsSaving(false);
    }
  }

  function updateField(path: PathSegment[], nextValue: unknown) {
    setDraft((current) => (current ? setAtPath(current, path, nextValue) : current));
  }

  function renderField(field: FieldConfig, path: PathSegment[]): ReactNode {
    const value = draft ? getAtPath(draft, path) : undefined;

    if (field.kind === "object") {
      return (
        <div className="space-y-4 rounded-2xl border border-line bg-ink-2/60 p-4">
          <div>
            <h3 className="text-sm font-semibold text-white">{field.label}</h3>
          </div>
          <div className="grid gap-x-4 gap-y-3 md:grid-cols-2">
            {Object.entries(field.fields).map(([key, childField]) => (
              <div key={key}>{renderField(childField, [...path, key])}</div>
            ))}
          </div>
        </div>
      );
    }

    if (field.kind === "stringArray") {
      const items = Array.isArray(value) ? value : [];

      return (
        <div className="space-y-3 rounded-2xl border border-line bg-ink-2/60 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-white">{field.label}</h3>
            </div>
            <Button
              type="button"
              variant="outline"
              className="rounded-full border-line bg-transparent text-white hover:border-brand/50 hover:bg-ink-3"
              onClick={() => updateField(path, [...items, ""])}
            >
              <Plus className="mr-2 size-4" />
              Add {field.itemLabel}
            </Button>
          </div>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={`${path.join(".")}-${index}`} className="flex items-start gap-3">
                <Input
                  type="text"
                  value={String(item ?? "")}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => updateField([...path, index], event.target.value)}
                  placeholder={field.placeholder ?? field.itemLabel}
                  className="h-11 rounded-xl border-line bg-ink-3"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="shrink-0 rounded-xl border-line bg-transparent text-white hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
                  onClick={() => updateField(path, items.filter((_, itemIndex) => itemIndex !== index))}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (field.kind === "objectArray") {
      const items = Array.isArray(value) ? value : [];

      return (
        <div className="space-y-4 rounded-2xl border border-line bg-ink-2/60 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-white">{field.label}</h3>
            </div>
            <Button
              type="button"
              variant="outline"
              className="rounded-full border-line bg-transparent text-white hover:border-brand/50 hover:bg-ink-3"
              onClick={() =>
                updateField(path, [
                  ...items,
                  createEmptyValue({ kind: "object", label: field.itemLabel, fields: field.fields }),
                ])
              }
            >
              <Plus className="mr-2 size-4" />
              Add {field.itemLabel}
            </Button>
          </div>
          <div className="space-y-4">
            {items.map((_, index) => (
              <div
                key={`${path.join(".")}-${index}`}
                className="space-y-4 rounded-2xl border border-line/80 bg-ink-3 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium text-white">
                    {field.itemLabel} {index + 1}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="rounded-xl border-line bg-transparent text-white hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
                    onClick={() => updateField(path, items.filter((_, itemIndex) => itemIndex !== index))}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  {Object.entries(field.fields).map(([key, childField]) => (
                    <div key={key}>{renderField(childField, [...path, index, key])}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (field.kind === "iconPicker") {
      const icons = iconSets[field.iconSet];
      const selected = typeof value === "string" ? value : "";

      return (
        <div className="space-y-3 rounded-2xl border border-line bg-ink-2/60 p-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-white">{field.label}</h3>
            <span className={cn("text-xs", selected ? "text-muted-foreground" : "text-red-300")}>
              {selected ? `Selected: ${selected}` : "No icon selected"}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(icons).map(([name, IconComponent]) => (
              <button
                key={name}
                type="button"
                title={name}
                onClick={() => updateField(path, name)}
                className={cn(
                  "flex size-11 items-center justify-center rounded-xl border text-white transition-colors",
                  selected === name
                    ? "border-brand bg-brand/10 text-brand"
                    : "border-line bg-ink-3 hover:border-brand/40 hover:bg-ink-3/80"
                )}
              >
                <IconComponent className="size-5" />
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (field.kind === "image") {
      const imageUrl = typeof value === "string" ? value : "";
      const asset: Asset | null = imageUrl
        ? { id: imageUrl, key: imageUrl, url: imageUrl, alt: null, width: null, height: null, projectId: null, createdAt: new Date() }
        : null;

      return (
        <div className="rounded-2xl border border-line bg-ink-2/60 p-4">
          <ImageUploader
            label={field.label}
            value={asset}
            onChange={(nextAsset) => updateField(path, nextAsset?.url ?? "")}
          />
          {field.description ? (
            <span className="mt-2 block text-xs text-muted-foreground">{field.description}</span>
          ) : null}
        </div>
      );
    }

    if (field.kind === "number") {
      const numberValue = typeof value === "number" ? value : "";

      return (
        <label className="block space-y-2 rounded-2xl border border-line bg-ink-2/60 p-4">
          <span className="text-sm font-semibold text-white">{field.label}</span>
          <Input
            type="number"
            min={field.min}
            max={field.max}
            value={numberValue}
            onChange={(event: ChangeEvent<HTMLInputElement>) => updateField(path, Number(event.target.value))}
            className="rounded-xl border-line bg-ink-3"
          />
        </label>
      );
    }

    const inputValue = typeof value === "string" ? value : "";

    return (
      <label className="block space-y-2 rounded-2xl border border-line bg-ink-2/60 p-4">
        <span className="text-sm font-semibold text-white">{field.label}</span>
        {field.description ? (
          <span className="block text-xs text-muted-foreground">{field.description}</span>
        ) : null}
        {field.kind === "textarea" ? (
          <Textarea
            value={inputValue}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => updateField(path, event.target.value)}
            placeholder={field.placeholder}
            className="rounded-xl border-line bg-ink-3"
            rows={4}
          />
        ) : (
          <Input
            type={field.kind === "email" ? "email" : field.kind === "url" ? "url" : "text"}
            value={inputValue}
            onChange={(event: ChangeEvent<HTMLInputElement>) => updateField(path, event.target.value)}
            placeholder={field.placeholder}
            className="rounded-xl border-line bg-ink-3"
          />
        )}
      </label>
    );
  }

  const activeConfig = sectionEditorConfig[selectedKey];

  return (
    <div className="grid gap-6 lg:h-[calc(100vh-3rem)] lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="rounded-3xl border border-line bg-ink-2 p-4 lg:overflow-y-auto">
        <h2 className="px-2 text-sm font-semibold text-white">Homepage Sections</h2>
        <p className="px-2 pt-2 text-xs leading-relaxed text-muted-foreground">
          Each tab loads and saves its own typed content payload through the section API.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          {sectionKeys.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedKey(key)}
              className={cn(
                "rounded-2xl border px-3 py-3 text-left transition-colors",
                selectedKey === key
                  ? "border-brand/40 bg-brand/10 text-white"
                  : "border-transparent bg-transparent text-muted-foreground hover:border-line hover:bg-ink-3 hover:text-white"
              )}
            >
              <span className="block text-sm font-medium">{sectionEditorConfig[key].label}</span>
              <span className="mt-1 block text-xs leading-relaxed text-inherit/80">
                {sectionEditorConfig[key].description}
              </span>
            </button>
          ))}
        </div>
      </aside>

      <section className="rounded-3xl border border-line bg-ink-2 p-6 sm:p-8 lg:overflow-y-auto">
        <div className="flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="eyebrow mb-3">Admin Content</span>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {activeConfig.label}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {activeConfig.description}
            </p>
          </div>
          <Button
            type="button"
            onClick={handleSave}
            disabled={!draft || isLoading || isSaving}
            className="rounded-full bg-brand px-5 text-[#05140b] hover:bg-brand-dark"
          >
            {isSaving ? <LoaderCircle className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
            Save Section
          </Button>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        ) : null}
        {message ? (
          <div className="mt-6 rounded-2xl border border-brand/30 bg-brand/10 px-4 py-3 text-sm text-brand">
            {message}
          </div>
        ) : null}

        {isLoading ? (
          <div className="mt-8 flex min-h-72 items-center justify-center rounded-2xl border border-dashed border-line bg-ink-3/50">
            <LoaderCircle className="size-6 animate-spin text-brand" />
          </div>
        ) : draft ? (
          <form
            className="mt-8 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              void handleSave();
            }}
          >
            {Object.entries(activeConfig.fields).map(([key, field]) => (
              <div key={key}>{renderField(field, [key])}</div>
            ))}
          </form>
        ) : null}
      </section>
    </div>
  );
}
