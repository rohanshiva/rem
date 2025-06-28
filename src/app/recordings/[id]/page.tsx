import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import RecordingWithAnimation from "@/components/animation/recording-with-animation";

export default async function RecordingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: recording, error } = await supabase
    .from("recordings")
    .select("id, name, summary, raw_transcription, emotion_tags")
    .eq("id", id)
    .single();

  if (error || !recording) {
    return notFound();
  }

  return (
    <RecordingWithAnimation recording={recording}>
      <div className="text-foreground">
        <nav className="mb-8">
          <Link href="/">Rem</Link>
        </nav>
        <h1 className="text-2xl font-semibold font-mono-accent mt-12 mb-6 break-words">
          {recording.name}
        </h1>
        {recording.emotion_tags && recording.emotion_tags.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-mono-accent mb-2">Emotions</h2>
            <div className="flex flex-wrap gap-2">
              {recording.emotion_tags.map((emotion: string) => (
                <div
                  key={emotion}
                  className="rounded-md px-2 py-1 bg-accent text-background font-mono text-sm"
                >
                  {emotion}
                </div>
              ))}
            </div>
          </section>
        )}
        <section className="mb-8">
          <h2 className="text-xl font-mono-accent mb-2">Summary</h2>
          <div className="text-sm leading-relaxed whitespace-pre-line">
            {recording.summary ? (
              recording.summary
            ) : (
              <span className="text-xs font-mono">No summary available.</span>
            )}
          </div>
        </section>
        <section className="mb-8">
          <h2 className="text-xl font-mono-accent mb-2">Raw Transcription</h2>
          <div className="text-sm leading-relaxed whitespace-pre-line">
            {recording.raw_transcription ? (
              recording.raw_transcription
            ) : (
              <span className="text-xs font-mono">
                No transcription available.
              </span>
            )}
          </div>
        </section>
      </div>
    </RecordingWithAnimation>
  );
}
