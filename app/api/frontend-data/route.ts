import { NextResponse } from "next/server";
import { mergeFrontendData } from "@/lib/frontend-data-merge";
import type { FrontendData } from "@/lib/frontend-data";
import {
  isSupabaseConfigured,
  getCachedFrontendData,
  writeFrontendDataToSupabase,
} from "@/lib/supabase-site-content";

export async function GET() {
  try {
    const data = await getCachedFrontendData();
    return NextResponse.json({
      data: data ?? mergeFrontendData({}),
      source: data ? "supabase" : "default",
      configured: isSupabaseConfigured(),
    });
  } catch (error) {
    console.error("Failed to read frontend data from Supabase.", error);
    return NextResponse.json(
      {
        data: mergeFrontendData({}),
        source: "default",
        configured: isSupabaseConfigured(),
        error: "Failed to read frontend data from Supabase.",
      },
      { status: 200 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as Partial<FrontendData>;
    const data = mergeFrontendData(body);
    const saved = await writeFrontendDataToSupabase(data);
    return NextResponse.json({ data: saved, source: "supabase" });
  } catch (error) {
    console.error("Failed to write frontend data to Supabase.", error);
    return NextResponse.json(
      { error: "Failed to write frontend data to Supabase." },
      { status: 500 }
    );
  }
}
