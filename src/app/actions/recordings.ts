"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteRecording(
  recordingId: string,
  audioStoragePath?: string
) {
  const supabase = await createClient();

  if (audioStoragePath) {
    const { error: storageError } = await supabase.storage
      .from("audio")
      .remove([audioStoragePath]);

    if (storageError) {
      throw Error("Failed to delete audio recording");
    }
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
