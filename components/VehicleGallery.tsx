"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

export function VehicleGallery({ images, title, sold = false }: { images: Array<string | { url: string }>; title: string; sold?: boolean }) {
  const imageUrls = images.map(img => typeof img === 'string' ? img : img.url);
  const [activeIdx, setActiveIdx] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const next = useCallback(() => setActiveIdx((prev) => (prev + 1) % imageUrls.length), [imageUrls.length]);
  const prev = useCallback(() => setActiveIdx((prev) => (prev - 1 + imageUrls.length) % imageUrls.length), [imageUrls.length]);

  // Keyboard navigation for fullscreen
  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen, next, prev]);

  // Lock body scroll in fullscreen
  useEffect(() => {
    document.body.style.overflow = fullscreen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [fullscreen]);

  return (
    <>
      {/* Main Gallery */}
      <div className="space-y-4">
        <div className="group relative w-full overflow-hidden bg-gray-100 shadow-2xl aspect-[4/3] sm:aspect-[16/9]">
          <Image
            src={imageUrls[activeIdx]}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />

          {/* Navigation */}
          <div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 justify-between opacity-0 transition-opacity group-hover:opacity-100 sm:opacity-100">
            <button
              onClick={prev}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-black shadow-lg backdrop-blur-sm hover:bg-white transition-all active:scale-90"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={next}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-black shadow-lg backdrop-blur-sm hover:bg-white transition-all active:scale-90"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          {/* Sold banner */}
          {sold && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
              <span className="bg-red-600 text-white text-xs font-extrabold uppercase tracking-widest px-5 py-2 rounded-full shadow-xl">
                SOLD
              </span>
            </div>
          )}

          {/* Fullscreen button */}
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setFullscreen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-black/50 text-white backdrop-blur-md hover:bg-black/70 transition-all"
              aria-label="View fullscreen"
            >
              <Maximize2 size={18} />
            </button>
          </div>

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-[10px] font-bold text-white uppercase tracking-widest backdrop-blur-md">
            {activeIdx + 1} / {imageUrls.length} Photos
          </div>
        </div>

        {/* Thumbnail strip */}
        <div className="flex gap-3 overflow-x-auto pb-2 px-4 scrollbar-hide">
          {imageUrls.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative h-20 w-32 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                activeIdx === idx ? "border-[#4228c4] ring-2 ring-[#4228c4]/20 scale-95" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={img} alt={`${title} - ${idx + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox */}
      {fullscreen && (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col">
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <p className="text-white/60 text-sm font-bold uppercase tracking-widest">{activeIdx + 1} / {imageUrls.length}</p>
            <p className="text-white font-semibold text-sm hidden sm:block">{title}</p>
            <button
              onClick={() => setFullscreen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Main image */}
          <div className="relative flex-1">
            <Image
              src={imageUrls[activeIdx]}
              alt={title}
              fill
              className="object-contain"
              priority
            />

            {/* Nav arrows */}
            <div className="absolute inset-x-2 top-1/2 flex -translate-y-1/2 justify-between sm:inset-x-6">
              <button
                onClick={prev}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/20 transition-all active:scale-90"
              >
                <ChevronLeft size={26} />
              </button>
              <button
                onClick={next}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/20 transition-all active:scale-90"
              >
                <ChevronRight size={26} />
              </button>
            </div>
          </div>

          {/* Bottom thumbnail strip */}
          <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
            {imageUrls.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                  activeIdx === idx ? "border-white scale-95" : "border-white/20 opacity-50 hover:opacity-80"
                }`}
              >
                <Image src={img} alt={`${title} - ${idx + 1}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
