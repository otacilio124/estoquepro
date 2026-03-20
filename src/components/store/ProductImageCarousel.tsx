"use client";

import { useState, useEffect } from "react";

type ProductImageCarouselProps = {
  images: string[];
  productName: string;
};

export function ProductImageCarousel({ images, productName }: ProductImageCarouselProps) {
  const [current, setCurrent] = useState(0);

  // Auto-slide every 4 seconds when there are multiple images
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  const goTo = (index: number) => setCurrent(index);
  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);

  return (
    <div className="grid gap-4 lg:grid-cols-[auto_1fr]">
      {/* Thumbnails */}
      <div className="flex gap-3 lg:flex-col">
        {images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            onClick={() => goTo(index)}
            className={`flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border transition-all duration-200 ${
              index === current
                ? "border-emerald-400 ring-1 ring-emerald-400/50"
                : "border-zinc-800/70 bg-zinc-950/60 hover:border-zinc-600"
            }`}
          >
            <img
              src={image}
              alt={`${productName} miniatura ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="surface relative flex items-center justify-center overflow-hidden rounded-2xl p-4">
        <img
          key={current}
          src={images[current]}
          alt={`${productName} foto ${current + 1}`}
          className="h-72 w-full rounded-xl object-cover transition-opacity duration-500"
          style={{ animation: "fadeIn 0.4s ease" }}
        />

        {/* Navigation arrows – only show if multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-zinc-700 bg-zinc-900/80 p-2 text-zinc-300 backdrop-blur-sm transition hover:bg-emerald-500/20 hover:text-emerald-300"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-zinc-700 bg-zinc-900/80 p-2 text-zinc-300 backdrop-blur-sm transition hover:bg-emerald-500/20 hover:text-emerald-300"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current ? "w-5 bg-emerald-400" : "w-1.5 bg-zinc-600"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(1.03); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
