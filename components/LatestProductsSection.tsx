"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { VehicleCard } from "@/components/VehicleCard";
import { useFrontendData } from "@/lib/use-frontend-data";
import { Vehicle } from "@/lib/types";

export default function LatestProductsSection() {
  const data = useFrontendData();
  const section = data.latestProducts;
  
  // Transform mock data to Vehicle type for the demo
  const vehicles: Vehicle[] = section.products.map(p => ({
    id: p.id,
    make: p.name.split(' ')[0],
    model: p.name.split(' ').slice(1).join(' '),
    trim: p.shortDesc,
    year: 2022,
    mileage: 12500,
    fuel: "Petrol",
    transmission: "Automatic",
    price: p.price,
    type: p.href.includes('/vans/') ? "VAN" : "CAR",
    postcode: "KAMPALA",
    images: [p.image],
    status: "PUBLISHED",
    dealerId: "1",
    slug: p.id
  }));

  if (vehicles.length === 0) return null;

  return (
    <section className="w-full bg-[#fcfcfc]">
      <div className="mx-auto max-w-[1280px] px-6 py-20 lg:py-24">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">{section.title}</h2>
            <p className="mt-3 text-lg text-gray-500 font-medium">Recently added premium inventory</p>
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
          {vehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      </div>
    </section>
  );
}
