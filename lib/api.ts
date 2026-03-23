import { supabase } from "./supabase";
import {
  buildOrderSearchText,
  formatOrderNumber,
  parseOrderMetadata,
  type OrderRecord,
} from "./order-utils";

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

type DealerRow = {
  id: number;
  name: string;
  slug: string;
  email: string;
  phone: string;
  address: string;
  postcode: string;
  logoUrl: string | null;
  status: "ACTIVE" | "PENDING" | "INACTIVE";
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

function extractVehicleId(value: string) {
  if (/^\d+$/.test(value)) return Number(value);

  const match = value.match(/-(\d+)$/);
  return match ? Number(match[1]) : null;
}

async function readVehicles(filters?: { type?: "CAR" | "VAN"; publishedOnly?: boolean }) {
  let query = supabase
    .from("Vehicle")
    .select("*, VehicleImage(*)")
    .order("createdAt", { ascending: false });

  if (filters?.type) {
    query = query.eq("type", filters.type);
  }

  if (filters?.publishedOnly) {
    query = query.eq("status", "PUBLISHED");
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as VehicleRow[]).map(mapVehicleRow);
}

export async function getFeaturedVehicles(limit = 4, type?: "CAR" | "VAN") {
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

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as VehicleRow[]).map(mapVehicleRow);
}

async function readVehicleById(id: number) {
  const { data, error } = await supabase
    .from("Vehicle")
    .select("*, VehicleImage(*)")
    .eq("id", id)
    .limit(1);

  if (error) {
    console.error(`[API] readVehicleById error (id: ${id}):`, error);
    throw new Error(error.message);
  }

  if (!data || data.length === 0) return null;

  return mapVehicleRow(data[0] as VehicleRow);
}

async function apiRequest<T>(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init);

  if (!response.ok) {
    let message = `Request failed with ${response.status}`;
    try {
      const body = (await response.json()) as { error?: string };
      if (body.error) {
        message = body.error;
      }
    } catch {
      // Ignore parse failure and use default message.
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}

export async function getPublicVehicles(type?: "CAR" | "VAN") {
  return readVehicles({ type, publishedOnly: true });
}

export async function fetchDealerInventory() {
  return readVehicles();
}

export async function getVehicleById(id: string) {
  const numericId = extractVehicleId(id);
  if (numericId === null) return null;
  return readVehicleById(numericId);
}

export async function deleteVehicleReal(id: string) {
  return apiRequest<{ success: true }>(`/api/admin/vehicles/${id}`, {
    method: "DELETE",
  });
}

export async function publishVehicleReal(id: string) {
  return apiRequest<{ success: true }>(`/api/admin/vehicles/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: "publish" }),
  });
}

export async function archiveVehicleReal(id: string) {
  return apiRequest<{ success: true }>(`/api/admin/vehicles/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: "archive" }),
  });
}

export async function featureVehicleReal(id: string) {
  return apiRequest<{ success: true }>(`/api/admin/vehicles/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: "feature" }),
  });
}

export async function unfeatureVehicleReal(id: string) {
  return apiRequest<{ success: true }>(`/api/admin/vehicles/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: "unfeature" }),
  });
}

export async function updateVehicleReal(id: string, formData: FormData) {
  return apiRequest<{ success: true }>(`/api/admin/vehicles/${id}`, {
    method: "PATCH",
    body: formData,
  });
}

export async function createVehicleReal(formData: FormData) {
  return apiRequest<{ success: true }>("/api/admin/vehicles", {
    method: "POST",
    body: formData,
  });
}

export async function adminCreateDealer(formData: FormData) {
  console.log(`[API] Admin creating dealer:`, Object.fromEntries(formData.entries()));
  return { success: true };
}

export async function deleteDealerReal(id: string) {
  console.log(`[API] Deleting dealer ${id}`);
  return { success: true };
}

export async function updateDealerReal(id: string, formData: FormData) {
  console.log(`[API] Updating dealer ${id}:`, Object.fromEntries(formData.entries()));
  return { success: true };
}

