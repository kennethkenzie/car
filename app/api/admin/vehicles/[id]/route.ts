import { NextResponse } from "next/server";
import { configureCloudinary } from "@/lib/cloudinary-server";
import { createSupabaseAdminClient } from "@/lib/server-supabase";

function parseVehicleId(value: string) {
  const id = Number(value);
  if (!Number.isFinite(id)) {
    throw new Error("Invalid vehicle id.");
  }
  return id;
}

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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const vehicleId = parseVehicleId(id);
    const supabase = createSupabaseAdminClient();
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = (await request.json()) as { action?: string };
      const status =
        body.action === "publish"
          ? "PUBLISHED"
          : body.action === "archive"
            ? "ARCHIVED"
            : null;

      if (!status) {
        return NextResponse.json({ error: "Unsupported action." }, { status: 400 });
      }

      const { error } = await supabase.from("Vehicle").update({ status }).eq("id", vehicleId);
      if (error) {
        throw new Error(error.message);
      }

      return NextResponse.json({ success: true });
    }

    const formData = await request.formData();
    const payload = parseVehiclePayload(formData);

    const { error: updateError } = await supabase.from("Vehicle").update(payload).eq("id", vehicleId);
    if (updateError) {
      throw new Error(updateError.message);
    }

    const imageUrls = await collectImageUrls(formData);
    const { error: deleteImagesError } = await supabase
      .from("VehicleImage")
      .delete()
      .eq("vehicleId", vehicleId);

    if (deleteImagesError) {
      throw new Error(deleteImagesError.message);
    }

    if (imageUrls.length > 0) {
      const { error: imageError } = await supabase.from("VehicleImage").insert(
        imageUrls.map((url, index) => ({
          vehicleId,
          url,
          sortOrder: index,
          isPrimary: index === 0,
        }))
      );

      if (imageError) {
        throw new Error(imageError.message);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Vehicle update failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const vehicleId = parseVehicleId(id);
    const supabase = createSupabaseAdminClient();

    const { error } = await supabase.from("Vehicle").delete().eq("id", vehicleId);
    if (error) {
      throw new Error(error.message);
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Vehicle deletion failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
