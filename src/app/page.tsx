import { redirect } from "next/navigation";
import Link from "next/link";

import { createClient } from "@/utils/supabase/server";
import { SceneLayout } from "@/components/layout/scene-layout";
import { Title } from "@/components/layout/title";
import { Button } from "@/components/ui/button";

import { format, isToday, isYesterday, differenceInDays } from "date-fns";

function NoRecordings() {
  return (
    <>
      <Title />
      <Link href="/new">
        <Button className="text-2xl font-serif">
          <div className="flex flex-row gap-2 items-center">
            <span>New Recording</span>
            <span className="pt-1">⭢</span>
          </div>
        </Button>
      </Link>
    </>
  );
}

type RecordingType = {
  id: string;
  name: string;
  summary?: string;
  emotion_tags?: string[];
  date: string;
  processing?: boolean;
  raw_transcription?: string;
};

function Recording({ recording }: { recording: RecordingType }) {
  const tag = `REM-${recording.id.slice(0, 6).toUpperCase()}`;
  const dateObj = new Date(recording.date);
  const exactDate = format(dateObj, "PPPP");
  let dateLabel = "";
  if (isToday(dateObj)) {
    dateLabel = "Today";
  } else if (isYesterday(dateObj)) {
    dateLabel = "Yesterday";
  } else {
    const daysAgo = differenceInDays(new Date(), dateObj);
    if (daysAgo < 7) {
      dateLabel = `${daysAgo} days ago`;
    } else {
      dateLabel = exactDate;
    }
  }

  return (
    <div className="w-full max-w-[400px] aspect-[9/10]">
      <div className="rounded-md red-card-bg px-4 md:px-4 py-4 flex flex-col items-center justify-center cursor-pointer w-full h-full text-background transition-transform duration-200 hover:-rotate-2">
        <div className="rounded-md bg-[#DA4547] flex flex-col items-center justify-evenly w-full mb-2 shadow-xs flex-1">
          <div className="w-0 h-0 border-l-[24px] border-r-[24px] border-b-[16px] border-l-transparent border-r-transparent border-b-background mx-auto" />
          <div className="flex flex-col items-center justify-center">
            <div className="font-mono text-lg tracking-widest text-center mb-2 font-mono-accent">
              REM MEMORY CARD
            </div>
            <div className="font-mono text-lg text-center font-mono-accent">
              8 MB
            </div>
          </div>
        </div>
        <div className="font-mono text-md w-full break-words truncate block">
          {recording.name || tag}
        </div>
        <div className="flex flex-row gap-2 justify-between w-full items-center mt-2">
          <div className="font-mono text-sm text-muted-foreground">
            {recording.processing ? (
              <span className="shimmer shimmer-background">Processing...</span>
            ) : null}
          </div>
          <div
            className="font-mono text-xs text-right ml-auto"
            title={exactDate}
          >
            {dateLabel}
          </div>
        </div>
      </div>
    </div>
  );
}

function Recordings({ recordings }: { recordings: RecordingType[] }) {
  return (
    <div className="pb-32">
      <nav className="mb-8">
        <Link href="/">Rem</Link>
      </nav>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 bg-transparent">
        {recordings.map((recording) => (
          <Link
            href={`/recordings/${recording.id}`}
            key={recording.id}
            className="flex justify-center"
          >
            <Recording recording={recording} />
          </Link>
        ))}
      </div>
      <Link href="/new">
        <Button className="fixed bottom-0 mb-8 left-1/2 -translate-x-1/2 max-w-xs w-full text-3xl font-serif">
          New Recording
        </Button>
      </Link>
    </div>
  );
}

export default async function Home() {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    redirect("/login");
  }

  const { user } = userData;
  const { data: recordings, error: recordingsError } = await supabase
    .from("recordings")
    .select(
      "id, name, summary, emotion_tags, date, processing, raw_transcription"
    )
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (recordingsError || !recordings || recordings.length === 0) {
    return (
      <SceneLayout>
        <NoRecordings />
      </SceneLayout>
    );
  }

  return <Recordings recordings={recordings} />;
}
