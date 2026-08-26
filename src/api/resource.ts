import { api } from "./client";
import {
  Resource,
  ResourceFolder,
} from "@/types/resource";

export async function getResources(
  params?: {
    page?: number;
    limit?: number;
    subject?: string;
    category?: string;
    q?: string;
    /** "root" → repository root, folder uuid → inside that folder. */
    folder?: string;
  }
) {
  const search = new URLSearchParams();

  if (params?.page)
    search.append("page", params.page.toString());

  if (params?.limit)
    search.append("limit", params.limit.toString());

  if (params?.subject)
    search.append("subject", params.subject);

  if (params?.category)
    search.append("category", params.category);

  if (params?.q)
    search.append("q", params.q);

  if (params?.folder)
    search.append("folder", params.folder);

  const response = await api<{
    success: boolean;
    data: {
      data: Resource[];
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>(`/resources?${search.toString()}`);

  return response.data;
}

export async function getResource(id: string): Promise<Resource> {
  const response = await api<{
    success: boolean;
    data: Resource;
  }>(`/resources/${id}`);

  return response.data;
}

export async function uploadResource(
  formData: FormData
): Promise<Resource> {
  const response = await api<{
    success: boolean;
    data: Resource;
  }>("/resources", {
    method: "POST",
    body: formData,
  });

  return response.data;
}

export async function updateResource(
  id: string,
  body: Partial<Resource>
): Promise<Resource> {
  const response = await api<{
    success: boolean;
    data: Resource;
  }>(`/resources/${id}`, {
    method: "PATCH",
    body,
  });

  return response.data;
}

export async function deleteResource(id: string) {
  await api(`/resources/${id}`, {
    method: "DELETE",
  });
}

export async function searchResources(
  query: string
): Promise<Resource[]> {
  const response = await api<{
    success: boolean;
    data: Resource[];
  }>(`/resources/search?q=${encodeURIComponent(query)}`);

  return response.data;
}

export async function getResourcesBySubject(
  subject: string
): Promise<Resource[]> {
  const response = await api<{
    success: boolean;
    data: Resource[];
  }>(`/resources/subject/${subject}`);

  return response.data;
}

// -----------------------------------------------------------------
// Folder repository
// -----------------------------------------------------------------

/**
 * List folders at a level of the repository.
 * `parentId` of null/undefined lists the repository root.
 */
export async function getFolders(
  parentId?: string | null
): Promise<ResourceFolder[]> {
  const query = parentId
    ? `?parent=${encodeURIComponent(parentId)}`
    : "?parent=root";

  const response = await api<{
    success: boolean;
    data: ResourceFolder[];
  }>(`/resources/folders${query}`);

  return response.data;
}

/** Create a folder, optionally inside a parent folder (teacher only). */
export async function createFolder(
  name: string,
  parentId?: string | null
): Promise<ResourceFolder> {
  const response = await api<{
    success: boolean;
    data: ResourceFolder;
  }>("/resources/folders", {
    method: "POST",
    body: {
      name,
      parent_id: parentId ?? null,
    },
  });

  return response.data;
}

/** Rename a folder (teacher only). */
export async function renameFolder(
  folderId: string,
  name: string
): Promise<ResourceFolder> {
  const response = await api<{
    success: boolean;
    data: ResourceFolder;
  }>(`/resources/folders/${folderId}`, {
    method: "PATCH",
    body: { name },
  });

  return response.data;
}

/** Delete a folder and its sub-folders; files fall back to root. */
export async function deleteFolder(
  folderId: string
) {
  await api(`/resources/folders/${folderId}`, {
    method: "DELETE",
  });
}