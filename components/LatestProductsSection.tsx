"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import SafeImage from "@/components/SafeImage";
import { addToCart } from "@/lib/cart";
import { useFrontendData } from "@/lib/use-frontend-data";
import { toCloudinaryUrl } from "@/lib/cloudinary";

type Product = {
  id: string;
  name: string;
  shortDesc: string;
  image: string;
  price: number;
  oldPrice?: number;
  discountPercent?: number;
  rating?: number;
  href: string;
};

function formatUGX(n: number) {
  return `UGX ${n.toLocaleString("en-US")}`;
}

function Rating({ value = 0 }: { value?: number }) {
  const full = Math.round(value);
  return (
    <div className="flex items-center gap-1 text-gray-300">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < full ? "fill-[#f59e0b] text-[#f59e0b]" : ""}
        />
      ))}
    </div>
  );
}

export default function LatestProductsSection() {
  const data = useFrontendData();
  const section = data.latestProducts;
  const products: Product[] = section.products;

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-[1400px] px-4 py-6">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-[22px] font-semibold text-gray-900">{section.title}</h2>
          <Link
            href={section.ctaHref}
            className="text-[13px] font-semibold text-[#0b63ce] hover:underline"
          >
            {section.ctaLabel}
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {products.map((p) => (
            <div
              key={p.id}
              className="group rounded-lg bg-white"
            >
              <div className="relative overflow-hidden rounded-t-lg bg-gray-50">
                {typeof p.discountPercent === "number" && (
                  <div className="absolute left-3 top-3 z-10 rounded-sm bg-[#e11d2e] px-2 py-1 text-[13px] font-extrabold text-white">
                    -{p.discountPercent}%
                  </div>
                )}

                <button
                  className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/95 text-gray-700 hover:bg-white"
                  aria-label="Add to wishlist"
                >
                  <Heart size={18} />
                </button>

                <Link href={p.href} aria-label={p.name}>
                  <SafeImage
                    src={p.image}
                    alt={p.name}
                    className="h-[240px] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </Link>
              </div>

              <div className="flex min-h-[210px] flex-col p-4">
                <Link
                  href={p.href}
                  className="line-clamp-1 text-[16px] font-semibold text-gray-900 hover:text-[#ff6a00]"
                  title={p.name}
                >
                  {p.name}
                </Link>

                <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-gray-600">
                  {p.shortDesc}
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <div className="text-[18px] font-extrabold text-[#16a34a]">
                    {formatUGX(p.price)}
                  </div>
                  {p.oldPrice ? (
                    <div className="text-[14px] font-semibold text-[#dc2626] line-through">
                      {formatUGX(p.oldPrice)}
                    </div>
                  ) : null}
                </div>

                <div className="mt-3">
                  <Rating value={p.rating} />
                </div>

                <button
                  onClick={() =>
                    addToCart({
                      id: p.id,
                      name: p.name,
                      price: p.price,
                      image: toCloudinaryUrl(p.image),
                      href: p.href,
                    })
                  }
                  className="mt-auto inline-flex items-center justify-center gap-2 rounded-md bg-[#1f2937] px-4 py-2 text-[13px] font-semibold text-white hover:bg-black"
                >
                  <ShoppingBag size={16} />
                  ADD TO CART
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
