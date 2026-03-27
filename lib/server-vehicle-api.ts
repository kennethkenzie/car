import "server-only";

import { createSupabaseAdminClient } from "./server-supabase";

type VehicleImageRow = {
  id: number;
  vehicleId: number;
  url: string;
  sortOrder: number;
  isPrimary: boolean;
};

type VehicleRow = {
  id: number;
  dealerId: number;
  type: "CAR" | "VAN";
  listingCategory?: "SALE" | "HIRE" | null;
  status: "PUBLISHED" | "DRAFT" | "SOLD" | "ARCHIVED";
  make: string;
  model: string;
  trim: string | null;
  year: number;
  price: number;
  mileage: number;
  fuel: string;
  transmission: string;
  bodyType: string | null;
  color: string | null;
  doors: number | null;
  seats: number | null;
  engineSize: number | null;
  description: string | null;
  locationPostcode: string;
  createdAt: string;
  updatedAt: string;
  condition?: string | null;
  city?: string | null;
  features?: string | null;
  stockType?: "NEW" | "USED" | null;
  isFeatured?: boolean | null;
  VehicleImage?: VehicleImageRow[];
};

function slugifyPart(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildVehicleSlug(row: Pick<VehicleRow, "id" | "make" | "model">) {
  return `${slugifyPart(row.make)}-${slugifyPart(row.model)}-${row.id}`;
}

function normalizeFeatureList(features: string | null | undefined) {
  return (
    features
      ?.split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean) ?? []
  );
}

function mapVehicleRow(row: VehicleRow) {
  const images = [...(row.VehicleImage ?? [])].sort(
    (left, right) => left.sortOrder - right.sortOrder
  );
  const stockType: "NEW" | "USED" = row.stockType === "NEW" ? "NEW" : "USED";

  return {
    id: String(row.id),
    slug: buildVehicleSlug(row),
    make: row.make?.trim() || "Unknown",
    model: row.model?.trim() || "Vehicle",
    trim: row.trim?.trim() || "Standard",
    year: row.year,
    mileage: row.mileage,
    fuel: row.fuel,
    transmission: row.transmission,
    price: row.price,
    type: row.type,
    listingCategory: (row.listingCategory === "HIRE" ? "HIRE" : "SALE") as "SALE" | "HIRE",
    postcode: row.locationPostcode,
    images: images.map((image) => ({ id: String(image.id), url: image.url })),
    status: row.status,
    dealerId: String(row.dealerId),
    isFeatured: Boolean(row.isFeatured),
    bodyType: row.bodyType || "",
    colour: row.color || "",
    condition: row.condition || "Excellent",
    doors: row.doors ?? "",
    city: row.city || "",
    description: row.description || "",
    features: normalizeFeatureList(row.features),
    stockType,
  };
}

export async function getFeaturedVehicles(
  limit = 4,
  type?: "CAR" | "VAN",
  listingCategory?: "SALE" | "HIRE"
) {
  const supabase = createSupabaseAdminClient();
  let query = supabase
    .from("Vehicle")
    .select("*, VehicleImage(*)")
    .eq("status", "PUBLISHED")
    .eq("isFeatured", true)
    .order("updatedAt", { ascending: false })
    .limit(limit);

  if (type) {
    query = query.eq("type", type);
  }

  if (listingCategory) {
    query = query.eq("listingCategory", listingCategory);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as VehicleRow[]).map(mapVehicleRow);
}

export async function getPublicVehicles(
  type?: "CAR" | "VAN",
  listingCategory?: "SALE" | "HIRE"
) {
  const supabase = createSupabaseAdminClient();
  let query = supabase
    .from("Vehicle")
    .select("*, VehicleImage(*)")
    .eq("status", "PUBLISHED")
    .order("createdAt", { ascending: false });

  if (type) {
    query = query.eq("type", type);
  }

  if (listingCategory) {
    query = query.eq("listingCategory", listingCategory);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as VehicleRow[]).map(mapVehicleRow);
}
