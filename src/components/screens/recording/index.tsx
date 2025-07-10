"use client";

import type { RecordingWithDetails } from "@/types";

import { Link } from "next-view-transitions";
import Sequence from "./sequence";
import * as FadeIn from "@/components/ui/fade-in";

interface Props {
  recording: RecordingWithDetails;
}

export const Recording = ({ recording }: Props) => {
  return (
    <Sequence recording={recording}>
      <FadeIn.Container className="text-foreground">
        <FadeIn.Item>
          <nav className="mb-8">
            <Link href="/">Rem</Link>
          </nav>
        </FadeIn.Item>
        
        <FadeIn.Item>
          <h1 className="text-2xl font-semibold font-mono-accent mt-12 mb-6 break-words">
            {recording.name}
          </h1>
        </FadeIn.Item>

        {recording.emotion_tags && recording.emotion_tags.length > 0 && (
          <FadeIn.Item>
            <section className="mb-8">
              <h2 className="text-xl font-mono-accent mb-2">Emotions</h2>
              <div className="flex flex-wrap gap-2">
                {recording.emotion_tags.map((emotion: string) => (
                  <div
                    key={emotion}
                    className="rounded-md px-2 py-1 bg-accent text-background font-mono text-sm card-shadow"
                  >
                    {emotion}
                  </div>
                ))}
              </div>
            </section>
          </FadeIn.Item>
        )}

        <FadeIn.Item>
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
        </FadeIn.Item>

        <FadeIn.Item>
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
        </FadeIn.Item>
      </FadeIn.Container>
    </Sequence>
  );
}; 