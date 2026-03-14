"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  BadgeCheck,
} from "lucide-react";
import SafeImage from "@/components/SafeImage";
import { useFrontendData } from "@/lib/use-frontend-data";

export default function HeroCarouselWithRightCards() {
  const data = useFrontendData();
  const slides = data.hero.slides;
  const rightCards = data.hero.sideCards;

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const total = slides.length;
  const activeIndex = total > 0 ? active % total : 0;

  const go = (idx: number) => {
    if (!total) return;
    const next = (idx + total) % total;
    setActive(next);
  };

  useEffect(() => {
    if (!total) return;
    if (paused) return;
    const t = setInterval(() => {
      setActive((prev) => (prev + 1) % total);
    }, 5000);
    return () => clearInterval(t);
  }, [paused, total]);

  return (
    <section className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1400px] px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          <div
            className="col-span-12 h-full overflow-hidden rounded-2xl border border-gray-200 shadow-sm lg:col-span-8"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div className="relative h-full">
              <div
                className="flex h-full transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {slides.map((s) => (
                  <div key={s.id} className="relative h-full min-w-full">
                    <div className="relative h-full min-h-[420px]">
                      <SafeImage
                        src={s.image}
                        alt="Carousel background"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/15" />

                      <div className="relative z-[1] flex h-full min-h-[420px] flex-col justify-end p-8 md:p-10">
                        <div className="max-w-[640px]">
                          <h2 className="font-display text-[30px] font-bold leading-tight text-white md:text-[42px]">
                            {s.title}
                          </h2>
                          <p className="mt-3 max-w-[560px] text-[15px] leading-6 text-white/85 md:text-[17px]">
                            {s.description}
                          </p>
                        </div>

                        <div className="mt-12 flex items-center gap-3">
                          <Link
                            href={s.ctaHref}
                            className="font-display inline-flex items-center gap-2 rounded-lg border border-white/60 bg-white px-5 py-3 text-[14px] font-bold text-gray-900 shadow-sm hover:border-white hover:bg-gray-100"
                            aria-label="Go to slide action"
                          >
                            {s.ctaLabel}
                            <ArrowRight size={18} />
                          </Link>
                        </div>

                        <div className="mt-8 flex items-center gap-3">
                          {slides.map((_, i) => (
                            <button
                              key={i}
                              onClick={() => go(i)}
                              className={[
                                "h-2.5 rounded-full transition-all",
                                i === activeIndex
                                  ? "w-7 bg-[#ff6a00]"
                                  : "w-5 bg-white/70 hover:bg-white",
                              ].join(" ")}
                              aria-label={`Go to slide ${i + 1}`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="absolute bottom-6 right-6 z-[2] hidden rounded-xl bg-white/90 p-3 shadow-sm backdrop-blur md:block">
                        <BadgeCheck size={16} className="text-[#f59e0b]" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm md:flex">
                <button
                  onClick={() => go(active + 1)}
                  className="flex h-12 w-12 items-center justify-center hover:bg-gray-50"
                  aria-label="Next slide"
                >
                  <ChevronRight size={18} />
                </button>
                <div className="h-px w-full bg-gray-200" />
                <button
                  onClick={() => go(active - 1)}
                  className="flex h-12 w-12 items-center justify-center hover:bg-gray-50"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={18} />
                </button>
              </div>

              <div className="absolute bottom-6 right-6 z-10 flex gap-2 md:hidden">
                <button
                  onClick={() => go(active - 1)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm active:scale-[0.98]"
                  aria-label="Previous slide"
                >
                  <ArrowLeft size={18} />
                </button>
                <button
                  onClick={() => go(active + 1)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm active:scale-[0.98]"
                  aria-label="Next slide"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className="col-span-12 flex flex-col gap-6 lg:col-span-4">
            {rightCards.map((c) => (
              <Link
                key={c.id}
                href={c.href}
                className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-[#f6f7f9] shadow-sm"
              >
                <div className="grid min-h-[220px] grid-cols-12 gap-4 p-4 sm:min-h-[250px] sm:p-6">
                  <div className="col-span-12 flex items-center justify-center sm:col-span-5">
                    <SafeImage
                      src={c.image}
                      alt={c.title}
                      className="h-[140px] w-full max-w-[220px] rounded-xl object-cover shadow-sm transition-transform duration-300 group-hover:scale-[1.03] sm:h-[120px] sm:w-[160px]"
                    />
                  </div>

                  <div className="col-span-12 flex flex-col justify-center sm:col-span-7">
                    <div className="text-[12px] font-semibold tracking-wide text-gray-500">
                      {c.eyebrow}
                    </div>
                    <div className="font-display mt-2 text-[22px] font-bold leading-tight text-gray-900 sm:text-[26px]">
                      {c.title}
                    </div>

                    <div className="font-display mt-4 inline-flex w-fit items-center gap-2 rounded-lg bg-white px-4 py-2 text-[13px] font-bold text-gray-900 shadow-sm ring-1 ring-gray-200 group-hover:ring-gray-300">
                      Shop deals
                      <ArrowRight size={16} className="text-[#ff6a00]" />
                    </div>
                  </div>
                </div>

                <div className="absolute inset-x-0 bottom-0 h-[3px] bg-transparent transition-colors duration-300 group-hover:bg-[#ff6a00]" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
