"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { VehicleCard } from "@/components/VehicleCard";
import { useFrontendData } from "@/lib/use-frontend-data";
import { Vehicle } from "@/lib/types";

export default function LatestProductsSection() {
  const data = useFrontendData();
  const section = data.latestProducts;

  const { data: vData, isLoading } = useQuery({
    queryKey: ["latest-vehicles"],
    queryFn: async () => {
      try {
        const fRes = await fetch("/api/vehicles/featured?limit=8&listingCategory=SALE");
        if (!fRes.ok) throw new Error("Failed to fetch featured");
        const featuredVehicles = await fRes.json();

        if (Array.isArray(featuredVehicles) && featuredVehicles.length > 0) {
          return { vehicles: featuredVehicles as Vehicle[], showingFeatured: true };
        }

        const pRes = await fetch("/api/vehicles/public?listingCategory=SALE");
        if (!pRes.ok) throw new Error("Failed to fetch public");
        const liveVehicles = await pRes.json();

        return { vehicles: (liveVehicles as Vehicle[]).slice(0, 8), showingFeatured: false };
      } catch (error) {
        console.error("Failed to load latest vehicles.", error);
        return { vehicles: [], showingFeatured: false };
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const vehicles = vData?.vehicles ?? [];
  const showingFeatured = vData?.showingFeatured ?? false;

  if (!isLoading && vehicles.length === 0) return null;

  return (
    <section className="w-full bg-[#fcfcfc]">
      <div className="mx-auto max-w-[1520px] px-6 py-20 lg:py-24 xl:px-8">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              {showingFeatured ? "Latest Inventory" : section.title}
            </h2>
            <p className="mt-3 text-lg text-gray-500 font-medium">
              {showingFeatured ? "Hand-picked featured inventory from our latest live stock" : "Recently added premium inventory"}
            </p>
          </div>
          <Link
            href={section.ctaHref}
            className="group flex items-center gap-2 text-sm font-bold text-[#0b63ce] hover:text-black transition-colors"
          >
            {section.ctaLabel}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`latest-skeleton-${index}`}
                  className="aspect-[16/10] animate-pulse rounded-[2rem] bg-gray-100"
                />
              ))
            : vehicles.map((v) => <VehicleCard key={v.id} vehicle={v} />)}
        </div>
      </div>
    </section>
  );
}
