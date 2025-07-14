"use client";

import type { RecordingWithDetails } from "@/types";

import { Link } from "next-view-transitions";
import Sequence from "./sequence";
import * as FadeIn from "@/components/ui/fade-in";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import Image from "next/image";

function SectionParagraph({ children }: { children: React.ReactNode }) {
  return (
    <p className="leading-[1.5rem] opacity-75 text-sm whitespace-pre-line">
      {children}
    </p>
  );
}

interface Props {
  recording: RecordingWithDetails;
}

export const Recording = ({ recording }: Props) => {
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  return (
    <Sequence recording={recording}>
      <FadeIn.Container className="text-foreground">
        <FadeIn.Item>
          <nav className="mb-8">
            <Link href="/" className="text-lg">Rem</Link>
          </nav>
        </FadeIn.Item>
        
        <FadeIn.Item>
          <h1 className="text-2xl font-semibold font-mono-accent mt-12 mb-6 break-words">
            {recording.name}
          </h1>
        </FadeIn.Item>

        {recording.image_storage_path && (
          <FadeIn.Item>
            <div className="mb-8">
              <motion.div
                className="relative w-full aspect-video rounded-lg overflow-hidden cursor-pointer"
                onClick={() => setIsImageExpanded(true)}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <Image
                  src={`/api/recordings/${recording.id}/image`}
                  alt="Dream visualization"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  priority
                />
              </motion.div>
            </div>
          </FadeIn.Item>
        )}

        {recording.emotion_tags && recording.emotion_tags.length > 0 && (
          <FadeIn.Item>
            <section className="mb-8">
              <h2 className="text-xl font-mono-accent mb-2">Emotions</h2>
              <div className="flex flex-wrap gap-2">
                {recording.emotion_tags.map((emotion: string) => (
                  <div
                    key={emotion}
                    className="rounded-md px-2 py-1 bg-accent text-background font-mono text-sm card-shadow"
                  >
                    {emotion}
                  </div>
                ))}
              </div>
            </section>
          </FadeIn.Item>
        )}

        <FadeIn.Item>
          <section className="mb-8">
            <h2 className="text-xl font-mono-accent mb-2">Summary</h2>
            {recording.summary ? (
              <SectionParagraph>{recording.summary}</SectionParagraph>
            ) : (
              <SectionParagraph>
                <span className="text-xs font-mono">No summary available.</span>
              </SectionParagraph>
            )}
          </section>
        </FadeIn.Item>

        <FadeIn.Item>
          <section className="mb-8">
            <h2 className="text-xl font-mono-accent mb-2">Raw Transcription</h2>
            {recording.raw_transcription ? (
              <SectionParagraph>{recording.raw_transcription}</SectionParagraph>
            ) : (
              <SectionParagraph>
                <span className="text-xs font-mono">
                  No transcription available.
                </span>
              </SectionParagraph>
            )}
          </section>
        </FadeIn.Item>
      </FadeIn.Container>

      {/* Full-screen image overlay */}
      <AnimatePresence>
        {isImageExpanded && recording.image_storage_path && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsImageExpanded(false)}
          >
            {/* Dark background overlay */}
            <motion.div
              className="absolute inset-0 bg-black/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            
            {/* Expanded image */}
            <motion.div
              className="relative max-w-[90vw] max-h-[90vh] rounded-lg overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <Image
                src={`/api/recordings/${recording.id}/image`}
                alt="Dream visualization"
                width={1920}
                height={1080}
                className="object-contain max-w-full max-h-full"
                sizes="90vw"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Sequence>
  );
}; 