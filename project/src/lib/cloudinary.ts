import { Buffer } from "buffer";
import { v2 as cloudinary } from "cloudinary";

const cloudName = (
  process.env.CLOUDINARY_NAME ||
  process.env.CLOUDINARY_CLOUD_NAME ||
  ""
)
  .replace(/['"]/g, "")
  .trim();

const apiKey = (
  process.env.CLOUDINARY_KEY ||
  process.env.CLOUDINARY_API_KEY ||
  ""
)
  .replace(/['"]/g, "")
  .trim();

const apiSecret = (
  process.env.CLOUDINARY_SECRET ||
  process.env.CLOUDINARY_API_SECRET ||
  ""
)
  .replace(/['"]/g, "")
  .trim();

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export const UploadOnCloudinary = async (
  file: Blob | File
): Promise<string | null> => {
  if (!file) {
    return null;
  }

  if (!cloudName || !apiKey || !apiSecret) {
    const missing = [];
    if (!cloudName) missing.push("CLOUDINARY_NAME");
    if (!apiKey) missing.push("CLOUDINARY_KEY");
    if (!apiSecret) missing.push("CLOUDINARY_SECRET");
    throw new Error(`Missing Cloudinary configuration parameters: ${missing.join(", ")}`);
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = (file as File).type || "image/jpeg";
    const base64Data = buffer.toString("base64");
    const fileUri = `data:${mimeType};base64,${base64Data}`;

    const uploadResponse = await cloudinary.uploader.upload(fileUri, {
      folder: "next-project",
      resource_type: "auto",
    });

    if (uploadResponse && uploadResponse.secure_url) {
      return uploadResponse.secure_url;
    }

    throw new Error("Cloudinary did not return a valid secure URL.");
  } catch (error: any) {
    console.error("Cloudinary upload failed:", error?.message || error);
    throw new Error(error?.message || "Failed to upload image to Cloudinary.");
  }
};

export const uploadOnCloudinary = UploadOnCloudinary;
