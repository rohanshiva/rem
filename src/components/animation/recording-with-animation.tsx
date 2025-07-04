"use client";

import { useState } from "react";
import MemoryCardAnimation from "./memory-card-animation";

type RecordingType = {
  id: string;
  name: string;
  summary?: string;
  emotion_tags?: string[];
  raw_transcription?: string;
};

interface RecordingWithAnimationProps {
  recording: RecordingType;
  children: React.ReactNode;
}

export default function RecordingWithAnimation({ 
  recording, 
  children 
}: RecordingWithAnimationProps) {
  const [showAnimation, setShowAnimation] = useState(true);

  const handleAnimationComplete = () => {
    setShowAnimation(true);
  };

  if (showAnimation) {
    return (
      <MemoryCardAnimation 
        recording={recording} 
        onAnimationComplete={handleAnimationComplete}
      />
    );
  }

  return <>{children}</>;
} 