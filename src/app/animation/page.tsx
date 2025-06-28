"use client";

import { useState, useRef } from "react";

export default function AnimationPage() {
  const [isInserted, setIsInserted] = useState(false);
  const [bump, setBump] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleCardClick = () => {
    if (!isInserted) {
      setIsInserted(true);
      setBump(true);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      setTimeout(() => setBump(false), 500);
    } else {
      setIsInserted(false);
      setBump(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-full">
      <audio ref={audioRef} src="/clunk.DMmBR1fs.m4a" preload="auto" />
      <div className="flex flex-col items-center justify-center pt-32 sm:pt-44 w-full">
        {/* Card Button */}
        <button
          className="reveal -mb-[17%] flex animate-revealSm items-center justify-center drop-shadow-lg"
          aria-label="start up the console"
          onClick={handleCardClick}
          style={{ width: 260 }}
        >
          <div
            className={`drop-shadow-lg transition-all duration-300 ease-out transform-gpu will-change-transform ${
              isInserted 
                ? "-translate-y-[30%]" 
                : "-translate-y-[100%]"
            } ${!isInserted ? "hover:rotate-3" : ""}`}
            style={{ width: 260 }}
          >
            {/* Card */}
            <div className="w-[260px] h-[286px]">
              <div className="rounded-lg blue-card-bg px-4 py-4 flex flex-col items-center justify-center w-full h-full text-background card-shadow">
                <div className="rounded-md bg-inner-blue flex flex-col items-center justify-evenly w-full mb-2 shadow-xs flex-1">
                <div className="w-0 h-0 border-l-[24px] border-r-[24px] border-t-[16px] border-l-transparent border-r-transparent border-t-background mx-auto" />
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
                  Dream Recording
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
        </button>
        {/* Console */}
        <div className="opacity-0 animate-fadeIn flex justify-center w-full">
          <div 
            className={`relative flex justify-center transition-transform duration-300 ease-out transform-gpu ${
              bump ? "animate-console-bump" : ""
            }`} 
            style={{ width: 1024 }}
          >
            <svg
              width="1024"
              height="170"
              viewBox="0 0 1024 170"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="max-w-full h-auto drop-shadow-xl mx-auto"
            >
              <rect width="1024" height="16" rx="2" fill="#1D1D1D" />
              <rect
                width="4"
                height="16"
                transform="translate(329)"
                fill="#0D0F10"
              />
              <rect
                width="12"
                height="16"
                transform="translate(380)"
                fill="#2178B8"
              />
              <rect
                width="12"
                height="16"
                transform="translate(632)"
                fill="#2178B8"
              />
              <rect
                width="1004"
                height="16"
                transform="translate(10 16)"
                fill="#282828"
              />
              <g clipPath="url(#clip0_462_614)">
                <rect y="32" width="1024" height="16" rx="2" fill="#1D1D1D" />
                <g filter="url(#filter0_d_462_614)">
                  <path
                    d="M879.17 46V32.86H883.4C884.336 32.86 885.146 33.022 885.83 33.346C886.514 33.67 887.042 34.132 887.414 34.732C887.798 35.332 887.99 36.04 887.99 36.856C887.99 37.708 887.78 38.47 887.36 39.142C886.952 39.814 886.394 40.3 885.686 40.6L888.17 46H885.236L883.112 41.032H881.852V46H879.17ZM881.852 38.692H883.4C884 38.692 884.462 38.542 884.786 38.242C885.122 37.942 885.29 37.522 885.29 36.982C885.29 36.418 885.122 35.98 884.786 35.668C884.462 35.356 884 35.2 883.4 35.2H881.852V38.692ZM890.233 46V32.86H898.333V35.164H892.879V38.116H897.703V40.42H892.879V43.696H898.333V46H890.233ZM900.342 46V32.86H903.384L904.59 37C904.722 37.432 904.818 37.81 904.878 38.134C904.95 38.458 904.992 38.686 905.004 38.818C905.016 38.686 905.052 38.458 905.112 38.134C905.184 37.81 905.28 37.432 905.4 37L906.588 32.86H909.63V46H907.164V42.4C907.164 41.74 907.176 41.05 907.2 40.33C907.236 39.598 907.278 38.872 907.326 38.152C907.374 37.432 907.428 36.76 907.488 36.136C907.548 35.5 907.602 34.948 907.65 34.48L906.138 40.42H903.852L902.268 34.48C902.328 34.924 902.388 35.458 902.448 36.082C902.508 36.694 902.562 37.36 902.61 38.08C902.67 38.788 902.718 39.514 902.754 40.258C902.79 41.002 902.808 41.716 902.808 42.4V46H900.342Z"
                    fill="#84D0FA"
                  />
                </g>
                <rect
                  width="16"
                  height="16"
                  transform="translate(783 32)"
                  fill="#00FF8E"
                />
                <rect
                  width="16"
                  height="16"
                  transform="translate(807 32)"
                  fill="#21B8CD"
                />
                <rect
                  width="192"
                  height="16"
                  transform="translate(36 32)"
                  fill="#0D0F10"
                />
                <rect
                  width="192"
                  height="16"
                  transform="translate(253 32)"
                  fill="#0D0F10"
                />
              </g>
              <rect
                width="1004"
                height="16"
                transform="translate(10 48)"
                fill="#282828"
              />
              <path
                d="M147.944 49.8H149.88V49.976L151.56 52.488L153.736 49.8H155.672V61H153.736V52.408L152.472 53.896V54.904H151.08V54.648L149.88 52.856V61H147.944V49.8ZM168.642 49.8H172.914V61H170.978V56.216H167.778V61H165.874V52.664L168.642 49.8ZM167.778 53.224V54.408H170.978V51.608H169.346L167.778 53.224ZM184.604 49.8H189.372L190.684 51.768L189.404 53.064L188.428 51.608H185.356L185.068 51.912V58.568L185.468 59.192H188.924V55.928H186.668V54.136H190.044L190.844 55.352V61H184.508L183.132 58.936V51.336L184.604 49.8ZM200.709 49.8H208.453V51.608H205.541V59.192H208.453V61H200.709V59.192H203.605V51.608H200.709V49.8ZM220.015 49.8H224.815L226.111 51.752L224.831 53.096L223.855 51.624H220.751L220.463 51.944V58.488L220.927 59.192H223.999L225.135 58.056L226.143 59.56L224.767 61H219.967L218.527 58.856V51.304L220.015 49.8ZM254.979 49.8H259.747L261.059 51.768L259.779 53.064L258.803 51.608H255.731L255.443 51.912V58.568L255.843 59.192H259.299V55.928H257.043V54.136H260.419L261.219 55.352V61H254.883L253.507 58.936V51.336L254.979 49.8ZM274.204 49.8H278.476V61H276.54V56.216H273.34V61H271.436V52.664L274.204 49.8ZM273.34 53.224V54.408H276.54V51.608H274.908L273.34 53.224ZM288.374 49.8H296.726V51.608H292.47L293.526 52.552V61H291.59V53L291.126 51.608H288.374V49.8ZM307.6 49.8H313.84V51.608H308.336L308.048 51.928V54.44H311.744V56.248H308.048V58.488L308.512 59.192H313.84V61H307.552L306.112 58.856V51.32L307.6 49.8Z"
                fill="#9B9B9B"
              />
              <rect y="64" width="1024" height="16" rx="2" fill="#1D1D1D" />
              <rect y="96" width="1024" height="16" rx="2" fill="#1D1D1D" />
              <path
                d="M10 80H974V168C974 169.105 973.105 170 972 170H12C10.8955 170 10 169.105 10 168V80Z"
                fill="#1D1D1D"
              />
              <mask id="path-8-inside-1_462_614" fill="white">
                <path d="M35 144H67V160H35V144Z" />
              </mask>
              <path d="M35 144H67V160H35V144Z" fill="#0D0F10" />
              <path
                d="M35 144V148H67V144V140H35V144Z"
                fill="#FFEE00"
                mask="url(#path-8-inside-1_462_614)"
              />
              <mask id="path-10-inside-2_462_614" fill="white">
                <path d="M80 144H112V160H80V144Z" />
              </mask>
              <path d="M80 144H112V160H80V144Z" fill="#0D0F10" />
              <path
                d="M80 144V148H112V144V140H80V144Z"
                fill="#FFEE00"
                mask="url(#path-10-inside-2_462_614)"
              />
              <rect
                width="24"
                height="16"
                transform="translate(887 144)"
                fill="#0D0F10"
              />
              <rect x="659" y="128" width="165" height="32" rx="1" fill="#0A0C0B" />
              <rect x="670" y="136" width="32" height="16" rx="1" fill="#FFEE00" />
              <rect x="726" y="136" width="32" height="16" rx="1" fill="#FFEE00" />
              <rect x="781" y="136" width="32" height="16" rx="1" fill="#FFEE00" />
              <rect
                width="1004"
                height="16"
                transform="translate(10 80)"
                fill="#282828"
              />
              <defs>
                <filter
                  id="filter0_d_462_614"
                  x="875.172"
                  y="29.8594"
                  width="38.457"
                  height="21.1406"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dy="1" />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.517647 0 0 0 0 0.815686 0 0 0 0 0.980392 0 0 0 1 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_462_614"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_462_614"
                    result="shape"
                  />
                </filter>
                <clipPath id="clip0_462_614">
                  <rect y="32" width="1024" height="16" rx="2" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
