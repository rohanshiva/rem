"use server";

import { uploadFile } from "@/lib/storage";
import { createClient } from "@/utils/supabase/server";
import { triggerProcessing } from "./trigger-processing";

export async function uploadRecording(blob: Blob, filename: string) {
  const supabase = await createClient();
  
  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  // Upload file
  const storagePath = `${user.id}/${filename}`;
  await uploadFile(storagePath, blob, {
    cacheControl: "public, max-age=3600",
  });

  // Trigger processing
  const processingResult = await triggerProcessing(storagePath);
  
  if (processingResult.error) {
    throw new Error("Upload succeeded but failed to start processing");
  }

  return processingResult.data;
} 