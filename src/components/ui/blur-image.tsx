"use client";

import Image from "next/image";
import { useState, ComponentProps } from "react";
import { cn } from "@/lib/utils";

type BlurImageProps = ComponentProps<typeof Image>;

export function BlurImage(props: BlurImageProps) {
  const [isLoading, setLoading] = useState(true);

  return (
    <Image
      {...props}
      className={cn(
        props.className,
        'duration-700 ease-in-out',
        isLoading
          ? 'grayscale blur-2xl scale-110'
          : 'grayscale-0 blur-0 scale-100'
      )}
      onLoad={() => setLoading(false)}
    />
  );
} 