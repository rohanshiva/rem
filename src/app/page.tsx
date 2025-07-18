import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Home } from "@/components/screens/home";
import { getPresignedUrl } from "@/lib/storage";
import type { Recording } from "@/types";

export default async function Page() {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    redirect("/login");
  }

  const { user } = userData;
  const { data: recordingsData, error } = await supabase
    .from("recordings")
    .select(
      "id, name, summary, emotion_tags, date, processing, raw_transcription, audio_storage_path, image_storage_path"
    )
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  // Generate presigned URLs for recordings with images
  const recordings: Recording[] = await Promise.all(
    (recordingsData || []).map(async (recording) => {
      const imageUrl = recording.image_storage_path
        ? await getPresignedUrl(recording.image_storage_path, 3600) // 1 hour expiry
        : undefined;

      return {
        ...recording,
        imageUrl,
      };
    })
  );

  return <Home recordings={recordings} />;
}
