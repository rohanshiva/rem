// Shared domain types
export type Recording = {
  id: string;
  name: string;
  summary?: string;
  emotion_tags?: string[];
  date: string;
  processing?: boolean;
  raw_transcription?: string;
  audio_storage_path?: string;
  imageUrl?: string;
};

export type RecordingWithDetails = {
  id: string;
  name: string;
  summary?: string;
  raw_transcription?: string;
  emotion_tags?: string[];
  image_storage_path?: string;
  imageUrl?: string;
}; 