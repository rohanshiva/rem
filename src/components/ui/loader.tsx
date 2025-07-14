"use client";
import { cn } from "@/lib/utils";
import { MeshGradient } from "@paper-design/shaders-react";

interface LoaderProps {
  className?: string;
}

export function Loader({ className }: LoaderProps) {
  return (
    <MeshGradient
      colors={["#4fc3f7", "#ffffff"]}
      speed={2}
      swirl={0.1}
      distortion={1}
      className={cn("w-4 h-4 rounded-full", className)}
    />
  );
}
