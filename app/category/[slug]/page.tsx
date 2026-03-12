"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Star } from "lucide-react";
import { Header } from "@/components/Header";
import SafeImage from "@/components/SafeImage";
import { getCategoryPageData } from "@/lib/catalog";
import { useFrontendData } from "@/lib/use-frontend-data";

function formatUGX(value: number) {
  return `UGX ${value.toLocaleString("en-US")}`;
}

export default function CategoryPage() {
  const data = useFrontendData();
  const params = useParams<{ slug: string }>();
  const slug = typeof params?.slug === "string" ? params.slug : "";
  const category = getCategoryPageData(data, slug);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#f7f7f7]">
        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-[1400px] px-4 py-8">
            <div className="mb-4 text-[13px] text-gray-500">
              <Link href="/" className="hover:text-[#0b63ce] hover:underline">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-700">{category.title}</span>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
              <div>
                <h1 className="text-[34px] font-bold tracking-tight text-gray-900">
                  {category.title}
                </h1>
                <p className="mt-3 max-w-[760px] text-[15px] leading-7 text-gray-600">
                  {category.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="#products"
                    className="rounded-full bg-[#114f8f] px-5 py-3 text-[14px] font-semibold text-white hover:bg-[#0d3c6d]"
                  >
                    Browse products
                  </Link>
                  <Link
                    href="/"
                    className="rounded-full border border-gray-300 bg-white px-5 py-3 text-[14px] font-semibold text-gray-900 hover:border-gray-400"
                  >
                    Continue shopping
                  </Link>
                </div>
              </div>

              <div className="overflow-hidden rounded-[28px] border border-gray-200 bg-gray-50">
                <SafeImage
                  src={category.image}
                  alt={category.title}
                  className="h-[260px] w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="products" className="mx-auto max-w-[1400px] px-4 py-8">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="text-[24px] font-bold text-gray-900">Available Items</h2>
              <p className="mt-1 text-[14px] text-gray-600">
                {category.products.length} item{category.products.length === 1 ? "" : "s"} in this collection
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {category.products.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
              >
                <Link href={product.href} className="block bg-gray-50">
                  <SafeImage
                    src={product.image}
                    alt={product.name}
                    className="h-[240px] w-full object-cover"
                  />
                </Link>

                <div className="p-5">
                  <Link
                    href={product.href}
                    className="line-clamp-2 text-[17px] font-semibold text-gray-900 hover:text-[#0b63ce]"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-2 line-clamp-3 text-[14px] leading-6 text-gray-600">
                    {product.shortDesc}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-[#f59e0b]">
                    <Star size={16} className="fill-current" />
                    <span className="text-[14px] font-medium text-gray-700">
                      {(product.rating ?? 4).toFixed(1)}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-3">
                    <div className="text-[20px] font-bold text-[#16a34a]">
                      {formatUGX(product.price)}
                    </div>
                    {product.oldPrice ? (
                      <div className="text-[14px] text-gray-400 line-through">
                        {formatUGX(product.oldPrice)}
                      </div>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
