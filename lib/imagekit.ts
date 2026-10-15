import { API_BASE_URL } from "@/lib/api";

const PUBLIC_KEY = "public_eCQf3j533fEHqgIkNhMjXChRUf4=";
const UPLOAD_URL = "https://upload.imagekit.io/api/v1/files/upload";
export const MAX_IMAGE_MB = 10;

/** Upload one image to ImageKit and resolve with its public URL. Throws a readable Error on failure. */
export async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("That file isn't an image.");
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) throw new Error(`Image is larger than ${MAX_IMAGE_MB} MB.`);

  let auth: { signature?: string; expire?: number; token?: string };
  try {
    const res = await fetch(`${API_BASE_URL}/imagekit/auth`);
    if (!res.ok) throw new Error(String(res.status));
    auth = await res.json();
  } catch (e) {
    throw new Error(`Couldn't reach the upload server (${e instanceof Error ? e.message : "network error"}).`);
  }
  if (!auth.signature || !auth.token || !auth.expire) throw new Error("Upload server returned invalid credentials.");

  const body = new FormData();
  body.append("file", file);
  body.append("fileName", file.name || `image-${Date.now()}.png`);
  body.append("publicKey", PUBLIC_KEY);
  body.append("signature", auth.signature);
  body.append("expire", String(auth.expire));
  body.append("token", auth.token);
  body.append("useUniqueFileName", "true");

  const res = await fetch(UPLOAD_URL, { method: "POST", body });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json.url) throw new Error(json.message || `Upload failed (${res.status}).`);
  return json.url as string;
}
