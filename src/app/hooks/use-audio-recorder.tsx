import { useCallback, useEffect, useRef, useState } from "react";

const SUPPORTED_MIME_TYPES = [
  "audio/webm;codecs=opus",
  "audio/mp4",
  "audio/mpeg",
  "audio/webm",
  "audio/ogg;codecs=opus",
] as const;

const MIME_TYPE_TO_EXTENSION: Record<string, string> = {
  "audio/webm;codecs=opus": "webm",
  "audio/webm": "webm",
  "audio/mp4": "m4a",
  "audio/mpeg": "mp3",
  "audio/ogg;codecs=opus": "ogg",
  "audio/ogg": "ogg",
  "audio/wav": "wav",
};

export enum RecordingState {
  IDLE = "idle",
  RECORDING = "recording",
  PAUSED = "paused",
  PROCESSING = "processing",
  ERROR = "error",
}

export interface AudioRecording {
  blob: Blob;
  filename: string;
  mimeType: string;
  size: number;
}

export class AudioRecorderError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = "AudioRecorderError";
  }
}

export interface AudioRecorderConfig {
  echoCancellation?: boolean;
  noiseSuppression?: boolean;
  autoGainControl?: boolean;
  filenamePrefix?: string;
}

export interface UseAudioRecorderReturn {
  state: RecordingState;
  formattedDuration: string;
  error: AudioRecorderError | null;

  isIdle: boolean;
  isRecording: boolean;
  isPaused: boolean;
  isProcessing: boolean;
  hasError: boolean;

  startRecording: () => Promise<void>;
  pauseRecording: () => void;
  resumeRecording: () => void;
  stopRecording: () => Promise<AudioRecording>;
  resetRecording: () => void;
  clearError: () => void;
}

const getBestSupportedMimeType = (): string => {
  for (const type of SUPPORTED_MIME_TYPES) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return "audio/webm";
};

const getFileExtension = (mimeType: string): string => {
  return MIME_TYPE_TO_EXTENSION[mimeType] || "webm";
};

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

