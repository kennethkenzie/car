import "server-only";
import { unstable_cache } from "next/cache";
import { getFeaturedVehicles as getFeaturedRaw, getPublicVehicles as getPublicRaw } from "./api";

export const getCachedFeaturedVehicles = (limit = 4, type?: "CAR" | "VAN") => unstable_cache(
  async () => getFeaturedRaw(limit, type),
  [`featured-vehicles-${limit}-${type || 'all'}`],
  { tags: ["vehicles"], revalidate: 3600 }
)();

export const getCachedPublicVehicles = (type?: "CAR" | "VAN") => unstable_cache(
  async () => getPublicRaw(type),
  [`public-vehicles-${type || 'all'}`],
  { tags: ["vehicles"], revalidate: 3600 }
)();
