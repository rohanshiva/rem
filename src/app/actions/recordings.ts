"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { deleteFile } from "@/lib/storage";

export async function deleteRecording(
  recordingId: string,
  audioStoragePath?: string
) {
  const supabase = await createClient();

  if (audioStoragePath) {
    await deleteFile(audioStoragePath);
  }

  // Delete recording from database
  const { error: dbError } = await supabase
    .from("recordings")
    .delete()
    .eq("id", recordingId);

  if (dbError) {
    throw new Error("Failed to delete recording");
  }

  // Revalidate the page to refresh the recordings list
  revalidatePath("/");
}
