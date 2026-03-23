import { NextResponse } from "next/server";
import { getCachedFeaturedVehicles } from "@/lib/api-cache";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit")) || 4;
  const type = searchParams.get("type") as "CAR" | "VAN" | null;

  try {
    const data = await getCachedFeaturedVehicles(limit, type || undefined);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 });
  }
}
