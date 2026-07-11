export interface AiTool {
  id: number;
  title: string;
  description: string;
}

export interface TeacherAiResponse {
  success: boolean;
  data: AiTool[];
}