import * as Linking from "expo-linking";

export async function openResource(url: string) {
  const supported = await Linking.canOpenURL(url);

  if (!supported) {
    throw new Error("Cannot open file.");
  }

  await Linking.openURL(url);
}

/** Format a byte count into a human readable size string. */
export function formatFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );

  const value = bytes / Math.pow(1024, i);

  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}