import { revalidateTag, unstable_cache } from "next/cache";
import { mergeFrontendData, cloneDefaultFrontendData } from "@/lib/frontend-data-merge";
import type { FrontendData } from "@/lib/frontend-data";

export const getCachedFrontendData = unstable_cache(
  async () => readFrontendDataFromSupabase(),
  ["site-data"],
  { tags: ["site-data"], revalidate: 3600 }
);

type SiteContentConfig = {
  table: string;
  key: string;
  valueColumn: string;
  description?: string;
};

const SITE_CONTENT_CONFIGS: SiteContentConfig[] = [
  {
    table: "site_content",
    key: "frontend",
    valueColumn: "data",
  },
  {
    table: "site_settings",
    key: "frontend_data",
    valueColumn: "value",
    description: "Serialized storefront and admin-managed frontend content",
  },
];

function getSupabaseUrl() {
  return process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
}

function getReadKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
}

function getWriteKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY;
}

function buildHeaders(apiKey: string, extra?: HeadersInit): HeadersInit {
  return {
    apikey: apiKey,
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseUrl() && getReadKey());
}

async function fetchFrontendRow(
  url: string,
  apiKey: string,
  config: SiteContentConfig
) {
  const response = await fetch(
    `${url}/rest/v1/${config.table}?key=eq.${config.key}&select=${config.valueColumn}&limit=1`,
    {
      headers: buildHeaders(apiKey),
      cache: "no-store",
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Supabase read failed with ${response.status}`);
  }

  const rows = (await response.json()) as Record<string, unknown>[];
  return rows[0]?.[config.valueColumn];
}

export async function readFrontendDataFromSupabase(): Promise<FrontendData | null> {
  const url = getSupabaseUrl();
  const apiKey = getReadKey();
  if (!url || !apiKey) return null;

  for (const config of SITE_CONTENT_CONFIGS) {
    const value = await fetchFrontendRow(url, apiKey, config);
    if (typeof value !== "undefined" && value !== null) {
      return mergeFrontendData(value);
    }
  }

  return null;
}

export async function writeFrontendDataToSupabase(data: FrontendData) {
  const url = getSupabaseUrl();
  const apiKey = getWriteKey();
  if (!url || !apiKey) {
    throw new Error("Supabase service role credentials are missing.");
  }

  let lastError: Error | null = null;

  for (const config of SITE_CONTENT_CONFIGS) {
    const payload: Record<string, unknown> = {
      key: config.key,
      [config.valueColumn]: data,
    };

    if (config.description) {
      payload.description = config.description;
    }

    const response = await fetch(
      `${url}/rest/v1/${config.table}?on_conflict=key`,
      {
        method: "POST",
        headers: buildHeaders(apiKey, {
          Prefer: "resolution=merge-duplicates,return=representation",
        }),
        body: JSON.stringify([payload]),
        cache: "no-store",
      }
    );

    if (response.status === 404) {
      continue;
    }

    if (!response.ok) {
      lastError = new Error(`Supabase write failed with ${response.status}`);
      continue;
    }

    const rows = (await response.json()) as Record<string, unknown>[];
    const value = rows[0]?.[config.valueColumn];
    
    // Invalidate Cache after successful write
    try {
      revalidateTag("site-data", { expire: 0 });
    } catch (e) {
      console.warn("[Cache] Failed to revalidateTag:", e);
    }

    return value ? mergeFrontendData(value) : data;
  }

  if (lastError) {
    throw lastError;
  }

  throw new Error("Supabase write failed because no supported site content table was found.");
}
