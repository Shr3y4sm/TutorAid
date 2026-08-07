import { api } from "@/api/client";

type PickedFile = {
  uri: string;
  name: string;
  mimeType?: string | null;
};

export async function uploadAssignmentFile(
  file: PickedFile,
  teacherId: string
): Promise<string> {
  const formData = new FormData();

  // React Native FormData expects { uri, name, type }
  formData.append("file", {
    uri: file.uri,
    name: file.name,
    type: file.mimeType ?? "application/octet-stream",
  } as any);

  const response = await api<{
    success: boolean;
    file_url: string;
  }>("/teacher/assignments/upload", {
    method: "POST",
    body: formData,
  });

  return response.file_url;
}

export async function uploadStudentFile(
  file: PickedFile
): Promise<string> {
  const formData = new FormData();

  formData.append("file", {
    uri: file.uri,
    name: file.name,
    type: file.mimeType ?? "application/octet-stream",
  } as any);

  const response = await api<{
    success: boolean;
    file_url: string;
  }>("/student/assignments/upload", {
    method: "POST",
    body: formData,
  });

  return response.file_url;
}
