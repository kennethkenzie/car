"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import SafeImage from "@/components/SafeImage";
import { useFrontendData } from "@/lib/use-frontend-data";
import { defaultFrontendData } from "@/lib/frontend-data";

export default function DynamicCategorySection() {
    const data = useFrontendData();
    const brands = data.brands || [];

    const featuredBrands = (brands.length > 0 ? brands : defaultFrontendData.brands)
        .filter((brand) => brand.isActive && brand.isFeatured)
        .sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER));

    if (featuredBrands.length === 0) return null;

    return (
        <section className="relative w-full overflow-hidden bg-white py-20 pb-24">
            {/* Ambient Background Elements */}
            <div className="absolute left-0 top-0 -z-10 h-72 w-72 translate-x-[-10%] translate-y-[-10%] rounded-full bg-[#f6c400]/5 blur-[100px]" />
            <div className="absolute right-0 bottom-0 -z-10 h-96 w-96 translate-x-[10%] translate-y-[10%] rounded-full bg-[#0b63ce]/5 blur-[120px]" />

            <div className="mx-auto max-w-[1560px] px-6 xl:px-8">
                <div className="mb-12 flex flex-col items-start justify-between gap-4 border-b border-gray-100 pb-8 sm:flex-row sm:items-end">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Browse by <span className="text-[#ff6a00]">Brand</span>
                        </h2>
                        <p className="mt-2 text-lg text-gray-500">
                            Shop trusted manufacturers using their official brand marks.
                        </p>
                    </div>
                    <Link
                        href="/cars"
                        className="group flex items-center gap-2 text-sm font-bold text-gray-900 transition-colors hover:text-[#ff6a00]"
                    >
                        View All Brands
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
                    {featuredBrands.map((brand) => (
                        <Link
                            key={brand.id}
                            href={`/cars?make=${encodeURIComponent(brand.title)}`}
                            className="group relative flex min-h-[150px] flex-col items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-white/70 p-6 text-center shadow-sm transition-all duration-500 backdrop-blur-md hover:-translate-y-1 hover:border-orange-200 hover:bg-white hover:shadow-xl hover:shadow-orange-100/40"
                        >
                            <SafeImage
                                src={brand.logo}
                                alt={`${brand.title} logo`}
                                className="max-h-10 w-auto max-w-full object-contain transition-all duration-500 group-hover:scale-105"
                            />

                            <span className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 translate-y-2 whitespace-nowrap text-[14px] font-bold tracking-tight text-[#ff6a00] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                {brand.title}
                            </span>

                            <div className="pointer-events-none absolute bottom-6 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-[#ff6a00] transition-all duration-500 group-hover:w-8" />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
