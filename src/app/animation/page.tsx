"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import Console from "./console";

export default function AnimationPage() {
  const [isStarted, setIsStarted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleStart = () => {
    setIsStarted(true);
    
    // Play audio at impact moment (around 1.5s)
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {
          console.log('Audio play failed');
        });
      }
    }, 1500);
  };

  if (!isStarted) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="flex flex-col items-center justify-center gap-6">
          <div className="text-center">
            <h1 className="text-4xl font-serif mb-2">REM Memory</h1>
            <p className="text-lg text-muted-foreground">Dream Recording System</p>
          </div>
          <button
            onClick={handleStart}
            className="px-8 py-4 bg-accent text-accent-foreground rounded-lg text-xl font-serif hover:bg-accent/90 transition-colors"
          >
            Start System
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-full">
      <audio ref={audioRef} src="/clunk.DMmBR1fs.m4a" preload="auto" />
      <div className="flex flex-col items-center justify-center pt-32 sm:pt-44 w-full max-w-[683px] mx-auto px-4 sm:px-6">
        {/* Card - starts above and slides down automatically */}
        <motion.div
          className="-mb-[17%] flex items-center justify-center w-full"
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
              delay: 1
            }}
          >
            {/* Card */}
            <div className="w-full aspect-[260/286]">
              <div className="rounded-lg blue-card-bg px-[4%] py-[4%] flex flex-col items-center justify-center w-full h-full text-background card-shadow">
                <div className="rounded-md bg-inner-blue flex flex-col items-center justify-evenly w-full mb-[2%] shadow-xs flex-1">
                  <div className="card-triangle" />
                  <div className="flex flex-col items-center justify-center">
                    <div className="font-mono text-[2.5vw] sm:text-base tracking-widest text-center mb-[2%] font-mono-accent">
                      REM MEMORY CARD
                    </div>
                    <div className="font-mono text-[2.5vw] sm:text-base text-center font-mono-accent">
                      8 MB
                    </div>
                  </div>
                </div>
                <div className="font-mono text-[2.5vw] sm:text-base w-full break-words truncate block">
                  Dream Recording
                </div>
                <div className="flex flex-row gap-[2%] justify-between w-full items-center mt-[2%]">
                  <div className="font-mono text-[2.0vw] sm:text-sm text-muted-foreground">
                    Ready
                  </div>
                  <div className="font-mono text-[1.8vw] sm:text-xs text-right ml-auto">
                    Now
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
          className="relative flex justify-center max-w-full"
          initial={{ y: 0 }}
          animate={{ y: [0, -8, 0, -4, 0] }}
          transition={{ 
            duration: 0.4, 
            delay: 1.5,
            ease: "easeOut"
          }}
        >
            <div className="relative w-full">
              {/* Screen Overlay */}
              <div className="absolute z-10 flex h-full w-full items-center justify-center bg-transparent px-[20%] py-[3%]">
                <motion.div 
                  className="flex h-full w-full items-center justify-center overflow-hidden rounded-md"
                  initial={{ backgroundColor: "#000000", boxShadow: "none" }}
                  animate={{ 
                    backgroundColor: "#ffffff", 
                    boxShadow: "0 0 10px white" 
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
                      REM MEMORY
                    </div>
                  </motion.div>
                </motion.div>
              </div>
              <div className="w-full">
                <Console />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
