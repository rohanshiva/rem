"use client";

import type { Recording } from "@/types";

import { Link } from "next-view-transitions";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { formatter } from "@/lib/formatter";
import { Eye, Trash2 } from "lucide-react";
import { deleteRecording } from "@/app/actions/recordings";
import React from "react";

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

  const CardContent = React.forwardRef<HTMLDivElement>((props, ref) => (
    <div ref={ref} className="w-[260px] h-[286px]">
      <div className="rounded-lg blue-card-bg px-4 py-4 flex flex-col items-center justify-center cursor-pointer w-full h-full text-background transition-transform duration-200 hover:-rotate-2 card-shadow">
        <div className="rounded-md bg-inner-blue flex flex-col items-center justify-evenly w-full mb-2 shadow-xs flex-1">
          <div className="card-triangle" />
          <div className="flex flex-col items-center justify-center">
            <div className="font-mono text-base tracking-widest text-center mb-2 font-mono-accent text-white">
              REM MEMORY CARD
            </div>
            <div className="font-mono text-base text-center font-mono-accent text-white">
              8 MB
            </div>
          </div>
        </div>
        <div className="font-mono text-base w-full break-words truncate block text-white">
          {recording.name || tag}
        </div>
        <div className="flex flex-row gap-2 justify-between w-full items-center mt-2">
          <div className="font-mono text-sm text-muted-foreground">
            <ProcessingIndicator />
          </div>
          <div
            className="font-mono text-xs text-right ml-auto text-white"
            title={exactDate}
          >
            {dateLabel}
          </div>
        </div>
      </div>
    </div>
  ));

  const CardMenu = () => (
    <ContextMenuContent>
      <Link href={`/recordings/${recording.id}`}>
        <ContextMenuItem>
          <Eye />
          Open Recording
        </ContextMenuItem>
      </Link>
      <ContextMenuItem
        variant="destructive"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          deleteRecording(recording.id, recording.audio_storage_path);
        }}
      >
        <Trash2 />
        Delete Recording
      </ContextMenuItem>
    </ContextMenuContent>
  );

  return (
    <Link href={`/recordings/${recording.id}`} className="flex">
      <ContextMenu>
        <ContextMenuTrigger>
          <CardContent />
        </ContextMenuTrigger>
        <CardMenu />
      </ContextMenu>
    </Link>
  );
};
