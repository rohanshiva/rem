"use client";

import { useAudioRecorder } from "@/app/hooks/use-audio-recorder";
import { Drawer } from "vaul";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { triggerProcessing } from "@/app/actions/trigger-processing";
import AnimatedOrb from "@/components/ui/animated-orb";

export default function Orb() {
  const {
    isIdle,
    isRecording,
    isPaused,
    hasError,
    formattedDuration,
    error,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
  } = useAudioRecorder();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  // Sync drawer state with recording state - drawer should only be open when paused
  useEffect(() => {
    if (!isPaused && isDrawerOpen) {
      setIsDrawerOpen(false);
    }
  }, [isPaused, isDrawerOpen]);

  // Show toast when error occurs
  useEffect(() => {
    if (hasError && error) {
      toast.error(error.message);
    }
  }, [hasError, error, resetRecording]);

  const handleOrbClick = async () => {
    if (hasError) {
      // Reset recording completely when there's an error
      resetRecording();
    } else if (isRecording) {
      // If currently recording, pause and show drawer
      pauseRecording();
      setIsDrawerOpen(true);
    } else if (isPaused) {
      // If paused and drawer is not open, resume recording
      // (drawer should handle resume when closed)
      if (!isDrawerOpen) {
        resumeRecording();
      }
    } else if (isIdle) {
      try {
        await startRecording();
      } catch (error) {
        toast.error("Sorry, failed to start recording. Please try again.");
        console.error("Error starting recording:", error);
      }
    }
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    // Resume recording when drawer is closed without saving
    if (isPaused) {
      resumeRecording();
    }
  };

  const handleSaveRecording = async () => {
    const saveRecording = async () => {
      const recording = await stopRecording();
      console.log("Recording completed:", recording);

      // Get the current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) {
        router.push("/login");
        return;
      }

      // Upload to Supabase Storage
      const storagePath = `${user.id}/${recording.filename}`;
      const { error: uploadError } = await supabase.storage
        .from("recordings")
        .upload(storagePath, recording.blob, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { error: triggerProcessingError } = await triggerProcessing(
        storagePath
      );

      if (triggerProcessingError) {
        throw triggerProcessingError;
      }

      // Close drawer and navigate on success
      setIsDrawerOpen(false);
      router.push("/");
    };

    toast.promise(saveRecording(), {
      loading: (
        <div className="font-mono text-sm">
          <code className="shimmer">Saving...</code>
        </div>
      ),
      success: "Dream saved successfully!",
      error: "Failed to save dream. Please try again.",
    });
  };

  const getOrbText = () => {
    if (isRecording) return `Recording... ${formattedDuration}`;
    if (isPaused) return `Paused — ${formattedDuration}`;
    return "Tap & Start Speaking";
  };

  return (
    <>
      <div className="flex flex-col gap-4 items-center select-none [-webkit-touch-callout:none] [-webkit-tap-highlight-color:transparent]">
        <AnimatedOrb onClick={handleOrbClick} />
        <span className="font-serif text-3xl text-center">{getOrbText()}</span>
      </div>

      <Drawer.Root
        open={isDrawerOpen && isPaused}
        onOpenChange={(open) => {
          if (!open) {
            handleDrawerClose();
          }
        }}
        direction="bottom"
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0" />
          <Drawer.Content className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-fit outline-none">
            <div className="bg-secondary px-4 py-2 flex flex-col rounded-md border-1 border-border">
              <VisuallyHidden>
                <Drawer.Title>Save Recording</Drawer.Title>
              </VisuallyHidden>
              <div className="flex items-center gap-6 justify-between">
                <Button
                  onClick={handleSaveRecording}
                  size="lg"
                  disabled={isDrawerOpen && !isPaused}
                >
                  Save
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    handleDrawerClose();
                  }}
                >
                  Resume
                </Button>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </>
  );
}
