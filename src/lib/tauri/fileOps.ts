// ============================================================
//  lib/tauri/fileOps.ts
//  All Tauri invoke() calls live here. Components NEVER call
//  invoke() directly — they use these typed wrappers.
//  This makes mocking easy and keeps components decoupled from Tauri.
// ============================================================

import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";

export interface FileReadResult {
  path: string;
  name: string;
  dataUrl: string; // base64 data URL
}

/**
 * Opens the system file picker filtered to images.
 * Returns null if the user cancelled.
 */
export async function pickImageFile(): Promise<string | null> {
  const selected = await open({
    multiple: false,
    filters: [
      {
        name: "Images",
        extensions: ["png", "jpg", "jpeg", "gif", "webp", "bmp", "tiff", "svg"],
      },
    ],
  });
  if (!selected || Array.isArray(selected)) return null;
  return selected;
}

/**
 * Reads an image file from disk and returns a base64 data URL.
 * Handled by the Rust backend so we can access arbitrary file paths.
 */
export async function readImageAsDataUrl(path: string): Promise<string> {
  return invoke<string>("read_image_as_data_url", { path });
}

/**
 * Convenience: pick + read in one call.
 */
export async function pickAndReadImage(): Promise<FileReadResult | null> {
  const path = await pickImageFile();
  if (!path) return null;

  const dataUrl = await readImageAsDataUrl(path);
  const name = path.split(/[\\/]/).pop() ?? path;

  return { path, name, dataUrl };
}
