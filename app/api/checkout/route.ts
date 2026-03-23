import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/server-supabase";
import {
  buildOrderMessage,
  formatOrderNumber,
  parseNumericEntityId,
  serializeOrderMetadata,
  type OrderMetadata,
} from "@/lib/order-utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer, items, subtotal, fee, total, paymentMethod, notes } = body;

    const supabase = createSupabaseAdminClient();

    // 1. Get the first dealer to associate the enquiry with
    // In a multi-dealer system, we would query per item
    const { data: dealer, error: dealerError } = await supabase
      .from("Dealer")
      .select("id")
      .limit(1)
      .single();

    if (dealerError || !dealer) {
      throw new Error("Could not find a dealer to handle this checkout.");
    }

    const metadata: OrderMetadata = {
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        postcode: customer.postcode || "",
      },
      items,
      paymentMethod,
      subtotal,
      fee,
      total,
      notes: notes || "",
    };

    // 2. Create the order-backed enquiry
    const { data: enquiry, error: enquiryError } = await supabase
      .from("Enquiry")
      .insert({
        dealerId: dealer.id,
        vehicleId: items.length === 1 ? parseNumericEntityId(String(items[0].id)) : null,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        message: buildOrderMessage(metadata),
        notes: serializeOrderMetadata(metadata),
        status: "NEW",
        source: "website_checkout",
      })
      .select("id")
      .single();

    if (enquiryError) {
      throw enquiryError;
    }

    return NextResponse.json({
      success: true,
      orderId: String(enquiry.id),
      orderNumber: formatOrderNumber(enquiry.id),
    });
  } catch (error) {
    console.error("[Checkout API Error]:", error);
    const message = error instanceof Error ? error.message : "Submission failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
