"use client";

import { useRouter } from "next/navigation";
import { addToCart } from "@/lib/cart";
import { Vehicle } from "@/lib/types";

function getVehicleImage(vehicle: Vehicle) {
  const firstImage = vehicle.images?.[0];

  if (!firstImage) return "/placeholder-car.jpg";
  if (typeof firstImage === "string") return firstImage;
  return firstImage.url;
}

export function VehiclePurchaseActions({
  vehicle,
  label = "Buy Now",
}: {
  vehicle: Vehicle;
  label?: string;
}) {
  const router = useRouter();

  const handleBuyNow = () => {
    addToCart({
      id: vehicle.id,
      name: `${vehicle.make} ${vehicle.model}`,
      price: typeof vehicle.price === "number" ? vehicle.price : Number(vehicle.price),
      image: getVehicleImage(vehicle),
      href: `/${vehicle.type === "VAN" ? "vans" : "cars"}/${vehicle.slug || vehicle.id}`,
    });

    router.push("/cart");
  };

  return (
    <button
      onClick={handleBuyNow}
      className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 text-sm font-bold text-white transition-all hover:bg-white/10 active:scale-95"
    >
      {label}
    </button>
  );
}
