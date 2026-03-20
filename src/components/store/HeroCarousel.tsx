"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CarouselSlideItem } from "@/repositories/CarouselRepository";

type HeroCarouselProps = {
  slides: CarouselSlideItem[];
};

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  if (slides.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-zinc-950/60 border border-zinc-800/70 surface">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="w-full shrink-0 flex flex-col md:flex-row relative"
          >
            {/* Background Image (Blurred for effect if needed, but here we just use it as side content) */}
            <div className="absolute inset-0 z-0 hidden md:block opacity-20 transition-opacity duration-1000">
              <img
                src={slide.image_url}
                alt=""
                className="w-full h-full object-cover blur-3xl scale-110"
              />
            </div>
            
            <div className="relative z-10 flex flex-1 flex-col justify-center p-8 md:p-12 space-y-6 md:max-w-xl left-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-300">
                  Destaque
                </p>
                <h2 className="text-3xl font-semibold text-zinc-50 md:text-5xl line-clamp-2 leading-tight">
                  {slide.title}
                </h2>
                {slide.subtitle && (
                  <p className="text-sm text-zinc-300 line-clamp-2 md:text-base">
                    {slide.subtitle}
                  </p>
                )}
                
                {slide.link_text && slide.link_url && (
                  <div className="pt-2">
                    <Link
                      href={slide.link_url}
                      className="inline-flex items-center justify-center rounded-lg bg-emerald-500 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                    >
                      {slide.link_text}
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div className="relative z-10 w-full h-64 md:h-auto md:w-1/2 flex items-center justify-center p-6 bg-gradient-to-l from-zinc-900/50 to-transparent">
              <img
                src={slide.image_url}
                alt={slide.title}
                className="max-h-full max-w-full object-contain rounded-xl drop-shadow-2xl transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "w-8 bg-emerald-400"
                  : "w-2 bg-emerald-400/30 hover:bg-emerald-400/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
