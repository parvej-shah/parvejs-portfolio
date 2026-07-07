"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Expand } from "lucide-react";
import Reveal from "@/components/Reveal";
import { cn } from "@/lib/utils";

type GalleryAsset = {
  id: string;
  url: string;
  alt: string | null;
};

type ProjectGalleryProps = {
  assets: GalleryAsset[];
  projectTitle: string;
};

export default function ProjectGallery({ assets, projectTitle }: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = () => setActiveIndex(null);
  const showPrev = () =>
    setActiveIndex((current) => (current === null ? null : (current - 1 + assets.length) % assets.length));
  const showNext = () =>
    setActiveIndex((current) => (current === null ? null : (current + 1) % assets.length));

  return (
    <>
      <div className="mx-auto grid max-w-7xl gap-6 px-5 lg:grid-cols-12">
        {assets.map((asset, index) => (
          <Reveal
            key={asset.id}
            delay={(index % 3) * 90}
            className={cn(
              "group relative overflow-hidden rounded-[1.6rem] border border-line bg-ink-2",
              index === 0 ? "aspect-[16/10] lg:col-span-7" : "aspect-[4/3] lg:col-span-5"
            )}
          >
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              className="absolute inset-0 z-10 cursor-zoom-in"
              aria-label={`View ${asset.alt || projectTitle} full size`}
            >
              <span className="absolute right-4 top-4 z-20 flex size-9 items-center justify-center rounded-full bg-ink/70 text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
                <Expand className="size-4" />
              </span>
            </button>
            <Image
              src={asset.url}
              alt={asset.alt || projectTitle}
              fill
              sizes={index === 0 ? "(max-width: 1024px) 100vw, 58vw" : "(max-width: 1024px) 100vw, 35vw"}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </Reveal>
        ))}
      </div>

      {activeIndex !== null ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-8"
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full border border-line bg-ink-2 text-white transition-colors hover:border-brand/40 hover:text-brand"
            aria-label="Close gallery"
          >
            <X className="size-5" />
          </button>

          {assets.length > 1 ? (
            <>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showPrev();
                }}
                className="absolute left-4 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-ink-2 text-white transition-colors hover:border-brand/40 hover:text-brand sm:left-8"
                aria-label="Previous image"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  showNext();
                }}
                className="absolute right-4 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-ink-2 text-white transition-colors hover:border-brand/40 hover:text-brand sm:right-8"
                aria-label="Next image"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          ) : null}

          <div
            className="relative aspect-[16/10] w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={assets[activeIndex].url}
              alt={assets[activeIndex].alt || projectTitle}
              fill
              sizes="90vw"
              className="rounded-2xl object-contain"
            />
          </div>

          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {activeIndex + 1} / {assets.length}
          </span>
        </div>
      ) : null}
    </>
  );
}
