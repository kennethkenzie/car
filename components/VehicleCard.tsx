"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "./Badge";
import { Vehicle } from "@/lib/types";
import { formatGBP } from "@/lib/utils";
import { ArrowRight, MapPin } from "lucide-react";

export function VehicleCard({ vehicle, view = "grid" }: { vehicle: Vehicle; view?: "grid" | "list" }) {
  const href = `/${vehicle.type === "VAN" ? "vans" : "cars"}/${vehicle.slug || vehicle.id}`;

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-none border border-gray-100 bg-white transition-all duration-300 cursor-pointer hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-[#4228c4]/20 ${view === "list" ? "md:flex-row md:h-64" : ""
        }`}
    >
      {/* Image Section */}
      <Link href={href} className={`relative block overflow-hidden ${view === "list" ? "md:w-[40%] md:shrink-0" : "aspect-[16/10]"}`}>
        <Image
          src={vehicle.images?.[0] ? (typeof vehicle.images[0] === 'string' ? vehicle.images[0] : vehicle.images[0].url) : '/placeholder-car.jpg'}
          alt={`${vehicle.make} ${vehicle.model}`}
          width={700}
          height={420}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <Badge variant="outline" className="bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-900 border border-white/20">
            {vehicle.type}
          </Badge>
        </div>
      </Link>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-1.5 text-gray-400 mb-2">
          <MapPin className="h-3 w-3" />
          <span className="text-[10px] font-bold uppercase tracking-wider">{vehicle.postcode}</span>
        </div>

        <div className="mb-4">
          <Link href={href}>
            <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1 group-hover:text-[#4228c4] transition-colors">
              {vehicle.make} {vehicle.model}
            </h3>
          </Link>
          <p className="text-sm font-medium text-gray-500 truncate">{vehicle.trim}</p>
        </div>

        <div className="mt-auto">
          <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs font-bold text-gray-400 mb-4">
            <span>{vehicle.year}</span>
            <span className="text-gray-300">•</span>
            <span>{vehicle.mileage.toLocaleString()} mi</span>
            <span className="text-gray-300">•</span>
            <span>{vehicle.fuel}</span>
            <span className="text-gray-300">•</span>
            <span>{vehicle.transmission}</span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
            <div>
              <p className="text-lg font-bold text-gray-900">{formatGBP(vehicle.price)}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">UGX 420,000 / mo</p>
            </div>

            <Link
              href={href}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-black px-5 text-sm font-semibold text-white shadow-md shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-800"
            >
              <span>Buy now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
