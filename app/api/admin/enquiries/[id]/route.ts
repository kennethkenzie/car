import { NextResponse } from "next/server";
import { parseOrderMetadata, serializeOrderMetadata } from "@/lib/order-utils";
import { createSupabaseAdminClient } from "@/lib/server-supabase";

function parseEnquiryId(value: string) {
  const id = Number(value);
  if (!Number.isFinite(id)) {
    throw new Error("Invalid enquiry id.");
  }
  return id;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const enquiryId = parseEnquiryId(id);
    const supabase = createSupabaseAdminClient();
    const body = (await request.json()) as {
      action?: "status" | "note";
      status?: string;
      note?: string;
    };

    if (body.action === "status") {
      if (!body.status) {
        return NextResponse.json({ error: "Missing status." }, { status: 400 });
      }

      const { error } = await supabase
        .from("Enquiry")
        .update({ status: body.status, updatedAt: new Date().toISOString() })
        .eq("id", enquiryId);

      if (error) throw new Error(error.message);
      return NextResponse.json({ success: true });
    }

    if (body.action === "note") {
      const { data: existing, error: readError } = await supabase
        .from("Enquiry")
        .select("notes, source")
        .eq("id", enquiryId)
        .limit(1)
        .single();

      if (readError) throw new Error(readError.message);

      const nextNote = body.note?.trim();
      if (!nextNote) {
        return NextResponse.json({ error: "Missing note." }, { status: 400 });
      }

      const nextPayload =
        existing?.source === "website_checkout"
          ? (() => {
              const metadata = parseOrderMetadata(existing.notes);
              if (!metadata) {
                throw new Error("Order metadata is missing or invalid.");
              }

              return serializeOrderMetadata({
                ...metadata,
                adminNotes: [...(metadata.adminNotes ?? []), nextNote],
              });
            })()
          : (() => {
              const currentNotes =
                typeof existing?.notes === "string" && existing.notes.trim()
                  ? `${existing.notes}\n\n`
                  : "";
              return `${currentNotes}${nextNote}`;
            })();

      const { error } = await supabase
        .from("Enquiry")
        .update({
          notes: nextPayload,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", enquiryId);

      if (error) throw new Error(error.message);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unsupported action." }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Enquiry update failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const enquiryId = parseEnquiryId(id);
    const supabase = createSupabaseAdminClient();

    const { error } = await supabase.from("Enquiry").delete().eq("id", enquiryId);
    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Enquiry deletion failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
