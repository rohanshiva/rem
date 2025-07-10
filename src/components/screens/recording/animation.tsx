"use client";

import type { RecordingWithDetails } from "@/types";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import Console from "@/components/screens/recording/console";

interface AnimationProps {
  recording: RecordingWithDetails;
  onAnimationComplete: () => void;
}

export default function Animation({
  recording,
  onAnimationComplete,
}: AnimationProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Start animation sequence
    // Play audio at impact moment (around 1.5s)
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {
          console.log("Audio play failed");
        });
      }
    }, 1500);

    // Animation completes after 5.5s
    setTimeout(() => {
      onAnimationComplete();
    }, 3000);
  }, [onAnimationComplete]);

  return (
    <div className="flex items-center justify-center min-h-full">
      <audio ref={audioRef} src="/clunk.DMmBR1fs.m4a" preload="auto" />
      <div className="flex flex-col items-center justify-center pt-32 sm:pt-44 w-full mx-auto">
        {/* Card - starts above and slides down automatically */}
        <motion.div
          className="-mb-[17%] flex items-center justify-center w-full max-w-[683px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.1, delay: 1 }}
        >
          <motion.div
            className="w-[38%]"
            initial={{ y: "-200%" }}
            animate={{ y: "10%" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              mass: 1,
              delay: 1,
            }}
          >
            {/* Card */}
            <div className="w-full aspect-[260/286]">
              <div className="rounded-lg blue-card-bg px-[6%] py-[6%] flex flex-col items-center justify-center w-full h-full text-background card-shadow">
                <div className="rounded-md bg-inner-blue flex flex-col items-center justify-evenly w-full mb-[2%] shadow-xs flex-1 gap-0">
                  <div className="card-triangle" />
                  <div className="flex flex-col items-center justify-center">
                    <div className="font-mono text-[2vw] sm:text-base tracking-widest text-center mb-[2%] font-mono-accent">
                      <div>REM MEMORY CARD</div>
                    </div>
                    <div className="font-mono text-[2.5vw] sm:text-base text-center font-mono-accent">
                      8 MB
                    </div>
                  </div>
                </div>
                <div className="font-mono text-[2.5vw] sm:text-base w-full break-words truncate block">
                  {recording?.name || "Dream Recording"}
                </div>
                <div className="flex flex-row gap-[2%] justify-between w-full items-center mt-[2%]">
                  <div className="font-mono text-[2.0vw] sm:text-sm text-muted-foreground">
                    Ready
                  </div>
                  <div className="font-mono text-[1.8vw] sm:text-xs text-right ml-auto">
                    Recorded
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
        {/* Console */}
        <motion.div
          className="flex justify-center w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="flex justify-center items-center max-w-full"
            initial={{ y: 0 }}
            animate={{ y: [0, -8, 0, -4, 0] }}
            transition={{
              duration: 0.4,
              delay: 1.5,
              ease: "easeOut",
            }}
          >
            <div className="relative flex justify-center items-center w-full">
              {/* Screen Overlay */}
              <div className="absolute z-10 flex h-full w-full items-center justify-center bg-transparent px-[20%] py-[3%] mt-[2%]">
                <motion.div
                  className="flex h-full w-full items-center justify-center overflow-hidden rounded-md"
                  initial={{ backgroundColor: "#000000", boxShadow: "none" }}
                  animate={{
                    backgroundColor: "#ffffff",
                    boxShadow: "0 0 10px white",
                  }}
                  transition={{ duration: 0.3, delay: 1.7 }}
                >
                  <motion.div
                    className="relative h-full w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 2.0 }}
                  >
                    <div className="screen-gameboy-text startup absolute flex items-center justify-center inset-0">
                      <span className="flex flex-row gap-2">
                        <span>DREAM</span>
                        <span>MACHINE</span>
                      </span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
              <Console />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
} 