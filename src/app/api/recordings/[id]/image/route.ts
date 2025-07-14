import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { downloadFile } from "@/lib/storage";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Check if user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get recording and verify ownership
    const { data: recording, error: recordingError } = await supabase
      .from("recordings")
      .select("image_storage_path, user_id")
      .eq("id", id)
      .single();

    if (recordingError || !recording) {
      return NextResponse.json({ error: "Recording not found" }, { status: 404 });
    }

    // Verify user owns this recording
    if (recording.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if image exists
    if (!recording.image_storage_path) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Download image from R2
    const imageBlob = await downloadFile(recording.image_storage_path);

    // Return image with proper headers
    return new NextResponse(imageBlob, {
      headers: {
        "Content-Type": imageBlob.type,
        "Cache-Control": "private, max-age=3600", // Cache for 1 hour but private
      },
    });
  } catch (error) {
    console.error("Error serving image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 