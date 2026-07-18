// TEMPORARY - Uploads disabled

type PickedFile = {
  uri: string;
  name: string;
  mimeType?: string | null;
};

export async function uploadAssignmentFile(
  file: PickedFile,
  teacherId: string
): Promise<string> {
  console.log("Upload skipped:", file.name);
  return "";
}