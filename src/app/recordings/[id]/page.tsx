import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Recording } from "@/components/screens/recording";
import { getPresignedUrl } from "@/lib/storage";
import type { RecordingWithDetails } from "@/types";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: recordingData, error } = await supabase
    .from("recordings")
    .select("id, name, summary, raw_transcription, emotion_tags, image_storage_path")
    .eq("id", id)
    .single();

  if (error || !recordingData) {
    return notFound();
  }

  // Generate presigned URL for image if it exists and add to recording object
  const imageUrl = recordingData.image_storage_path 
    ? await getPresignedUrl(recordingData.image_storage_path, 3600) // 1 hour expiry
    : undefined;

  const recording: RecordingWithDetails = {
    ...recordingData,
    imageUrl,
  };

  return <Recording recording={recording} />;
}
