"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import SafeImage from "@/components/SafeImage";
import { useFrontendData } from "@/lib/use-frontend-data";

type RelatedProduct = {
  id: string;
  title: string;
  image: string;
  href: string;
  rating: number;
  reviews?: string;
  price: string;
  oldPrice?: string;
  tag?: string;
};

function Rating({
  rating,
  reviews,
}: {
  rating: number;
  reviews?: string;
}) {
  const full = Math.round(rating);

  return (
    <div className="mt-1 flex items-center gap-1 text-[14px]">
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={15}
            className={
              i < full
                ? "fill-[#de7921] text-[#de7921]"
                : "text-gray-300"
            }
          />
        ))}
      </div>
      {reviews ? <span className="text-[#0F6CBF]">{reviews}</span> : null}
    </div>
  );
}

export default function RelatedProductsCarousel() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const data = useFrontendData();
  const section = data.relatedProducts;
  const products: RelatedProduct[] = section.products;

  const scrollByAmount = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 900;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-[1500px] px-4 py-6 lg:px-6">
        <div className="border-t border-gray-300 pt-3">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <h2 className="text-[20px] font-bold leading-none text-gray-900 md:text-[22px]">
                {section.title}
              </h2>
              <span className="mt-1 text-[14px] text-gray-500">{section.sponsoredLabel}</span>
              <span className="mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-300 text-[10px] font-bold text-white">
                i
              </span>
            </div>

            <div className="hidden text-[14px] text-gray-700 md:block">
              {section.pageLabel}
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => scrollByAmount("left")}
              className="absolute left-0 top-[120px] z-10 hidden h-10 w-10 -translate-x-1/2 items-center justify-center rounded-lg border border-gray-400 bg-white text-gray-700 shadow-sm hover:bg-gray-50 lg:flex"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={() => scrollByAmount("right")}
              className="absolute right-0 top-[120px] z-10 hidden h-10 w-10 translate-x-1/2 items-center justify-center rounded-lg border border-gray-400 bg-white text-gray-700 shadow-sm hover:bg-gray-50 lg:flex"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>

            <div
              ref={scrollRef}
              className="scrollbar-hide overflow-x-auto"
            >
              <div className="flex min-w-max gap-5 pb-2">
                {products.map((product) => (
                  <article
                    key={product.id}
                    className="w-[170px] flex-shrink-0 sm:w-[180px] md:w-[185px]"
                  >
                    <Link href={product.href} className="group block">
                      <div className="flex h-[170px] items-center justify-center overflow-hidden bg-white">
                        <SafeImage
                          src={product.image}
                          alt={product.title}
                          className="max-h-full w-auto max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      </div>
                    </Link>

                    <div className="mt-3">
                      <Link
                        href={product.href}
                        className="line-clamp-3 text-[15px] leading-7 text-[#0F6CBF] hover:text-[#c7511f] hover:underline"
                      >
                        {product.title}
                      </Link>

                      <Rating
                        rating={product.rating}
                        reviews={product.reviews}
                      />

                      {product.tag ? (
                        <div className="mt-2">
                          <span className="inline-flex rounded bg-[#cc0c39] px-2 py-1 text-[12px] font-semibold text-white">
                            {product.tag}
                          </span>
                        </div>
                      ) : null}

                      <div className="mt-1 flex flex-wrap items-end gap-2">
                        <span className="text-[14px] text-gray-700">UGX</span>
                        <span className="text-[29px] leading-none text-gray-900">
                          {product.price.replace("UGX ", "")}
                        </span>
                      </div>

                      {product.oldPrice ? (
                        <div className="mt-1 text-[14px] text-gray-500">
                          List:{" "}
                          <span className="line-through">{product.oldPrice}</span>
                        </div>
                      ) : null}

                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-3 text-right text-[13px] text-gray-700 md:hidden">
              {section.pageLabel}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