export function useAudioRecorder(
  config: AudioRecorderConfig = {}
): UseAudioRecorderReturn {
  const {
    echoCancellation = true,
    noiseSuppression = true,
    autoGainControl = true,
    filenamePrefix = "recording",
  } = config;

  // State
  const [state, setState] = useState<RecordingState>(RecordingState.IDLE);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<AudioRecorderError | null>(null);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const resolvePromiseRef = useRef<
    ((recording: AudioRecording) => void) | null
  >(null);
  const mimeTypeRef = useRef<string>("");

  // Derived state
  const isIdle = state === RecordingState.IDLE;
  const isRecording = state === RecordingState.RECORDING;
  const isPaused = state === RecordingState.PAUSED;
  const isProcessing = state === RecordingState.PROCESSING;
  const hasError = state === RecordingState.ERROR;

  // Cleanup function
  const cleanup = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    mediaRecorderRef.current = null;
    resolvePromiseRef.current = null;
  }, []);

  // Error handler
  const handleError = useCallback(
    (message: string, code: string, originalError?: unknown) => {
      const audioError = new AudioRecorderError(message, code, originalError);
      setError(audioError);
      setState(RecordingState.ERROR);
      cleanup();
    },
    [cleanup]
  );

  // Timer management
  useEffect(() => {
    if (state === RecordingState.RECORDING) {
      timerRef.current = window.setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [state]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current?.state !== "inactive") {
        mediaRecorderRef.current?.stop();
      }
      cleanup();
    };
  }, [cleanup]);

  const startRecording = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      audioChunksRef.current = [];
      setDuration(0);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation, noiseSuppression, autoGainControl },
      });

      streamRef.current = stream;
      const mimeType = getBestSupportedMimeType();
      mimeTypeRef.current = mimeType;

      const recorder = new MediaRecorder(stream, {
        mimeType,
        audioBitsPerSecond: 128000,
      });

      recorder.ondataavailable = (event) => {
        if (event.data?.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        processRecording();
      };

      recorder.onerror = (event) => {
        handleError("Recording failed", "RECORDER_ERROR", event.error || event);
      };

      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      setState(RecordingState.RECORDING);
    } catch (err) {
      const errorMap = {
        NotAllowedError: [
          "Microphone access denied. Please grant permission and try again.",
          "PERMISSION_DENIED",
        ],
        NotFoundError: [
          "No microphone found. Please connect a microphone and try again.",
          "NO_MICROPHONE",
        ],
      } as const;

      const errorName = (err as any)?.name;
      const [message, code] = errorMap[errorName as keyof typeof errorMap] || [
        "Failed to start recording. Please check your microphone and try again.",
        "START_FAILED",
      ];

      handleError(message, code, err);
      throw err;
    }
  }, [echoCancellation, noiseSuppression, autoGainControl, handleError]);

  const pauseRecording = useCallback((): void => {
    if (state !== RecordingState.RECORDING || !mediaRecorderRef.current) return;

    try {
      if (mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.requestData();
        mediaRecorderRef.current.pause();
        setState(RecordingState.PAUSED);
      }
    } catch (err) {
      handleError("Failed to pause recording", "PAUSE_FAILED", err);
    }
  }, [state, handleError]);

  const resumeRecording = useCallback((): void => {
    if (state !== RecordingState.PAUSED || !mediaRecorderRef.current) return;

    try {
      if (mediaRecorderRef.current.state === "paused") {
        mediaRecorderRef.current.resume();
        setState(RecordingState.RECORDING);
      }
    } catch (err) {
      handleError("Failed to resume recording", "RESUME_FAILED", err);
    }
  }, [state, handleError]);

  const stopRecording = useCallback((): Promise<AudioRecording> => {
    if (
      !mediaRecorderRef.current ||
      (state !== RecordingState.RECORDING && state !== RecordingState.PAUSED)
    ) {
      return Promise.reject(
        new AudioRecorderError("No active recording", "NO_RECORDING")
      );
    }

    return new Promise<AudioRecording>((resolve) => {
      resolvePromiseRef.current = resolve;
      setState(RecordingState.PROCESSING);

      try {
        const recorder = mediaRecorderRef.current;
        if (recorder && recorder.state !== "inactive") {
          recorder.requestData();
          recorder.stop();
        }
      } catch (err) {
        handleError("Failed to stop recording", "STOP_FAILED", err);
      }
    });
  }, [state, handleError]);

  const processRecording = useCallback((): void => {
    try {
      if (audioChunksRef.current.length === 0) return;

      const mimeType = mimeTypeRef.current;
      const blob = new Blob(audioChunksRef.current, { type: mimeType });

      if (blob.size > 0) {
        const uuid = crypto.randomUUID();
        const extension = getFileExtension(mimeType);
        const filename = `${filenamePrefix}-${uuid}.${extension}`;

        const recording: AudioRecording = {
          blob,
          filename,
          mimeType,
          size: blob.size,
        };

        resolvePromiseRef.current?.(recording);
      }

      cleanup();
      setState(RecordingState.IDLE);
    } catch (err) {
      handleError("Failed to process recording", "PROCESSING_FAILED", err);
    }
  }, [duration, filenamePrefix, cleanup, handleError]);

  const resetRecording = useCallback((): void => {
    cleanup();
    setDuration(0);
    setError(null);
    setState(RecordingState.IDLE);
  }, [cleanup]);

  const clearError = useCallback((): void => {
    setError(null);
    if (state === RecordingState.ERROR) {
      setState(RecordingState.IDLE);
    }
  }, [state]);

  return {
    state,
    formattedDuration: formatDuration(duration),
    error,

    isIdle,
    isRecording,
    isPaused,
    isProcessing,
    hasError,

    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    resetRecording,
    clearError,
  };
}
