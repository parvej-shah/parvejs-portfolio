"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { LoaderCircle, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import type { Asset } from "@/lib/types";

type ProjectGalleryUploaderProps = {
  projectId?: string;
  value: Asset[];
  onChange: (assets: Asset[]) => void;
};

// projectId only exists after the first save, so gallery uploads are disabled until then.
export function ProjectGalleryUploader({ projectId, value, onChange }: ProjectGalleryUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !projectId) return;

    setIsUploading(true);
    setError(null);

    try {
      const asset = await apiClient.uploadAsset(file, projectId);
      onChange([...value, asset]);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleRemove(assetId: string) {
    setRemovingId(assetId);
    setError(null);

    try {
      await apiClient.deleteAsset(assetId);
      onChange(value.filter((asset) => asset.id !== assetId));
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : "Failed to remove image.");
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-white">Gallery</span>
        <span className="text-xs text-muted-foreground">First image is used as the cover</span>
      </div>

      {!projectId ? (
        <p className="text-xs text-muted-foreground">Save the project once to enable gallery uploads.</p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {value.map((asset, index) => (
          <div key={asset.id} className="relative size-24 shrink-0 overflow-hidden rounded-xl border border-line bg-ink-3">
            <Image src={asset.url} alt={asset.alt ?? ""} fill className="object-cover" sizes="96px" />
            {index === 0 ? (
              <span className="absolute inset-x-0 bottom-0 bg-brand/90 px-1.5 py-0.5 text-center text-[0.6rem] font-medium text-[#05140b]">
                Cover
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => handleRemove(asset.id)}
              disabled={removingId === asset.id}
              className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-black/70 text-white hover:bg-red-500/80"
            >
              {removingId === asset.id ? <LoaderCircle className="size-3.5 animate-spin" /> : <X className="size-3.5" />}
            </button>
          </div>
        ))}

        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        <button
          type="button"
          disabled={!projectId || isUploading}
          onClick={() => inputRef.current?.click()}
          className="flex size-24 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-line bg-ink-3 text-muted-foreground transition-colors hover:border-brand/50 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading ? <LoaderCircle className="size-5 animate-spin" /> : <Upload className="size-5" />}
          <span className="text-xs">Add image</span>
        </button>
      </div>

      {error ? <p className="text-sm text-red-300">{error}</p> : null}
    </div>
  );
}
