import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { helloWorld, processRecording } from "@/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [helloWorld, processRecording],
});
