import crypto from "crypto";
import supabase from "../config/supabase";
import { ApiError } from "../utils/ApiError";
import {
  getTeacherStudentIds,
  notifyStudents,
} from "../utils/notify";

/** Folder node in a teacher's resource repository. */
export interface ResourceFolderRow {
  id: string;
  teacher_id: string;
  parent_id: string | null;
  name: string;
  created_at: string;
  updated_at: string;
}

export class ResourceService {
  /**
   * Resolve the `teachers.id` for the authenticated auth user.
   * The client never dictates teacher identity server-side.
   */
  static async resolveTeacherId(
    authUserId: string
  ): Promise<string> {
    const { data, error } = await supabase
      .from("teachers")
      .select("id")
      .eq("auth_user_id", authUserId)
      .maybeSingle();

    if (error || !data) {
      throw new ApiError(
        403,
        "Teacher profile not found."
      );
    }

    return data.id as string;
  }

  static async uploadResource(
    authUserId: string,
    body: any,
    file: Express.Multer.File
  ) {
    if (!file) {
      throw new ApiError(400, "File is required.");
    }

    const teacherId = await this.resolveTeacherId(
      authUserId
    );

    // Optional destination folder — must belong to the teacher.
    let folderId: string | null = null;

    if (body.folder_id) {
      await this.getOwnedFolder(
        String(body.folder_id),
        teacherId
      );
      folderId = String(body.folder_id);
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
        folder_id: folderId,
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

    // Notify the teacher's students (never blocks the upload).
    try {
      const studentIds =
        await getTeacherStudentIds(teacherId);

      await notifyStudents(studentIds, {
        teacher_id: teacherId,
        title: "New Resource",
        message: `${body.title} was added to your resources.`,
        type: "resource",
      });
    } catch (notifyErr) {
      console.warn(
        "resource notification failed:",
        notifyErr
      );
    }

    return data;
  }

  static async getResources(
  page = 1,
  limit = 20,
  subject?: string,
  category?: string,
  q?: string,
  folder?: string
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

  // Folder scoping: "root" → files at the repository root,
  // a folder uuid → files inside that folder, absent → all files.
  if (folder === "root") {
    query = query.is("folder_id", null);
  } else if (folder) {
    query = query.eq("folder_id", folder);
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

  // -----------------------------------------------------------------
  // Folder repository
  // -----------------------------------------------------------------

  /** Fetch a folder and verify it belongs to the given teacher. */
  static async getOwnedFolder(
    folderId: string,
    teacherId: string
  ): Promise<ResourceFolderRow> {
    const { data, error } = await supabase
      .from("resource_folders")
      .select("*")
      .eq("id", folderId)
      .maybeSingle();

    if (error || !data || data.teacher_id !== teacherId) {
      throw new ApiError(
        404,
        "Folder not found in your repository."
      );
    }

    return data as ResourceFolderRow;
  }

  /**
   * List folders directly inside `parentId`.
   * Teachers see their own tree; students see every folder
   * at that level across all teachers (read-only browsing).
   */
  static async getFolders(opts: {
    authUserId?: string;
    role?: string;
    parentId?: string | null; // undefined → root level
  }): Promise<ResourceFolderRow[]> {
    let teacherId: string | undefined;

    if (opts.role === "teacher" && opts.authUserId) {
      teacherId = await this.resolveTeacherId(
        opts.authUserId
      );
    }

    let query = supabase
      .from("resource_folders")
      .select("*");

    if (teacherId) {
      query = query.eq("teacher_id", teacherId);
    }

    query =
      opts.parentId == null
        ? query.is("parent_id", null)
        : query.eq("parent_id", opts.parentId);

    const { data, error } = await query.order("name", {
      ascending: true,
    });

    if (error) {
      throw new ApiError(400, error.message);
    }

    return (data ?? []) as ResourceFolderRow[];
  }

  static async createFolder(
    authUserId: string,
    name: string,
    parentId?: string | null
  ): Promise<ResourceFolderRow> {
    const teacherId = await this.resolveTeacherId(
      authUserId
    );

    if (parentId) {
      await this.getOwnedFolder(parentId, teacherId);
    }

    const { data, error } = await supabase
      .from("resource_folders")
      .insert({
        teacher_id: teacherId,
        parent_id: parentId ?? null,
        name: name.trim(),
      })
      .select()
      .single();

    if (error) {
      throw new ApiError(
        400,
        error.code === "23505"
          ? "A folder with this name already exists here."
          : error.message
      );
    }

    return data as ResourceFolderRow;
  }

  static async renameFolder(
    authUserId: string,
    folderId: string,
    name: string
  ): Promise<ResourceFolderRow> {
    const teacherId = await this.resolveTeacherId(
      authUserId
    );

    await this.getOwnedFolder(folderId, teacherId);

    const { data, error } = await supabase
      .from("resource_folders")
      .update({
        name: name.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", folderId)
      .select()
      .single();

    if (error) {
      throw new ApiError(400, error.message);
    }

    return data as ResourceFolderRow;
  }

  /**
   * Delete a folder. Sub-folders cascade (FK ON DELETE CASCADE);
   * files inside fall back to the repository root.
   */
  static async deleteFolder(
    authUserId: string,
    folderId: string
  ): Promise<void> {
    const teacherId = await this.resolveTeacherId(
      authUserId
    );

    await this.getOwnedFolder(folderId, teacherId);

    const { error } = await supabase
      .from("resource_folders")
      .delete()
      .eq("id", folderId);

    if (error) {
      throw new ApiError(400, error.message);
    }
  }

  /** Breadcrumb trail for a folder, ordered root → current. */
  static async getFolderPath(
    folderId: string
  ): Promise<
    { id: string; name: string }[]
  > {
    const crumbs: { id: string; name: string }[] = [];

    let currentId: string | null = folderId;

    while (currentId && crumbs.length < 25) {
      const { data, error } = await supabase
        .from("resource_folders")
        .select("id, parent_id, name")
        .eq("id", currentId)
        .maybeSingle();

      const row = data as {
        id: string;
        parent_id: string | null;
        name: string;
      } | null;

      if (error || !row) break;

      crumbs.unshift({
        id: row.id,
        name: row.name,
      });
      currentId = row.parent_id;
    }

    return crumbs;
  }
}