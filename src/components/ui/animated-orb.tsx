"use client";
import { motion } from "motion/react";
import React from "react";

const svgPathBase = {
  fill: "none",
  stroke: "#FFF",
  strokeWidth: 1,
  strokeLinecap: "round" as const,
  strokeDasharray: "0 1 20 120",
};

type AnimatedOrbProps = {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  animate?: boolean;
  style?: React.CSSProperties;
  className?: string;
  size?: number; // Size in pixels, defaults to 82
};

const AnimatedOrb: React.FC<AnimatedOrbProps> = ({
  onClick,
  style,
  animate,
  className,
  size = 128, // Default to original size
}) => {
  // Calculate scale factor based on original 82px size
  const scale = size / 82;

  // Helper function to scale values
  const s = (value: number) => Math.round(value * scale);

  return (
    <div
      style={{
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        height: `${size}px`,
        width: `${size}px`,
        borderRadius: "50%",
        backgroundImage:
          "radial-gradient(circle at 50% 30%, rgb(0, 240, 255) 0%, rgb(0, 49, 255) 70%)",
        boxShadow: `rgba(0, 123, 255, 0) 0px ${s(4)}px ${s(
          6
        )}px 0px, rgba(0, 121, 255, 0.5) 0px ${s(5)}px ${s(
          10
        )}px 0px, rgba(255, 255, 255, 0.9) 0px 0px ${s(
          1
        )}px 0px inset, rgb(164, 240, 255) 0px ${s(1)}px ${s(7)}px 0px inset`,
        transform: "none",
        ...style,
      }}
      onClick={onClick}
      className={className}
    >
      <div
        style={{
          borderRadius: "50%",
          position: "absolute",
          top: "0px",
          left: "0px",
          height: "100%",
          width: "100%",
          backgroundImage:
            "radial-gradient(circle at 50% 90%,rgb(226, 255, 255) 0%,rgba(0, 49, 255, 0) 70%)",
        }}
      />
      <motion.div
        animate={{
          rotate: [-60, 0, 90],
          scale: [1.2, 1, 1],
          y: [s(6), s(4), s(8)],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{
          borderRadius: "50%",
          position: "absolute",
          top: `${s(5)}px`,
          left: `${s(5)}px`,
          height: `calc(100% - ${s(10)}px)`,
          width: `calc(100% - ${s(10)}px)`,
          background:
            "radial-gradient(circle at 33% 12%, #F0FFFF 0%, #00DDFF 26%, rgba(0,49,255,0.00) 63%)",
          filter: `blur(${s(2)}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: `${s(5)}px`,
          left: `${s(5)}px`,
          height: `calc(100% - ${s(10)}px)`,
          width: `calc(100% - ${s(10)}px)`,
          borderRadius: "50%",
          backgroundImage:
            "radial-gradient(circle at 31% 12%, rgba(254,254,254,0.0) 0%, rgba(0,221,255,0.0) 31%, #0026CC 77%)",
          filter: `blur(${s(1)}px)`,
          opacity: 0.65,
        }}
      />
      <motion.div
        animate={{
          scale: [1, 1.1],
          filter: [`blur(${s(2)}px)`, `blur(${s(4)}px)`],
        }}
        transition={{
          duration: 1.3,
          repeatType: "reverse",
        }}
        style={{
          borderRadius: "50%",
          position: "absolute",
          top: `${s(24)}px`,
          left: `${s(24)}px`,
          height: `${s(48)}px`,
          width: `${s(48)}px`,
          background:
            "linear-gradient(-36deg, #E8FAFF 12%, #00BBFF 36%, rgba(0,49,255,0.00) 54%)",
        }}
      />
      <motion.div
        animate={{
          scale: [1, 1.1],
          filter: [`blur(${s(2)}px)`, `blur(${s(4)}px)`],
        }}
        transition={{
          duration: 1.3,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{
          borderRadius: "50%",
          position: "absolute",
          top: `${s(24)}px`,
          left: `${s(12)}px`,
          height: `${s(48)}px`,
          width: `${s(48)}px`,
          transform: "rotate(12deg)",
          backgroundImage:
            "linear-gradient(163deg, #E8FAFF 0%, #0099FF 19%, rgba(0,49,255,0.00) 50%)",
        }}
      />
      <motion.div
        animate={{
          scaleX: [0.6, 1],
        }}
        transition={{
          duration: 0.9,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{
          opacity: 0.6,
          borderRadius: "50%",
          position: "absolute",
          top: "30%",
          left: "10%",
          height: "40%",
          width: "80%",
          filter: `blur(${s(4)}px)`,
        }}
      />
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          repeatType: "mirror",
        }}
        style={{
          position: "absolute",
          background: "#0031FF40",
          top: "0",
          left: "0",
          height: "50%",
          width: "50%",
          filter: `url(#dissolve-filter2) blur(${s(4)}px)`,
        }}
      />
      {/* Animated white dot particles */}
      {animate && (
        <>
          {[
            { left: 40.8266, top: 24, size: 2, delay: 0.2 },
            { left: 38.2062, top: 24, size: 1, delay: 0.5 },
            { left: 54.4517, top: 24, size: 1, delay: 0.7 },
            { left: 23.7434, top: 24, size: 1, delay: 0.9 },
            { left: 38.1677, top: 24, size: 1, delay: 1.1 },
            { left: 61.8953, top: 24, size: 1, delay: 1.3 },
            { left: 61.5088, top: 24, size: 2, delay: 1.5 },
            { left: 18.1885, top: 24, size: 2, delay: 1.7 },
            { left: 63.2761, top: 24, size: 1, delay: 1.9 },
            { left: 19.8409, top: 24, size: 1, delay: 2.1 },
            { left: 56.1998, top: 24, size: 1, delay: 2.3 },
            { left: 23.5837, top: 24, size: 1, delay: 2.5 },
          ].map((dot, i) => (
            <motion.div
              key={i}
              style={{
                zIndex: 3,
                position: "absolute",
                height: `${s(dot.size)}px`,
                width: `${s(dot.size)}px`,
                borderRadius: "50%",
                background: "rgb(255, 255, 255)",
                left: `${s(dot.left)}px`,
                top: `${s(dot.top)}px`,
              }}
              initial={{ opacity: 0, y: s(84) }}
              animate={{ opacity: [0.67, 0.54, 0], y: s(-16) }}
              transition={{
                duration: 3,
                ease: "linear",
                delay: dot.delay,
                repeat: Infinity,
              }}
            />
          ))}
        </>
      )}
      <div
        style={{
          opacity: 0.16,
          borderRadius: "50%",
          position: "absolute",
          top: `${s(4)}px`,
          left: `${s(4)}px`,
          height: `calc(100% - ${s(8)}px)`,
          width: `calc(100% - ${s(8)}px)`,
          background:
            "linear-gradient(rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: `${s(11)}px`,
          left: `${s(32)}px`,
          height: `${s(24)}px`,
          width: `${s(42)}px`,
          transform: "rotate(27deg)",
          background:
            "linear-gradient(rgb(255, 255, 255) 0%,rgba(255, 255, 255, 0) 100%)",
          borderRadius: `${s(10)}px`,
          filter: `blur(${s(4)}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: `${s(48)}px`,
          left: `${s(4)}px`,
          height: `${s(24)}px`,
          width: `${s(50)}px`,
          transform: "rotate(-142deg)",
          backgroundImage:
            "linear-gradient(rgb(0, 240, 255) 0%,rgba(255, 255, 255, 0) 100%)",
          borderRadius: `${s(10)}px`,
          filter: `blur(${s(4)}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: `${s(24)}px`,
          left: `${s(54)}px`,
          height: `${s(12)}px`,
          width: `${s(24)}px`,
          opacity: 0.8,
          transform: "rotate(79deg)",
          backgroundImage:
            "linear-gradient(rgb(0, 187, 255) 0%, rgba(255, 255, 255, 0) 100%)",
          borderRadius: `${s(10)}px`,
          filter: `blur(${s(4)}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "0px",
          left: "0px",
          height: "100%",
          width: "100%",
          opacity: "0.8",
          borderRadius: "50%",
          background: "transparent",
          boxShadow: `rgba(255, 255, 255, 0.5) 0px -${s(1)}px ${s(6)}px ${s(
            1
          )}px inset,rgba(255, 255, 255, 0.5) 0px ${s(3)}px ${s(
            4
          )}px 0px inset`,
        }}
      />
      <div
        style={{
          opacity: 0.32,
          position: "absolute",
          top: `${s(8)}px`,
          left: `${s(11)}px`,
          height: `${s(41)}px`,
          width: `${s(50)}px`,
          transform: "rotate(-20deg)",
          background:
            "linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.00) 100%)",
          borderRadius: `${s(22)}px`,
          filter: `blur(${s(1)}px)`,
        }}
      />

      {animate && (
        <>
          {/* First SVG with outer orbital paths */}
          <svg
            style={{
              position: "absolute",
              top: `${s(-12)}px`,
              left: `${s(-12)}px`,
              width: `${s(90)}px`,
              height: `${s(90)}px`,
              pointerEvents: "none",
            }}
          >
            <motion.path
              {...svgPathBase}
              d={`M ${s(8)} ${s(45)} A ${s(34)} ${s(34)} 0 0 1 ${s(82)} ${s(
                45
              )}`}
              opacity={0.4}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.67, 0], strokeDashoffset: [200, 0] }}
              style={{
                transform: "rotate(-30deg)",
                transformOrigin: `${s(45)}px ${s(45)}px`,
              }}
              transition={{ duration: 2.55, delay: 0, repeat: Infinity }}
            />
            <motion.path
              {...svgPathBase}
              d={`M ${s(82)} ${s(45)} A ${s(34)} ${s(34)} 0 0 0 ${s(8)} ${s(
                45
              )}`}
              opacity={0.3}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.67, 0], strokeDashoffset: [-200, 0] }}
              style={{
                transform: "rotate(150deg)",
                transformOrigin: `${s(45)}px ${s(45)}px`,
              }}
              transition={{
                duration: 2.9988541080779676,
                delay: 2.5705600040299337,
                repeat: Infinity,
              }}
            />
          </svg>

          {/* Second SVG with inner orbital paths */}
          <svg
            style={{
              position: "absolute",
              top: "0px",
              left: "0px",
              width: `${s(90)}px`,
              height: `${s(90)}px`,
              pointerEvents: "none",
            }}
          >
            <motion.path
              {...svgPathBase}
              d={`M ${s(15)} ${s(70)} A ${s(40)} ${s(40)} 0 0 1 ${s(75)} ${s(
                20
              )}`}
              opacity={0.25}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.67, 0], strokeDashoffset: [200, 0] }}
              style={{
                transform: "rotate(-15deg)",
                transformOrigin: `${s(45)}px ${s(45)}px`,
              }}
              transition={{
                duration: 4.348984619355587,
                delay: 1.060799376173018,
                repeat: Infinity,
              }}
            />
            <motion.path
              {...svgPathBase}
              d={`M ${s(15)} ${s(20)} A ${s(40)} ${s(40)} 0 0 0 ${s(75)} ${s(
                70
              )}`}
              opacity={0.2}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.67, 0], strokeDashoffset: [-200, 0] }}
              style={{
                transform: "rotate(15deg)",
                transformOrigin: `${s(45)}px ${s(45)}px`,
              }}
              transition={{
                duration: 2.121329010943242,
                delay: 3.8558400060449003,
                repeat: Infinity,
              }}
            />
          </svg>
        </>
      )}
    </div>
  );
};

export default AnimatedOrb;
