import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/server-supabase";
import {
  buildOrderSearchText,
  formatOrderNumber,
  parseOrderMetadata,
  type OrderRecord,
} from "@/lib/order-utils";

function parseOrderId(value: string) {
  const id = Number(value);
  if (!Number.isFinite(id)) {
    throw new Error("Invalid order id.");
  }
  return id;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = parseOrderId(id);
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from("Enquiry")
      .select("*, Vehicle(make, model, year, price)")
      .eq("id", orderId)
      .eq("source", "website_checkout")
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const metadata = parseOrderMetadata(data.notes);
    const order: OrderRecord = {
      id: String(data.id),
      orderNumber: formatOrderNumber(data.id),
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      notes: data.notes,
      status: data.status,
      source: data.source,
      createdAt: data.createdAt,
      vehicle: data.Vehicle
        ? {
            make: data.Vehicle.make,
            model: data.Vehicle.model,
            year: data.Vehicle.year,
            price: data.Vehicle.price,
          }
        : null,
      metadata,
      searchText: buildOrderSearchText({
        id: String(data.id),
        name: data.name,
        email: data.email,
        metadata,
      }),
    };

    return NextResponse.json(order);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Order lookup failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
