'use client';

import { useEffect, useRef, useState } from 'react';

const SEQUENCE =  ['▗', '▝', '▘', '▖'];

interface BlockLoaderProps {
  className?: string;
}

export function BlockLoader({ className }: BlockLoaderProps) {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % SEQUENCE.length);
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <span className={`inline-block font-mono ${className}`}>
      {SEQUENCE[index]}
    </span>
  );
} 