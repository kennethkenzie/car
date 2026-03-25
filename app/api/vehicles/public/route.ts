import { NextResponse } from "next/server";
import { getCachedPublicVehicles } from "@/lib/api-cache";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") as "CAR" | "VAN" | null;
  const listingCategory = searchParams.get("listingCategory") as "SALE" | "HIRE" | null;

  try {
    const data = await getCachedPublicVehicles(type || undefined, listingCategory || "SALE");
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 });
  }
}
