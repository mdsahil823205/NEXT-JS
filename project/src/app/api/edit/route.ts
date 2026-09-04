import authOption from "@/lib/auth";
import { UploadOnCloudinary } from "@/lib/cloudinary";
import { ConnectionDb } from "@/lib/db";
import { User } from "@/model/user.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await ConnectionDb();

    const session = await getServerSession(authOption);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized. Please log in to proceed." },
        { status: 401 },
      );
    }

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const file = formData.get("file") as Blob | null;

    // Retrieve current user from DB by ID or fallback to email
    const existingUser =
      (session.user.id ? await User.findById(session.user.id) : null) ||
      (await User.findOne({ email: session.user.email }));

    if (!existingUser) {
      return NextResponse.json(
        { message: "User profile not found." },
        { status: 404 },
      );
    }

    let imageUrl = existingUser.image ?? null;

    // Upload image to Cloudinary if a new file is provided
    if (file && file.size > 0) {
      try {
        const uploadedUrl = await UploadOnCloudinary(file);
        imageUrl = uploadedUrl;
      } catch (uploadError: any) {
        return NextResponse.json(
          {
            message: `Image upload failed: ${uploadError.message}. Please check your Cloudinary configuration.`,
          },
          { status: 500 },
        );
      }
    }

    const user = await User.findByIdAndUpdate(
      existingUser._id,
      {
        name: name || existingUser.name,
        image: imageUrl,
      },
      { new: true },
    ).select("-password");

    if (!user) {
      return NextResponse.json(
        { message: "Failed to update user profile." },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        message: "User profile updated successfully.",
        user,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("API /api/edit error:", error);
    return NextResponse.json(
      { message: "Internal server error occurred while updating profile." },
      { status: 500 },
    );
  }
}
