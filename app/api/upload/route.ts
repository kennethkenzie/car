import { NextResponse } from "next/server";
import { configureCloudinary } from "@/lib/cloudinary-server";

async function uploadFile(file: File, folder: string) {
    const cloudinary = configureCloudinary();
    const buffer = Buffer.from(await file.arrayBuffer());

    return await new Promise<string>((resolve, reject) => {
        cloudinary.uploader
            .upload_stream(
                {
                    resource_type: "auto",
                    folder,
                    upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET || undefined,
                    timeout: 120000,
                },
                (error, result) => {
                    if (error || !result?.secure_url) {
                        reject(error || new Error("Upload failed."));
                        return;
                    }

                    resolve(result.secure_url);
                }
            )
            .end(buffer);
    });
}

export async function POST(request: Request): Promise<Response> {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const folderValue = formData.get("folder");
        const folder = typeof folderValue === "string" && folderValue.trim() ? folderValue.trim() : "brands";

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const url = await uploadFile(file, folder);

        return NextResponse.json({ url });
    } catch (error: unknown) {
        console.error("Upload error:", error);
        const message = error instanceof Error ? error.message : "Upload failed.";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
