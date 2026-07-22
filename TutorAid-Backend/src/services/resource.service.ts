import crypto from "crypto";
import supabase from "../config/supabase";
import { ApiError } from "../utils/ApiError";

export class ResourceService {
  static async uploadResource(
    teacherId: string,
    body: any,
    file: Express.Multer.File
  ) {
    if (!file) {
      throw new ApiError(400, "File is required.");
    }

    const extension = file.originalname.split(".").pop();
    const fileName = `${crypto.randomUUID()}.${extension}`;
    const storagePath = `${teacherId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("resources")
      .upload(storagePath, file.buffer, {
        contentType: file.mimetype,
      });

    if (uploadError) {
      throw new ApiError(400, uploadError.message);
    }

    const { data: publicUrl } = supabase.storage
      .from("resources")
      .getPublicUrl(storagePath);

    const { data, error } = await supabase
      .from("resources")
      .insert({
        teacher_id: teacherId,
        title: body.title,
        description: body.description,
        subject: body.subject,
        category: body.category,
        file_name: file.originalname,
        file_url: publicUrl.publicUrl,
        file_size: file.size,
        mime_type: file.mimetype,
      })
      .select()
      .single();

    if (error) {
      throw new ApiError(400, error.message);
    }

    return data;
  }

  static async getResources(
  page = 1,
  limit = 20,
  subject?: string,
  category?: string,
  q?: string
) {

  const start = (page - 1) * limit;
  const end = start + limit - 1;

  let query = supabase
    .from("resources")
    .select("*", { count: "exact" });

  if (subject) {
    query = query.eq("subject", subject);
  }

  if (category) {
    query = query.eq("category", category);
  }

  if (q) {
    query = query.ilike("title", `%${q}%`);
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(start, end);

  if (error) {
    throw new ApiError(400, error.message);
  }

  return {
    data,
    page,
    limit,
    total: count ?? 0,
    totalPages: Math.ceil((count ?? 0) / limit),
  };
}

  static async updateResource(
    id: string,
    body: any
  ) {
    const { data, error } = await supabase
      .from("resources")
      .update({
        title: body.title,
        description: body.description,
        subject: body.subject,
        category: body.category,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new ApiError(400, error.message);
    }

    return data;
  }

  static async deleteResource(id: string) {
    const resource = await this.getResource(id);

    const path = resource.file_url.split("/resources/")[1];

    if (path) {
      await supabase.storage
        .from("resources")
        .remove([path]);
    }

    const { error } = await supabase
      .from("resources")
      .delete()
      .eq("id", id);

    if (error) {
      throw new ApiError(400, error.message);
    }
  }

  static async searchResources(query: string) {
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .ilike("title", `%${query}%`);

    if (error) {
      throw new ApiError(400, error.message);
    }

    return data;
  }

  static async getResourcesBySubject(subject: string) {
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .eq("subject", subject)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      throw new ApiError(400, error.message);
    }

    return data;
  }
  static async getResourceStats() {

    const { data, error } =
        await supabase
            .from("resources")
            .select("file_size,download_count,created_at");

    if (error)
        throw new ApiError(400, error.message);

    const totalResources = data.length;

    const totalDownloads =
        data.reduce(
            (sum, r) => sum + (r.download_count ?? 0),
            0
        );

    const totalStorageUsed =
        data.reduce(
            (sum, r) => sum + (r.file_size ?? 0),
            0
        );

    const sevenDaysAgo = new Date();

    sevenDaysAgo.setDate(
        sevenDaysAgo.getDate() - 7
    );

    const recentUploads =
        data.filter(
            r =>
                new Date(r.created_at) >=
                sevenDaysAgo
        ).length;

    return {

        totalResources,

        totalDownloads,

        totalStorageUsed,

        recentUploads,

    };

}
static async getResource(id: string) {

  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new ApiError(404, "Resource not found.");
  }

  return data;
}
}