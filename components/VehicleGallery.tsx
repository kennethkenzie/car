"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface ImageItem {
  url: string;
}

export function VehicleGallery({ images, title }: { images: Array<string | { url: string }>; title: string }) {
  const imageUrls = images.map(img => typeof img === 'string' ? img : img.url);
  const [activeIdx, setActiveIdx] = useState(0);

  const next = () => setActiveIdx((prev) => (prev + 1) % imageUrls.length);
  const prev = () => setActiveIdx((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);

  return (
    <div className="space-y-4">
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[2.5rem] bg-gray-100 shadow-2xl group">
        <Image
          src={imageUrls[activeIdx]}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority
        />
        
        {/* Navigation Overlays */}
        <div className="absolute inset-x-4 top-1/2 flex -translate-y-1/2 justify-between opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={prev}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-black shadow-lg backdrop-blur-sm hover:bg-white transition-all active:scale-90"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={next}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-black shadow-lg backdrop-blur-sm hover:bg-white transition-all active:scale-90"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="absolute top-6 right-6">
          <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/50 text-white backdrop-blur-md hover:bg-black/70 transition-all">
            <Maximize2 size={20} />
          </button>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-[10px] font-bold text-white uppercase tracking-widest backdrop-blur-md">
          {activeIdx + 1} / {imageUrls.length} Photos
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {imageUrls.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIdx(idx)}
            className={`relative h-24 w-40 shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${
              activeIdx === idx ? "border-[#4228c4] ring-2 ring-[#4228c4]/20 scale-95" : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <Image src={img} alt={`${title} - image ${idx + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
