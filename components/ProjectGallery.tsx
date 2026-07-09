"use client";

import { useCallback, useEffect, useState } from "react";
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

// Strategy: the first image is the wide "hero" tile; the rest tile evenly beneath it.
function tileClasses(index: number, total: number) {
  if (index === 0) return "aspect-[16/9] lg:col-span-12";
  // Two-up rows for the remainder; a lone trailing image spans full width.
  const remainder = total - 1;
  const isLastAlone = index === total - 1 && remainder % 2 === 1;
  return isLastAlone ? "aspect-[16/8] lg:col-span-12" : "aspect-[4/3] lg:col-span-6";
}

export default function ProjectGallery({ assets, projectTitle }: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const showPrev = useCallback(
    () => setActiveIndex((current) => (current === null ? null : (current - 1 + assets.length) % assets.length)),
    [assets.length]
  );
  const showNext = useCallback(
    () => setActiveIndex((current) => (current === null ? null : (current + 1) % assets.length)),
    [assets.length]
  );

  // Keyboard navigation + body scroll lock while the lightbox is open.
  useEffect(() => {
    if (activeIndex === null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      else if (event.key === "ArrowLeft") showPrev();
      else if (event.key === "ArrowRight") showNext();
    };

    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [activeIndex, close, showPrev, showNext]);

  return (
    <>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-5 sm:gap-5 lg:grid-cols-12">
        {assets.map((asset, index) => (
          <Reveal
            key={asset.id}
            delay={(index % 2) * 90}
            className={cn(
              "group relative overflow-hidden rounded-[1.6rem] border border-line bg-ink-2",
              "transition-[border-color,transform,box-shadow] duration-500 hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_24px_60px_-24px_rgba(0,230,118,0.28)]",
              tileClasses(index, assets.length)
            )}
          >
            <button
              type="button"
              onClick={() => setActiveIndex(index)}
              className="absolute inset-0 z-20 cursor-zoom-in"
              aria-label={`View ${asset.alt || projectTitle} full size`}
            />
            <Image
              src={asset.url}
              alt={asset.alt || projectTitle}
              fill
              sizes={index === 0 ? "(max-width: 1024px) 100vw, 1100px" : "(max-width: 1024px) 100vw, 560px"}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />

            {/* Gradient scrim + caption + expand affordance, revealed on hover */}
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 p-5 opacity-0 transition-all duration-500 group-hover:opacity-100">
              <span className="min-w-0 text-sm font-medium text-white">
                <span className="text-muted-foreground">
                  {String(index + 1).padStart(2, "0")} / {String(assets.length).padStart(2, "0")}
                </span>
                {asset.alt ? <span className="ml-3 line-clamp-1">{asset.alt}</span> : null}
              </span>
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand text-[#05140b]">
                <Expand className="size-4" />
              </span>
            </div>
          </Reveal>
        ))}
      </div>

      {activeIndex !== null ? (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink/95 p-4 backdrop-blur-md sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${projectTitle} gallery`}
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 z-10 flex size-11 items-center justify-center rounded-full border border-line bg-ink-2 text-white transition-colors hover:border-brand/40 hover:text-brand"
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
                className="absolute left-4 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-ink-2 text-white transition-colors hover:border-brand/40 hover:text-brand sm:left-8"
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
                className="absolute right-4 top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-ink-2 text-white transition-colors hover:border-brand/40 hover:text-brand sm:right-8"
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
              priority
            />
          </div>

          {assets[activeIndex].alt ? (
            <p className="mt-5 max-w-2xl text-center text-sm text-muted-foreground">
              {assets[activeIndex].alt}
            </p>
          ) : null}

          {/* Thumbnail strip for quick jumping */}
          {assets.length > 1 ? (
            <div
              className="mt-5 flex max-w-full items-center gap-2 overflow-x-auto px-1 pb-1"
              onClick={(event) => event.stopPropagation()}
            >
              {assets.map((asset, index) => (
                <button
                  key={asset.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to image ${index + 1}`}
                  aria-current={index === activeIndex}
                  className={cn(
                    "relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border transition-all duration-300",
                    index === activeIndex
                      ? "border-brand opacity-100"
                      : "border-line opacity-50 hover:opacity-90"
                  )}
                >
                  <Image
                    src={asset.url}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
