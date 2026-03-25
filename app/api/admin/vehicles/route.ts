import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { configureCloudinary } from "@/lib/cloudinary-server";
import { createSupabaseAdminClient } from "@/lib/server-supabase";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readNullableString(formData: FormData, key: string) {
  const value = readString(formData, key);
  return value ? value : null;
}

function readRequiredNumber(formData: FormData, key: string) {
  const value = Number(readString(formData, key));
  if (!Number.isFinite(value)) {
    throw new Error(`Invalid ${key} value.`);
  }
  return value;
}

function readOptionalNumber(formData: FormData, key: string) {
  const raw = readString(formData, key);
  if (!raw) return null;

  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

function parseVehiclePayload(formData: FormData) {
  return {
    dealerId: readRequiredNumber(formData, "dealerId"),
    type: readString(formData, "type") === "VAN" ? "VAN" : "CAR",
    listingCategory: readString(formData, "listingCategory") === "HIRE" ? "HIRE" : "SALE",
    status: (readString(formData, "status") || "DRAFT") as
      | "DRAFT"
      | "PUBLISHED"
      | "ARCHIVED"
      | "SOLD",
    make: readString(formData, "make"),
    model: readString(formData, "model"),
    trim: readNullableString(formData, "trim"),
    year: readRequiredNumber(formData, "year"),
    price: readRequiredNumber(formData, "price"),
    mileage: readRequiredNumber(formData, "mileage"),
    fuel: readString(formData, "fuel"),
    transmission: readString(formData, "transmission"),
    bodyType: readNullableString(formData, "bodyType"),
    color: readNullableString(formData, "colour") || readNullableString(formData, "color"),
    doors: readOptionalNumber(formData, "doors"),
    description: readNullableString(formData, "description"),
    locationPostcode: readString(formData, "postcode"),
    condition: readNullableString(formData, "condition"),
    city: readNullableString(formData, "city"),
    features: readNullableString(formData, "features"),
    stockType: readString(formData, "stockType") === "NEW" ? "NEW" : "USED",
  };
}

async function uploadImage(file: File) {
  const cloudinary = configureCloudinary();
  const buffer = Buffer.from(await file.arrayBuffer());

  return await new Promise<string>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          resource_type: "image",
          folder: "marketplace/vehicles",
          upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET || undefined,
        },
        (error, result) => {
          if (error || !result?.secure_url) {
            reject(error || new Error("Image upload failed."));
            return;
          }

          resolve(result.secure_url);
        }
      )
      .end(buffer);
  });
}

async function collectImageUrls(formData: FormData) {
  const existingImages = formData
    .getAll("existingImages")
    .filter((value): value is string => typeof value === "string" && Boolean(value.trim()))
    .map((value) => value.trim());

  const uploadedImages = await Promise.all(
    formData
      .getAll("images")
      .filter((value): value is File => value instanceof File && value.size > 0)
      .map((file) => uploadImage(file))
  );

  return [...existingImages, ...uploadedImages];
}

export async function POST(request: Request) {
  try {
    const supabase = createSupabaseAdminClient();
    const formData = await request.formData();
    const payload = parseVehiclePayload(formData);

    const { data: vehicle, error } = await supabase
      .from("Vehicle")
      .insert(payload)
      .select("id")
      .single();

    if (error || !vehicle) {
      throw new Error(error?.message || "Vehicle creation failed.");
    }

    const imageUrls = await collectImageUrls(formData);
    if (imageUrls.length > 0) {
      const { error: imageError } = await supabase.from("VehicleImage").insert(
        imageUrls.map((url, index) => ({
          vehicleId: vehicle.id,
          url,
          sortOrder: index,
          isPrimary: index === 0,
        }))
      );

      if (imageError) {
        throw new Error(imageError.message);
      }
    }

    try {
      revalidateTag("vehicles", { expire: 0 });
    } catch {}

    return NextResponse.json({ success: true, id: vehicle.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Vehicle creation failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
