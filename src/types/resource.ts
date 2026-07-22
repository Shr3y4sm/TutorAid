export interface Resource {
  id: string;
  teacher_id: string;
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

export interface ResourceUpload {
  teacher_id: string;
  title: string;
  description?: string;
  subject: string;
  category: string;
}