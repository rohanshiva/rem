import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Home } from "@/components/screens/home";

export default async function Page() {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    redirect("/login");
  }

  const { user } = userData;
  const { data: recordings, error: recordingsError } = await supabase
    .from("recordings")
    .select(
      "id, name, summary, emotion_tags, date, processing, raw_transcription, audio_storage_path"
    )
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  return <Home recordings={recordings || []} />;
}
