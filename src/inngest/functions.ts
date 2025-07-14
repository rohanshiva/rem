import Groq from "groq-sdk";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { inngest } from "@/inngest/client";
import { createServiceClient } from "@/utils/supabase/service";
import { downloadFile, uploadFile } from "@/lib/storage";
import Replicate from "replicate";

// Image generation configuration
const IMAGE_MODEL =
  "bingbangboom-lab/flux-dreamscape:b761fa16918356ee07f31fad9b0d41d8919b9ff08f999e2d298a5a35b672f47e";
const IMAGE_STYLE = "BSstyle004";
const IMAGE_CONFIG = {
  model: "dev",
  go_fast: false,
  lora_scale: 1,
  megapixels: "1",
  num_outputs: 1,
  aspect_ratio: "16:9",
  output_format: "webp",
  guidance_scale: 3.5,
  output_quality: 80,
  prompt_strength: 0.8,
  extra_lora_scale: 0.8,
  num_inference_steps: 28,
} as const;

// Generate image using Replicate
async function generateDreamImage(prompt: string): Promise<string> {
  const replicate = new Replicate();
  const styledPrompt = `${prompt}, in the style of ${IMAGE_STYLE}`;

  const output = (await replicate.run(IMAGE_MODEL, {
    input: {
      ...IMAGE_CONFIG,
      prompt: styledPrompt,
    },
  })) as string[];

  return output[0];
}

// Upload image to R2 and update database
async function storeGeneratedImage(
  imageUrl: string,
  recordingId: string,
  userId: string,
  supabase: ReturnType<typeof createServiceClient>
): Promise<string> {
  // Download the generated image
  const imageResponse = await fetch(imageUrl);
  const imageBlob = await imageResponse.blob();

  // Upload to R2
  const imageFileName = `${recordingId}-${Date.now()}.webp`;
  const imagePath = `${userId}/images/${imageFileName}`;
  await uploadFile(imagePath, imageBlob);

  // Update recording with image path
  const { error } = await supabase
    .from("recordings")
    .update({ image_storage_path: imagePath, processing: false })
    .eq("id", recordingId);

  if (error) {
    throw Error("Failed to update recording with image path.");
  }

  return imagePath;
}

// Complete image generation process
async function processImageGeneration(
  imagePrompt: string,
  recordingId: string,
  userId: string,
  supabase: ReturnType<typeof createServiceClient>
): Promise<string> {
  const imageUrl = await generateDreamImage(imagePrompt);
  const imagePath = await storeGeneratedImage(
    imageUrl,
    recordingId,
    userId,
    supabase
  );
  return imagePath;
}

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
      const audioBlob = await downloadFile(audioStoragePath);

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

    const imagePrompt = await step.run("generate-image-prompt", async () => {
      const { object } = await generateObject({
        model: google("models/gemini-2.5-flash-preview-04-17"),
        schema: z.object({
          imagePrompt: z.string(),
        }),
        prompt: analysis.summary,
        system: `You are a cinematic image prompt engineer for Dream Machine. Your task is to transform dream descriptions into evocative, visually grounded image prompts. Capture the emotional tone and surreal quality of the dream while staying faithful to its key symbols, characters, and cultural or spiritual references. Describe clearly visualizable scenes, using specific imagery, actions, and environments. Avoid generic or misleading metaphors. Write one vivid, cinematic sentence that can be realistically rendered by a image model.`,
      });

      return object.imagePrompt;
    });

    const imageStoragePath = await step.run("generate-image", async () => {
      return await processImageGeneration(
        imagePrompt,
        recordingId,
        user.id,
        supabase
      );
    });

    return {
      success: true,
      recording: {
        id: recordingId,
        username: user.name,
        rawTranscription: transcription,
        analysis: analysis,
        imagePrompt: imagePrompt,
        imageStoragePath: imageStoragePath,
      },
    };
  }
);
