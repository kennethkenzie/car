"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { VehicleCard } from "@/components/VehicleCard";
import { useFrontendData } from "@/lib/use-frontend-data";
import { Vehicle } from "@/lib/types";
import { getFeaturedVehicles, getPublicVehicles } from "@/lib/api";

export default function LatestProductsSection() {
  const data = useFrontendData();
  const section = data.latestProducts;
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showingFeatured, setShowingFeatured] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadLatestVehicles() {
      try {
        setIsLoading(true);
        const featuredVehicles = await getFeaturedVehicles(4);
        if (active) {
          if (featuredVehicles.length > 0) {
            setVehicles(featuredVehicles as Vehicle[]);
            setShowingFeatured(true);
            return;
          }

          const liveVehicles = await getPublicVehicles();
          setVehicles((liveVehicles as Vehicle[]).slice(0, 4));
          setShowingFeatured(false);
        }
      } catch (error) {
        console.error("Failed to load latest vehicles.", error);
        if (active) {
          setVehicles([]);
          setShowingFeatured(false);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadLatestVehicles();

    return () => {
      active = false;
    };
  }, []);

  if (!isLoading && vehicles.length === 0) return null;

  return (
    <section className="w-full bg-[#fcfcfc]">
      <div className="mx-auto max-w-[1520px] px-6 py-20 lg:py-24 xl:px-8">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              {showingFeatured ? "Featured Cars" : section.title}
            </h2>
            <p className="mt-3 text-lg text-gray-500 font-medium">
              {showingFeatured ? "Hand-picked featured inventory from the latest live stock" : "Recently added premium inventory"}
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
