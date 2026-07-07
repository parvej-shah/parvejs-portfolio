"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { LoaderCircle, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import type { Asset } from "@/lib/types";

type ImageUploaderProps = {
  label: string;
  value: Asset | null;
  onChange: (asset: Asset | null) => void;
};

export function ImageUploader({ label, value, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      const asset = await apiClient.uploadAsset(file);
      onChange(asset);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-white">{label}</span>
      <div className="flex items-center gap-4">
        {value ? (
          <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-line bg-ink-3">
            <Image src={value.url} alt={value.alt ?? ""} fill className="object-cover" sizes="80px" />
          </div>
        ) : (
          <div className="flex size-20 shrink-0 items-center justify-center rounded-xl border border-dashed border-line bg-ink-3 text-muted-foreground">
            <Upload className="size-5" />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          <Button
            type="button"
            variant="outline"
            className="rounded-full border-line bg-transparent text-white hover:border-brand/50 hover:bg-ink-3"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
          >
            {isUploading ? <LoaderCircle className="mr-2 size-4 animate-spin" /> : <Upload className="mr-2 size-4" />}
            {value ? "Replace" : "Upload"} image
          </Button>
          {value ? (
            <Button
              type="button"
              variant="ghost"
              className="rounded-full text-muted-foreground hover:text-red-300"
              onClick={() => onChange(null)}
            >
              <X className="mr-2 size-4" />
              Remove
            </Button>
          ) : null}
        </div>
      </div>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
    </div>
  );
}
