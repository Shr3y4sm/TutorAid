export interface Resource {
  id: string;
  teacher_id: string;
  folder_id?: string | null;
  title: string;
  description?: string;
  subject: string;
  category: string;
  file_name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  created_at: string;
  updated_at: string;
}

/** Folder in a teacher's resource repository. */
export interface ResourceFolder {
  id: string;
  teacher_id: string;
  parent_id: string | null;
  name: string;
  created_at: string;
  updated_at: string;
}

/** One entry of a folder breadcrumb trail. */
export interface FolderCrumb {
  id: string | null;
  name: string;
}

export interface ResourceUpload {
  teacher_id: string;
  title: string;
  description?: string;
  subject: string;
  category: string;
}