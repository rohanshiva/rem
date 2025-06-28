"use client";

import Link from "next/link";
import { Eye, Trash2 } from "lucide-react";
import {
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import { deleteRecording } from "@/app/actions/recordings";

type RecordingType = {
  id: string;
  name: string;
  summary?: string;
  emotion_tags?: string[];
  date: string;
  processing?: boolean;
  raw_transcription?: string;
  audio_storage_path?: string;
};

export function RecordingContextMenuContent({
  recording,
}: {
  recording: RecordingType;
}) {
  return (
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
} 