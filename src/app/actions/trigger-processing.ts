"use server";

import { inngest } from "@/inngest/client";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function triggerProcessing(audioStoragePath: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: userError };
  }

  const { data: recording, error: insertError } = await supabase
    .from("recordings")
    .insert({
      name: null,
      date: new Date().toISOString(),
      audio_storage_path: audioStoragePath,
      user_id: user.id,
      emotion_tags: [],
      processing: true,
    })
    .select()
    .single();

  if (insertError) {
    return { error: insertError };
  }

  await inngest.send({
    name: "recording/created",
    data: {
      recordingId: recording.id,
      audioStoragePath: audioStoragePath,
      userId: user.id,
    },
  });

  revalidatePath("/");

  return { data: recording };
}
