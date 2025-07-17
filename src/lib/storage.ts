import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const BUCKET_NAME = "rem";

// Create S3 client configured for Cloudflare R2
const createClient = () => {
  return new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
};

export async function uploadFile(
  path: string, 
  blob: Blob, 
  options?: { cacheControl?: string }
): Promise<string> {
  const client = createClient();
  const buffer = Buffer.from(await blob.arrayBuffer());
  
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: path,
    Body: buffer,
    ContentType: blob.type,
    CacheControl: options?.cacheControl || "public, max-age=3600",
  });

  await client.send(command);
  return path;
}

export async function downloadFile(path: string): Promise<Blob> {
  const client = createClient();
  
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: path,
  });

  const response = await client.send(command);
  
  if (!response.Body) {
    throw new Error("No file content received");
  }

  // Convert stream to blob
  const chunks: Uint8Array[] = [];
  const reader = response.Body.transformToWebStream().getReader();
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  return new Blob(chunks, { 
    type: response.ContentType || "application/octet-stream" 
  });
}

export async function deleteFile(path: string): Promise<void> {
  const client = createClient();
  
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: path,
  });

  await client.send(command);
}

export async function getPresignedUrl(path: string, expiresIn: number = 3600): Promise<string> {
  const client = createClient();
  
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: path,
  });

  return await getSignedUrl(client, command, { expiresIn });
}