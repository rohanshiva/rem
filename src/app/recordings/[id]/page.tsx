import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Recording } from "@/components/screens/recording";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: recording, error } = await supabase
    .from("recordings")
    .select("id, name, summary, raw_transcription, emotion_tags, image_storage_path")
    .eq("id", id)
    .single();

  if (error || !recording) {
    return notFound();
  }

  return <Recording recording={recording} />;
}
