"use client";

import type { Recording } from "@/types";

import Link from "next/link";
import { formatter } from "@/lib/formatter";
import { BlurImage } from "@/components/ui/blur-image";

interface CardProps {
  recording: Recording;
}

export const Card = ({ recording }: CardProps) => {
  const tag = formatter.recordingTag(recording.id);
  const dateObj = new Date(recording.date);
  const exactDate = formatter.date(dateObj);
  const dateLabel = formatter.relativeDateLabel(dateObj);

  const ProcessingIndicator = () =>
    recording.processing ? (
      <span className="shimmer shimmer-background">Processing...</span>
    ) : null;

  return (
    <Link
      href={`/recordings/${recording.id}`}
      className="flex h-[286px] flex-col"
    >
      <div className="rounded-lg bg-card-background px-4 py-4 flex flex-col items-center justify-center cursor-pointer h-full text-foreground transition-transform duration-200 hover:-rotate-2">
        <div className="rounded-md bg-card-inner-background border-1 border-card-border flex flex-col items-center justify-evenly w-full mb-2 shadow-xs flex-1 relative overflow-hidden">
          {recording.imageUrl ? (
            <>
              <BlurImage
                src={recording.imageUrl}
                alt="Recording preview"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </>
          ) : (
            <>
              <div className="card-triangle" />
              <div className="flex flex-col items-center justify-center">
                <div className="font-mono text-base tracking-widest text-center mb-2 font-mono-accent opacity-75">
                  REM MEMORY CARD
                </div>
                <div className="font-mono text-base text-center font-mono-accent opacity-75">
                  8 MB
                </div>
              </div>
            </>
          )}
        </div>
        <div className="font-mono text-base truncate w-full text-center opacity-75 text-card-text">
          {recording.name || tag}
        </div>
        <div className="flex flex-row gap-2 justify-between w-full items-center mt-2">
          <div className="font-mono text-sm text-muted-foreground">
            <ProcessingIndicator />
          </div>
          <div
            className="font-mono text-xs text-right ml-auto opacity-75 text-card-text"
            title={exactDate}
          >
            {dateLabel}
          </div>
        </div>
      </div>
    </Link>
  );
};