export async function getDealers(): Promise<any[]> {
  const { data, error } = await supabase
    .from("Dealer")
    .select("*")
    .order("createdAt", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as DealerRow[]).map((dealer) => ({
    id: String(dealer.id),
    name: dealer.name,
    slug: dealer.slug,
    email: dealer.email,
    phone: dealer.phone,
    address: dealer.address,
    postcode: dealer.postcode,
    logoUrl: dealer.logoUrl || undefined,
    status: dealer.status,
  }));
}

export async function getVehicleReal(slug: string) {
  return getVehicleById(slug);
}

export async function getSimilarVehiclesReal(slug: string, type: "CAR" | "VAN") {
  const currentId = extractVehicleId(slug);
  const all = await getPublicVehicles(type);
  return all.filter((vehicle) => Number(vehicle.id) !== currentId);
}

export async function getDashboardSummary() {
  const inventory = await fetchDealerInventory();
  const activeListings = inventory.filter((vehicle) => vehicle.status === "PUBLISHED").length;
  const draftListings = inventory.filter((vehicle) => vehicle.status === "DRAFT").length;

  return {
    activeListings,
    draftListings,
    enquiriesThisWeek: 124,
    avgDaysToSell: 14,
    recentEnquiries: inventory.slice(0, 5).map((vehicle, index) => ({
      id: `inventory-${vehicle.id}`,
      name: `Vehicle enquiry ${index + 1}`,
      email: "customer@carbazaar.com",
      createdAt: new Date().toISOString(),
      status: "NEW",
      vehicle: { make: vehicle.make, model: vehicle.model },
    })),
  };
}

export async function getEnquiries() {
  const { data, error } = await supabase
    .from("Enquiry")
    .select("*, Vehicle(make, model, year, price)")
    .order("createdAt", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data.map((enquiry) => ({
    id: String(enquiry.id),
    name: enquiry.name,
    email: enquiry.email,
    phone: enquiry.phone,
    message: enquiry.message,
    notes: enquiry.notes,
    status: enquiry.status,
    source: enquiry.source,
    createdAt: enquiry.createdAt,
    vehicle: enquiry.Vehicle ? {
      make: enquiry.Vehicle.make,
      model: enquiry.Vehicle.model,
      year: enquiry.Vehicle.year,
      price: enquiry.Vehicle.price
    } : null
  }));
}

export async function getOrders(): Promise<OrderRecord[]> {
  const enquiries = await getEnquiries();

  return enquiries
    .filter((enquiry) => enquiry.source === "website_checkout")
    .map((order) => {
      const metadata = parseOrderMetadata(order.notes);

      return {
        ...order,
        orderNumber: formatOrderNumber(order.id),
        metadata,
        searchText: buildOrderSearchText({
          id: order.id,
          name: order.name,
          email: order.email,
          metadata,
        }),
      };
    });
}

export async function updateEnquiryStatus(id: string, status: string) {
  return apiRequest<{ success: true }>(`/api/admin/enquiries/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "status", status }),
  });
}

export async function addEnquiryNote(id: string, note: string) {
  return apiRequest<{ success: true }>(`/api/admin/enquiries/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "note", note }),
  });
}

export async function deleteEnquiry(id: string) {
  return apiRequest<{ success: true }>(`/api/admin/enquiries/${id}`, {
    method: "DELETE",
  });
}

export async function getOrderById(id: string) {
  return apiRequest<OrderRecord>(`/api/orders/${id}`);
}

export async function getDatabaseHealth() {
  try {
    const { error } = await supabase.from("Vehicle").select("id", { count: "exact", head: true });
    if (error) throw error;

    return {
      database: "connected",
      details: "Supabase inventory tables reachable",
    };
  } catch (err) {
    console.error("Supabase health check failed:", err);
    return {
      database: "disconnected",
      details: "Connection Error",
    };
  }
}
