"use client";

import Image from "next/image";
import Link from "next/link";
import { Vehicle } from "@/lib/types";
import { formatGBP } from "@/lib/utils";
import {
  ArrowRight,
  MapPin,
} from "lucide-react";

export function VehicleCard({
  vehicle,
  view = "grid",
}: {
  vehicle: Vehicle;
  view?: "grid" | "list";
}) {
  const href = `/${vehicle.type === "VAN" ? "vans" : "cars"}/${vehicle.slug || vehicle.id}`;

  return (
    <article
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-none border border-gray-100 bg-white transition-all duration-300 hover:border-[#4228c4]/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] ${
        view === "list" ? "md:h-64 md:flex-row" : ""
      }`}
    >
      <Link
        href={href}
        className={`relative block overflow-hidden ${
          view === "list" ? "md:w-[40%] md:shrink-0" : "aspect-[16/10]"
        }`}
      >
        <Image
          src={
            vehicle.images?.[0]
              ? typeof vehicle.images[0] === "string"
                ? vehicle.images[0]
                : vehicle.images[0].url
              : "/placeholder-car.jpg"
          }
          alt={`${vehicle.make} ${vehicle.model}`}
          width={700}
          height={420}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-2 flex items-center gap-1.5 text-gray-400">
          <MapPin className="h-3 w-3" />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {vehicle.postcode}
          </span>
        </div>

        <div className="mb-4">
          <Link href={href}>
            <h3 className="mb-1 text-lg font-bold leading-tight text-gray-900 transition-colors group-hover:text-[#4228c4]">
              {vehicle.make} {vehicle.model}
            </h3>
          </Link>
        </div>

        <div className="mt-auto">
          <div className="mb-4 flex flex-wrap gap-x-2 gap-y-1 text-xs font-bold text-black">
            <span>{vehicle.year}</span>
            <span className="text-black">&bull;</span>
            <span>{vehicle.mileage.toLocaleString()} mi</span>
            <span className="text-black">&bull;</span>
            <span>{vehicle.fuel}</span>
            <span className="text-black">&bull;</span>
            <span>{vehicle.transmission}</span>
          </div>

          <div className="flex items-center justify-between border-t border-gray-50 pt-4">
            <div>
              <p className="text-lg font-bold text-gray-900">{formatGBP(vehicle.price)}</p>
            </div>

            <Link
              href={href}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-[#ff6a00] px-5 text-xs font-semibold text-white shadow-md shadow-orange-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#e65f00]"
            >
              <span>View Details</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
