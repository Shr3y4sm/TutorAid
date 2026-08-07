import { api } from "@/api/client";

type PickedFile = {
  uri: string;
  name: string;
  mimeType?: string | null;
};

/**
 * Read a local file as base64 string using fetch.
 * Works reliably in React Native.
 */
async function readFileAsBase64(
  uri: string
): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();

  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip the data:...;base64, prefix
      const base64 = result.split(",")[1] ?? result;
      resolve(base64);
    };
    reader.onerror = () =>
      reject(new Error("Failed to read file."));
    reader.readAsDataURL(blob);
  });
}

async function uploadFileViaBackend(
  endpoint: string,
  file: PickedFile
): Promise<string> {
  const base64 = await readFileAsBase64(file.uri);

  const response = await api<{
    success: boolean;
    file_url: string;
  }>(endpoint, {
    method: "POST",
    body: {
      base64,
      filename: file.name,
      mimeType:
        file.mimeType ??
        "application/octet-stream",
    },
  });

  return response.file_url;
}

export async function uploadAssignmentFile(
  file: PickedFile,
  teacherId: string
): Promise<string> {
  return uploadFileViaBackend(
    "/teacher/assignments/upload-base64",
    file
  );
}

export async function uploadStudentFile(
  file: PickedFile
): Promise<string> {
  return uploadFileViaBackend(
    "/student/assignments/upload-base64",
    file
  );
}
