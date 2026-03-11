"use client";

import Link from "next/link";
import SafeImage from "@/components/SafeImage";
import { useFrontendData } from "@/lib/use-frontend-data";

export default function CategoryTilesSection() {
  const data = useFrontendData();
  const cards = data.categoryTiles.cards;

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-[1400px] px-4 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <h3 className="text-[20px] font-extrabold leading-snug text-gray-900">
                {card.title}
              </h3>

              <div className="mt-4 grid grid-cols-2 gap-4">
                {card.tiles.map((t) => (
                  <Link
                    key={t.label}
                    href={t.href}
                    className="group block"
                    aria-label={t.label}
                  >
                    <div className="aspect-[4/3] overflow-hidden rounded-xl bg-gray-100">
                      <SafeImage
                        src={t.image}
                        alt={t.label}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="mt-2 text-[13px] text-gray-800 group-hover:text-[#ff6a00]">
                      {t.label}
                    </div>
                  </Link>
                ))}
              </div>

              <Link
                href={card.cta.href}
                className="mt-6 inline-block text-[13px] font-semibold text-[#0b63ce] hover:underline"
              >
                {card.cta.label}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
