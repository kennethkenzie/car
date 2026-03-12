import {
  defaultFrontendData,
  type FrontendData,
} from "@/lib/frontend-data";

type JsonRecord = Record<string, unknown>;

const IMAGE_REPLACEMENTS: Record<string, string> = {
  "https://images.unsplash.com/photo-1580508244245-c446ca981a47?auto=format&fit=crop&w=900&q=80":
    "https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=900",
  "https://images.unsplash.com/photo-1581092583537-20d51b4b4f8f?auto=format&fit=crop&w=900&q=80":
    "https://images.pexels.com/photos/4219862/pexels-photo-4219862.jpeg?auto=compress&cs=tinysrgb&w=900",
};

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeFrontendValue(value: unknown): unknown {
  if (typeof value === "string") {
    return IMAGE_REPLACEMENTS[value] ?? value;
  }

  if (Array.isArray(value)) {
    return value.map(normalizeFrontendValue);
  }

  if (isRecord(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, normalizeFrontendValue(entry)])
    );
  }

  return value;
}

function deepMerge<T>(base: T, override: unknown): T {
  if (Array.isArray(base)) {
    return (Array.isArray(override) ? override : base) as T;
  }

  if (isRecord(base) && isRecord(override)) {
    const result: JsonRecord = { ...base };
    for (const [key, value] of Object.entries(override)) {
      result[key] = key in base ? deepMerge((base as JsonRecord)[key], value) : value;
    }
    return result as T;
  }

  return (override ?? base) as T;
}

export function cloneDefaultFrontendData(): FrontendData {
  return JSON.parse(JSON.stringify(defaultFrontendData)) as FrontendData;
}

export function mergeFrontendData(data: unknown): FrontendData {
  return deepMerge(cloneDefaultFrontendData(), normalizeFrontendValue(data));
}
