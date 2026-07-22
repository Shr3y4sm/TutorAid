import { api } from "./client";
import { Resource } from "@/types/resource";

export async function getResources(
  params?: {
    page?: number;
    limit?: number;
    subject?: string;
    category?: string;
    q?: string;
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