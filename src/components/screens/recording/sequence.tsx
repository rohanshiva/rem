"use client";

import type { RecordingWithDetails } from "@/types";

import { useState } from "react";
import Animation from "./animation";

interface SequenceProps {
  recording: RecordingWithDetails;
  children: React.ReactNode;
}

export default function Sequence({
  recording,
  children,
}: SequenceProps) {
  const [showAnimation, setShowAnimation] = useState(true);

  const handleAnimationComplete = () => {
    setShowAnimation(false);
  };

  if (showAnimation) {
    return (
      <Animation
        recording={recording}
        onAnimationComplete={handleAnimationComplete}
      />
    );
  }

  return <>{children}</>;
} 