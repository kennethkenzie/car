"use client";

import Link from "next/link";
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
    status: "PUBLISHED"
  }));

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-[1440px] px-6 py-12">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">{section.title}</h2>
            <p className="mt-2 text-gray-500 font-medium">Recently added premium inventory</p>
          </div>
          <Link
            href={section.ctaHref}
            className="group flex items-center gap-2 text-sm font-bold text-[#4228c4] hover:text-black transition-colors"
          >
            {section.ctaLabel}
            <div className="h-px w-8 bg-[#4228c4] group-hover:bg-black transition-colors" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {vehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      </div>
    </section>
  );
}
