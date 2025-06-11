import Groq from "groq-sdk";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { inngest } from "@/inngest/client";
import { createServiceClient } from "@/utils/supabase/service";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  }
);

const getAnalysisPrompt = (username: string) => `
You are a dream retelling assistant helping **${username}** recall and reflect on their dreams. You are given a **transcribed audio recording** in which ${username} narrates a recent dream.

Your job is to process the transcript and return a **faithful, vivid retelling** of the dream from **${username}'s first-person perspective**.

The retelling must stay grounded in what ${username} described. Do **not invent** or embellish. Clarify messy or fragmented speech only when there is enough context, and preserve ambiguity where it exists.

---

### Output the following:

#### 1. Dream Retelling (First-Person Narrative)

* Reconstruct the dream as a flowing, emotionally resonant **first-person story**.
* Use vivid, sensory language — evoke imagery, emotion, and mood.
* Respect the surreal nature of dreams; don't rationalize or normalize.
* Ensure everything is anchored in what ${username} actually described.

---

#### 2. Dream Title
* Give the dream a concise and meaningful title that captures its emotional tone, central image, or core theme.
* The title can be poetic, symbolic, or literal — use whatever feels most natural and expressive based on the dream content.
* Avoid vague titles like “Weird Dream” or “Dream #1”; aim for something that helps ${username} remember and emotionally connect with the dream.

---

#### 3. Emotion Tags

* List 3–7 key emotions ${username} may have experienced during the dream.
* Include both explicitly stated and strongly implied emotions based on tone, context, and outcomes.
* Format: lowercase, single-word (e.g., fear, joy, curiosity, loneliness)

---

#### 4. Locations / Settings

* Identify and briefly describe major dream settings.
* Format as descriptive phrases (e.g., "a room filled with sand", "dark forest at dusk")

---

#### 5. Key Characters

* List the important figures in the dream.
* Use names if given, or describe roles (e.g., "a child holding a red balloon", "my cousin from years ago")

---

#### 6. Dream Image Prompt

* Create a rich and emotionally resonant text prompt that could be used to generate an image inspired by this dream.
* The image should reflect a key moment, emotional theme, or symbolic insight from the dream.
* Include core details from the dream: setting(s), important figures or symbols, notable objects or actions.
* Use lighting, color, and composition to reflect the emotional tone (from the emotion tags).
* You may extrapolate symbolically or stylistically to express dream logic — floating objects, surreal architecture, repeating symbols, hazy light — especially if details are vague or fragmented.
* Default to a dreamy, surreal, emotionally expressive visual style unless the dream is explicitly grounded in physical realism.
* Do not use photorealism unless it's clearly suggested by the dream's tone and content.
* The result should feel like a snapshot from the dreamer's memory: vivid, strange, symbolic, emotionally truthful.
* Output only a single paragraph of image description. Do not label it or explain it.

---

### Notes:

* You are working with transcribed speech: it may be unstructured or incomplete.
* Fix grammar and flow, but **do not reinterpret or invent**.
* Prioritize helping ${username} **remember and emotionally reconnect** with the dream.
* When in doubt, preserve ambiguity rather than assume or invent.
`;

export const processRecording = inngest.createFunction(
  { id: "process-recording" },
  { event: "recording/created" },
  async ({ event, step }) => {
    const supabase = createServiceClient();
    const { recordingId, audioStoragePath, userId } = event.data;

    const user = await step.run("fetch-user", async () => {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("name, email")
        .eq("id", userId)
        .limit(1)
        .single();

      if (!userData || userError) {
        throw Error("Failed to fetch user.");
      }

      return { id: userId, ...userData };
    });

    const transcription = await step.run("transcribe-recording", async () => {
      const { data: audioBlob, error: audioBlobError } = await supabase.storage
        .from("recordings")
        .download(audioStoragePath);

      if (!audioBlob || audioBlobError) {
        throw Error("Failed to fetch audio recording.");
      }

      const groq = new Groq();

      // Convert Blob to File for Groq API
      const file = new File([audioBlob], audioStoragePath, {
        type: audioBlob.type,
        lastModified: Date.now(),
      });

      const transcriptionResult = await groq.audio.transcriptions.create({
        file,
        model: "whisper-large-v3",
        response_format: "verbose_json",
      });

      const { error } = await supabase
        .from("recordings")
        .update({ raw_transcription: transcriptionResult.text })
        .eq("id", recordingId);

      if (error) {
        throw Error("Failed to update recording's raw transcription.");
      }

      return transcriptionResult.text;
    });

    const analysis = await step.run("analyze-recording", async () => {
      const analysisPrompt = getAnalysisPrompt(user.name);

      const { object } = await generateObject({
        model: google("models/gemini-2.5-flash-preview-04-17"),
        schema: z.object({
          summary: z.string(),
          title: z.string(),
          emotionTags: z.array(z.string()),
          locationSettings: z.array(z.string()),
          keyCharacters: z.array(z.string()),
          imagePrompt: z.string(),
        }),
        prompt: `Please analyze the following dream transcription:\n\n${transcription}`,
        system: analysisPrompt,
      });

      const { error } = await supabase
        .from("recordings")
        .update({
          summary: object.summary,
          name: object.title,
          emotion_tags: object.emotionTags,
        })
        .eq("id", recordingId);

      if (error) {
        throw Error(
          "Failed to update recording's summary, title, and emotion tags."
        );
      }

      return object;
    });

    return {
      success: true,
      recording: {
        id: recordingId,
        username: user.name,
        rawTranscription: transcription,
        analysis: analysis,
      },
    };
  }
);
