"use client";

import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import { useFrontendData } from "@/lib/use-frontend-data";
import { ArrowRight } from "lucide-react";

export default function CategoryTilesSection() {
  const data = useFrontendData();
  const cards = data.categoryTiles.cards;

  return (
    <section className="w-full bg-gray-50/50 py-12">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="flex flex-col rounded-3xl border border-gray-100 bg-white p-6 shadow-sm shadow-gray-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/60"
            >
              <h3 className="text-xl font-bold leading-tight text-gray-900 group-hover:text-[#0b63ce]">
                {card.title}
              </h3>

              <div className="mt-6 grid grid-cols-2 gap-4">
                {card.tiles.map((t) => (
                  <Link
                    key={t.label}
                    href={t.href}
                    className="group block"
                    aria-label={t.label}
                  >
                    <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
                      <SafeImage
                        src={t.image}
                        alt={t.label}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="mt-2 text-sm font-medium text-gray-700 transition-colors group-hover:text-[#0b63ce]">
                      {t.label}
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-auto pt-8">
                <Link
                  href={card.cta.href}
                  className="group inline-flex items-center gap-2 text-sm font-bold text-[#0b63ce]"
                >
                  {card.cta.label}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
