"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ConsoleAnimation() {
  const [isCardVisible, setIsCardVisible] = useState(false);

  const handleConsoleClick = () => {
    setIsCardVisible(true);
  };

  return (
    <div className="group relative flex w-full flex-col items-center justify-center pt-32 sm:pt-44">
      <button
        className="reveal -mb-[17%] flex w-full animate-revealSm items-center justify-center px-[29.5%] drop-shadow-lg"
        aria-label="start up the outerboy console"
        onClick={handleConsoleClick}
      >
        <svg
          width="276"
          height="140"
          viewBox="0 0 276 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="size-full drop-shadow-lg -translate-y-[90%] transition-transform duration-300 ease-out hover:rotate-3 active:-translate-y-[86%]"
        >
          {/* Top console part - simplified version */}
          <rect y="6" width="276" height="16" rx="2" fill="#1D1D1D" />
          <rect width="4" height="16" transform="translate(89 6)" fill="#0D0F10" />
          <rect width="270" height="16" transform="translate(3 22)" fill="#282828" />
          <rect y="38" width="276" height="16" rx="2" fill="#1D1D1D" />
          <rect width="270" height="16" transform="translate(3 54)" fill="#282828" />
          <rect y="70" width="276" height="16" rx="2" fill="#1D1D1D" />
          <rect y="102" width="276" height="16" rx="2" fill="#1D1D1D" />
          <path d="M3 86H273V174C273 175.105 272.105 176 271 176H5C3.89543 176 3 175.105 3 174V86Z" fill="#1D1D1D" />
          <rect width="270" height="16" transform="translate(3 86)" fill="#282828" />
          
          {/* The two blue elements that will have the card slide between them */}
          <rect width="12" height="6" transform="translate(129 0)" fill="#2178B8" />
          <rect width="12" height="6" transform="translate(197 0)" fill="#2178B8" />
        </svg>
      </button>
      
      <div className={`reveal w-full ${isCardVisible ? 'animate-reveal' : ''}`}>
        <div className="relative w-full">
          <svg
            width="683"
            height="286"
            viewBox="0 0 683 286"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="size-full drop-shadow-xl"
          >
            {/* Bottom console part - simplified version */}
            <rect y="6" width="683" height="16" rx="2" fill="#1D1D1D" />
            <rect width="4" height="16" transform="translate(215 6)" fill="#0D0F10" />
            <rect width="663" height="16" transform="translate(10 22)" fill="#282828" />
            <rect y="38" width="683" height="16" rx="2" fill="#1D1D1D" />
            <rect width="663" height="16" transform="translate(10 54)" fill="#282828" />
            <rect y="70" width="683" height="16" rx="2" fill="#1D1D1D" />
            <rect y="102" width="683" height="16" rx="2" fill="#1D1D1D" />
            <path d="M10 86H673V174C673 175.105 672.105 176 671 176H12C10.8955 176 10 175.105 10 174V86Z" fill="#1D1D1D" />
            <rect width="663" height="16" transform="translate(10 86)" fill="#282828" />
            
            {/* The two blue elements that will have the card slide between them */}
            <rect width="12" height="6" transform="translate(336 0)" fill="#2178B8" />
            <rect width="12" height="6" transform="translate(504 0)" fill="#2178B8" />
          </svg>
          
          {/* Sliding card that appears between the two blue elements */}
          {isCardVisible && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[260px] h-[286px] animate-slideIn" style={{ transform: 'translateY(-20px)' }}>
                <div className="rounded-lg blue-card-bg px-4 py-4 flex flex-col items-center justify-center w-full h-full text-background card-shadow">
                  <div className="rounded-md bg-inner-blue flex flex-col items-center justify-evenly w-full mb-2 shadow-xs flex-1">
                    <div className="w-0 h-0 border-l-[24px] border-r-[24px] border-b-[16px] border-l-transparent border-r-transparent border-b-background mx-auto" />
                    <div className="flex flex-col items-center justify-center">
                      <div className="font-mono text-base tracking-widest text-center mb-2 font-mono-accent">
                        REM MEMORY CARD
                      </div>
                      <div className="font-mono text-base text-center font-mono-accent">
                        8 MB
                      </div>
                    </div>
                  </div>
                  <div className="font-mono text-base w-full break-words truncate block">
                    New Recording
                  </div>
                  <div className="flex flex-row gap-2 justify-between w-full items-center mt-2">
                    <div className="font-mono text-sm text-muted-foreground">
                      Ready
                    </div>
                    <div className="font-mono text-xs text-right ml-auto">
                      Now
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {isCardVisible && (
        <div className="mt-8 animate-fadeIn">
          <Link href="/new">
            <Button className="text-2xl font-serif">
              <div className="flex flex-row gap-2 items-center">
                <span>Start New Recording</span>
                <span className="pt-1">⭢</span>
              </div>
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
} 