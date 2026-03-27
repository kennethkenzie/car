import "server-only";
import { unstable_cache } from "next/cache";
import {
  getFeaturedVehicles as getFeaturedRaw,
  getPublicVehicles as getPublicRaw,
} from "./server-vehicle-api";

export const getCachedFeaturedVehicles = (
  limit = 4,
  type?: "CAR" | "VAN",
  listingCategory?: "SALE" | "HIRE"
) => unstable_cache(
  async () => getFeaturedRaw(limit, type, listingCategory),
  [`featured-vehicles-${limit}-${type || 'all'}-${listingCategory || 'all'}`],
  { tags: ["vehicles"], revalidate: 3600 }
)();

export const getCachedPublicVehicles = (
  type?: "CAR" | "VAN",
  listingCategory?: "SALE" | "HIRE"
) => unstable_cache(
  async () => getPublicRaw(type, listingCategory),
  [`public-vehicles-${type || 'all'}-${listingCategory || 'all'}`],
  { tags: ["vehicles"], revalidate: 3600 }
)();
